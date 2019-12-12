
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

export type Op = BaseOp
  & (DeterministicOp | NonDeterministicOp)
  & (SideEffectFreeOp | NonSideEffectFreeOp)
  & (SyncOp | NonSyncOp);

export namespace Op {
  export type ExtractResult<TOp extends BaseOp<any, any, any>> = TOp extends BaseOp<infer U, any, any> ? U : never;
  export type ExtractContext<TOp extends BaseOp<any, any, any>> = TOp extends BaseOp<any, infer U, any> ? U : never;
  export type ExtractArgs<TOp extends BaseOp<any, any, any>> = TOp extends BaseOp<any, any, infer U> ? U : never;
}
  