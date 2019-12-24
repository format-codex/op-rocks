
interface BaseOp<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> {
  perform(ctx: TContext, ...args: TArgs): Promise<TResult>;
}

interface DeterministicOp<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> extends BaseOp<TResult, TContext, TArgs> {
  isDeterministic: true;
}

interface NonDeterministicOp<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> extends BaseOp<TResult, TContext, TArgs> {
  isDeterministic?: false;
}

interface SideEffectFreeOp<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> extends BaseOp<TResult, TContext, TArgs> {
  isSideEffectFree: true;
}

interface NonSideEffectFreeOp<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> extends BaseOp<TResult, TContext, TArgs> {
  isSideEffectFree?: false;
}

interface SyncOp<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> extends BaseOp<TResult, TContext, TArgs> {
  isSync: true;
  performSync(ctx: TContext, ...args: TArgs): TResult;
}

interface NonSyncOp<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> extends BaseOp<TResult, TContext, TArgs> {
  isSync?: false;
}

export type Op<TResult=void, TContext extends object=object, TArgs extends unknown[] = [], TSettings extends {} = {}>
  = BaseOp<TResult, TContext, TArgs>
    & (DeterministicOp<TResult, TContext, TArgs> | (TSettings extends {isDeterministic:true} ? never : NonDeterministicOp<TResult, TContext, TArgs>))
    & (SideEffectFreeOp<TResult, TContext, TArgs> | (TSettings extends {isSideEffectFree:true} ? never : NonSideEffectFreeOp<TResult, TContext, TArgs>))
    & (SyncOp<TResult, TContext, TArgs> | (TSettings extends {isSync:true} ? never : NonSyncOp<TResult, TContext, TArgs>));

export namespace Op {
  export type ExtractResult<TOp extends BaseOp<any, any, any>> = TOp extends BaseOp<infer U, any, any> ? U : never;
  export type ExtractContext<TOp extends BaseOp<any, any, any>> = TOp extends BaseOp<any, infer U, any> ? U : never;
  export type ExtractArgs<TOp extends BaseOp<any, any, any>> = TOp extends BaseOp<any, any, infer U> ? U : never;
}

export class ConstOp<T> implements Op<T, object, [], {isDeterministic:true, isSideEffectFree:true, isSync:true}> {
  constructor(readonly value: T) { }
  async perform(_: object): Promise<T> { return this.value; }
  performSync(_: object): T { return this.value; }
  get isDeterministic(): true { return true; }
  get isSideEffectFree(): true { return true; }
  get isSync(): true { return true; }
}

export class PureSyncOp<T, TArgs extends unknown[]> implements Op<T, object, TArgs, {isDeterministic:true, isSideEffectFree:true, isSync:true}> {
  constructor(readonly func: (...args: TArgs) => T) { }
  async perform(_: object, ...args: TArgs): Promise<T> { return this.func(...args); }
  performSync(_: object, ...args: TArgs): T { return this.func(...args); }
  get isDeterministic(): true { return true; }
  get isSideEffectFree(): true { return true; }
  get isSync(): true { return true; }
}

class BoundOp<TResult, TContext extends object, TArgs extends unknown[]>
implements BaseOp<TResult, TContext, []> {
  
  constructor(
    readonly op: Op<TResult, TContext, TArgs>,
    readonly argOps: { [P in keyof TArgs]: Op<TArgs[P], TContext, []> }
  ) {
  }

  get isDeterministic(): boolean {
    const value = !!this.op.isDeterministic && !this.argOps.some(op => !op.isDeterministic);
    Object.defineProperty(this, 'isDeterministic', {value});
    return value;
  }

  get isSideEffectFree(): boolean {
    const value = !!this.op.isSideEffectFree && !this.argOps.some(op => !op.isSideEffectFree);
    Object.defineProperty(this, 'isSideEffectFree', {value});
    return value;
  }

  get isSync(): boolean {
    const value = !!this.op.isSync && !this.argOps.some(op => !op.isSync);
    Object.defineProperty(this, 'isSync', {value});
    return value;
  }

  async perform(ctx: TContext): Promise<TResult> {
    const args: TArgs = await Promise.all(this.argOps.map(op => op.perform(ctx))) as TArgs;
    return await this.op.perform(ctx, ...args);
  }

  performSync(ctx: TContext): TResult {
    const args: TArgs = this.argOps.map(op => (<any>op).performSync(ctx)) as TArgs;
    return (<any>this.op).performSync(ctx, ...args);
  }

}

type CalcDeterministic<TOp, TArgOps, TDet, TNon> = (
  TOp extends DeterministicOp<any, any, any> ?
  (TArgOps extends { [index: number]: DeterministicOp<any, any, any> } ? TDet : TNon|TDet)
  : TNon|TDet
);

type CalcSideEffectFree<TOp, TArgOps, TDet, TNon> = (
  TOp extends SideEffectFreeOp<any, any, any> ?
  (TArgOps extends { [index: number]: SideEffectFreeOp<any, any, any> } ? TDet : TNon|TDet)
  : TNon|TDet
);

type CalcSync<TOp, TArgOps, TDet, TNon> = (
  TOp extends SyncOp<any, any, any> ?
  (TArgOps extends { [index: number]: SyncOp<any, any, any> } ? TDet : TNon|TDet)
  : TNon|TDet
);

export function bindOp
<
  TResult,
  TContext extends object,
  TArgs extends unknown[],
  TOp extends Op<TResult, TContext, TArgs>,
  TArgOps extends { [P in keyof TArgs]: Op<TArgs[P], TContext, []> }
>
(
  op: TOp,
  argOps: TArgOps
)
:
BaseOp<TResult, TContext, []>
  & CalcDeterministic<TOp, TArgOps, DeterministicOp<TResult, TContext, []>, NonDeterministicOp<TResult, TContext, []>>
  & CalcSideEffectFree<TOp, TArgOps, SideEffectFreeOp<TResult, TContext, []>, NonSideEffectFreeOp<TResult, TContext, []>>
  & CalcSync<TOp, TArgOps, SyncOp<TResult, TContext, []>, NonSyncOp<TResult, TContext, []>>
{
  return new BoundOp(op, argOps) as any;
}

export class Get<TValue, THolder extends {readonly [P in TKey]: TValue}, TKey extends keyof TValue>
implements NonDeterministicOp<TValue, object, [THolder, TKey]>,
  NonSideEffectFreeOp<TValue, object, [THolder, TKey]>,
  SyncOp<TValue, object, [THolder, TKey]> {

  async perform(_: object, holder: THolder, key: TKey) { return holder[key]; }
  performSync(_: object, holder: THolder, key: TKey) { return holder[key]; }
  get isSync(): true { return true; }

}

export class Set<TValue, THolder extends {[P in TKey]: TValue}, TKey extends keyof TValue>
implements NonDeterministicOp<TValue, object, [THolder, TKey, TValue]>,
  NonSideEffectFreeOp<TValue, object, [THolder, TKey, TValue]>,
  SyncOp<TValue, object, [THolder, TKey, TValue]> {

  async perform(_: object, holder: THolder, key: TKey, value: TValue): Promise<TValue> {
    (<any>holder)[key] = value;
    return value;
  }
  performSync(_: object, holder: THolder, key: TKey, value: TValue): TValue {
    (<any>holder)[key] = value;
    return value;
  }
  get isSync(): true { return true; }

}

export class Mutate<TValue, THolder extends {[P in TKey]: TValue}, TKey extends keyof TValue>
implements NonDeterministicOp<TValue, object, [THolder, TKey]>,
  NonSideEffectFreeOp<TValue, object, [THolder, TKey]>,
  SyncOp<TValue, object, [THolder, TKey]> {

  constructor(readonly mutate: (val:TValue) => TValue) {
  }

  async perform(_: object, holder: THolder, key: TKey): Promise<TValue> {
    const value = this.mutate(holder[key]);
    (<any>holder)[key] = value;
    return value;
  }
  performSync(_: object, holder: THolder, key: TKey): TValue {
    const value = this.mutate(holder[key]);
    (<any>holder)[key] = value;
    return value;
  }
  get isSync(): true { return true; }

}

export class ContextGet<TValue, TContext extends {readonly [P in TKey]: TValue}, TKey extends keyof TValue>
implements NonDeterministicOp<TValue, TContext, [TKey]>,
  NonSideEffectFreeOp<TValue, TContext, [TKey]>,
  SyncOp<TValue, TContext, [TKey]> {
  
  async perform(ctx: TContext, key: TKey): Promise<TValue> { return ctx[key]; }
  performSync(ctx: TContext, key: TKey): TValue { return ctx[key]; }
  get isSync(): true { return true; }

}

export class ContextSet<TValue, TContext extends {readonly [P in TKey]: TValue}, TKey extends keyof TValue>
implements NonDeterministicOp<TValue, TContext, [TKey, TValue]>,
  NonSideEffectFreeOp<TValue, TContext, [TKey, TValue]>,
  SyncOp<TValue, TContext, [TKey, TValue]> {
  
  async perform(ctx: TContext, key: TKey, value: TValue): Promise<TValue> {
    (<any>ctx)[key] = value;
    return value;
  }
  performSync(ctx: TContext, key: TKey, value: TValue): TValue {
    (<any>ctx)[key] = value;
    return value;
  }
  get isSync(): true { return true; }

}

export class ContextMutate<TValue, TContext extends {readonly [P in TKey]: TValue}, TKey extends keyof TValue>
implements NonDeterministicOp<TValue, TContext, [TKey]>,
  NonSideEffectFreeOp<TValue, TContext, [TKey]>,
  SyncOp<TValue, TContext, [TKey]> {
  
  constructor(readonly mutate: (val:TValue) => TValue) {
  }

  async perform(ctx: TContext, key: TKey): Promise<TValue> {
    const value = this.mutate(ctx[key]);
    (<any>ctx)[key] = value;
    return value;
  }
  performSync(ctx: TContext, key: TKey): TValue {
    const value = this.mutate(ctx[key]);
    (<any>ctx)[key] = value;
    return value;
  }
  get isSync(): true { return true; }

}

export class ContextGetSelf<TContext extends object>
implements NonDeterministicOp<TContext, TContext, []>,
  SideEffectFreeOp<TContext, TContext, []>,
  SyncOp<TContext, TContext, []> {

  async perform(ctx: TContext): Promise<TContext> { return ctx; }
  performSync(ctx: TContext): TContext { return ctx; }
  get isSync(): true { return true; }
  get isSideEffectFree(): true { return true; }

}
