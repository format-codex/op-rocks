
export interface BaseOp<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> {
  perform(ctx: TContext, ...args: TArgs): Promise<TResult>;
}

export interface DeterministicOp<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> extends BaseOp<TResult, TContext, TArgs> {
  isDeterministic: true;
}

export interface NonDeterministicOp<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> extends BaseOp<TResult, TContext, TArgs> {
  isDeterministic?: false;
}

export interface SideEffectFreeOp<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> extends BaseOp<TResult, TContext, TArgs> {
  isSideEffectFree: true;
}

export interface NonSideEffectFreeOp<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> extends BaseOp<TResult, TContext, TArgs> {
  isSideEffectFree?: false;
}

export interface SyncOp<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> extends BaseOp<TResult, TContext, TArgs> {
  isSync: true;
  performSync(ctx: TContext, ...args: TArgs): TResult;
}

export interface NonSyncOp<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> extends BaseOp<TResult, TContext, TArgs> {
  isSync?: false;
}

export type Op<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> = BaseOp<TResult, TContext, TArgs>
  & (DeterministicOp<TResult, TContext, TArgs> | NonDeterministicOp<TResult, TContext, TArgs>)
  & (SideEffectFreeOp<TResult, TContext, TArgs> | NonSideEffectFreeOp<TResult, TContext, TArgs>)
  & (SyncOp<TResult, TContext, TArgs> | NonSyncOp<TResult, TContext, TArgs>);

export namespace Op {
  export type ExtractResult<TOp extends BaseOp<any, any, any>> = TOp extends BaseOp<infer U, any, any> ? U : never;
  export type ExtractContext<TOp extends BaseOp<any, any, any>> = TOp extends BaseOp<any, infer U, any> ? U : never;
  export type ExtractArgs<TOp extends BaseOp<any, any, any>> = TOp extends BaseOp<any, any, infer U> ? U : never;
}

export class ConstOp<T> implements DeterministicOp<T>, SideEffectFreeOp<T>, SyncOp<T> {
  constructor(readonly value: T) { }
  async perform(_: object): Promise<T> { return this.value; }
  performSync(_: object): T { return this.value; }
  get isDeterministic(): true { return true; }
  get isSideEffectFree(): true { return true; }
  get isSync(): true { return true; }
}
