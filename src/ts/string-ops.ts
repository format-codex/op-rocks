
import { PureSyncOp, Op } from '.'

export const getStringLength = new PureSyncOp((v: string) => v.length);
export const fromCharCode = new PureSyncOp(String.fromCharCode);
export const fromCodePoint = new PureSyncOp(String.fromCodePoint);

type WithSelfArg<TFunc, TThis> = TFunc extends (...args: infer A) => infer R
  ? (self: TThis, ...args: A) => R
  : never;

const call = Function.prototype.call;

function bindMethod
<
  T extends {[K in TKey]: (...args: unknown[]) => unknown},
  TKey extends keyof T
>
(
  proto: T,
  key: TKey
)
: WithSelfArg<typeof proto[TKey], T>
{
  return call.bind(proto[key]) as any;
}

export const codePointAt = new PureSyncOp(bindMethod('', 'codePointAt'));
export const padEnd = new PureSyncOp(bindMethod('', 'padEnd'));
export const padStart = new PureSyncOp(bindMethod('', 'padStart'));
export const trimEnd = new PureSyncOp(bindMethod('', 'trimEnd'));
export const trimStart = new PureSyncOp(bindMethod('', 'trimStart'));
export const trimLeft = new PureSyncOp(bindMethod('', 'trimLeft'));
export const trimRight = new PureSyncOp(bindMethod('', 'trimRight'));
export const charAt = new PureSyncOp(bindMethod('', 'charAt'));
export const charCodeAt = new PureSyncOp(bindMethod('', 'charCodeAt'));
export const concat = new PureSyncOp(bindMethod('', 'concat'));
export const endsWith = new PureSyncOp(bindMethod('', 'endsWith'));
export const includes = new PureSyncOp(bindMethod('', 'includes'));
export const indexOf = new PureSyncOp(bindMethod('', 'indexOf'));
export const lastIndexOf = new PureSyncOp(bindMethod('', 'lastIndexOf'));
export const localeCompare = new PureSyncOp(bindMethod('', 'localeCompare'));
export const normalize = new PureSyncOp(bindMethod('', 'normalize'));
export const repeat = new PureSyncOp(bindMethod('', 'repeat'));
export const search = new PureSyncOp(bindMethod('', 'search'));
export const slice = new PureSyncOp(bindMethod('', 'slice'));
export const startsWith = new PureSyncOp(bindMethod('', 'startsWith'));
export const substr = new PureSyncOp(bindMethod('', 'substr'));
export const substring = new PureSyncOp(bindMethod('', 'substring'));
export const toLocaleLowerCase = new PureSyncOp(bindMethod('', 'toLocaleLowerCase'));
export const toLocaleUpperCase = new PureSyncOp(bindMethod('', 'toLocaleUpperCase'));
export const toLowerCase = new PureSyncOp(bindMethod('', 'toLowerCase'));
export const toUpperCase = new PureSyncOp(bindMethod('', 'toUpperCase'));
export const trim = new PureSyncOp(bindMethod('', 'trim'));
interface Matcher {
  [Symbol.match](s: string): RegExpMatchArray;
}
export const match: Op<RegExpMatchArray, object, [string, Matcher], {isSync: true}> = {

  async perform(_:object, s:string, m:Matcher): Promise<RegExpMatchArray> {
    return s.match(m);
  },

  performSync(_:object, s:string, m:Matcher): RegExpMatchArray {
    return s.match(m);
  },

  get isSync(): true { return true; }
};
interface StringReplace {
  [Symbol.replace](s: string, replaceString: string): string;
}
type ReplaceFunc = (substring: string, ...args: unknown[]) => string;
interface FunctionReplace {
  [Symbol.replace](s: string, r: ReplaceFunc): string;
}
type ReplaceArgs = [string, StringReplace, string]
  | [string, FunctionReplace, ReplaceFunc]
  | [string, string | RegExp, string];
export const replace: Op<string, object, ReplaceArgs, {isSync: true}> = {

  async perform(_: object, a:string, b, c): Promise<string> { return (<any>a).replace(b, c); },
  performSync(_: object, a:string, b, c): string { return (<any>a).replace(b, c); },
  get isSync(): true { return true; }

};

interface Splitter {
  [Symbol.split](s: string, limit?: number): string[];
}

export const split: Op<string[], object, [string, Splitter, number?], {isSync:true}> = {
  
  async perform(_: object, s: string, x: Splitter, limit?: number): Promise<string[]> { return s.split(x, limit); },
  performSync(_: object, s: string, x: Splitter, limit?: number): string[] { return s.split(x, limit); },
  get isSync(): true { return true; },

};
