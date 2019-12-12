
export interface Op<TResult=void, TContext extends object=object, TArgs extends unknown[] = []> {
  perform(ctx: TContext, ...args: TArgs): Promise<TResult>;
}
