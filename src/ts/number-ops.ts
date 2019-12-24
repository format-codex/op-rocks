
import { ConstOp, PureSyncOp, Op } from '.'

export const EPSILON = new ConstOp(Number.EPSILON);
export const MAX_SAFE_INTEGER = new ConstOp(Number.MAX_SAFE_INTEGER);
export const MIN_SAFE_INTEGER = new ConstOp(Number.MIN_SAFE_INTEGER);
export const MAX_VALUE = new ConstOp(Number.MAX_VALUE);
export const MIN_VALUE = new ConstOp(Number.MIN_VALUE);
export const NEGATIVE_INFINITY = new ConstOp(Number.NEGATIVE_INFINITY);
export const POSITIVE_INFINITY = new ConstOp(Number.POSITIVE_INFINITY);
export const NaN = new ConstOp(Number.NaN);

export const isSafeInteger = new PureSyncOp(Number.isSafeInteger);
export const isInteger = new PureSyncOp(Number.isInteger);
export const isFinite = new PureSyncOp(Number.isFinite);
export const isNaN = new PureSyncOp(Number.isNaN);
export const parseFloat = new PureSyncOp(Number.parseFloat);
export const parseInt = new PureSyncOp(Number.parseInt);

export const add = new PureSyncOp((a: number, b: number) => a + b);
export const multiply = new PureSyncOp((a: number, b: number) => a * b);
export const subtract = new PureSyncOp((a: number, b: number) => a - b);
export const divide = new PureSyncOp((a: number, b: number) => a / b);
export const negate = new PureSyncOp((a: number) => -a);

export const E = new ConstOp(Math.E);
export const LN10 = new ConstOp(Math.LN10);
export const LN2 = new ConstOp(Math.LN2);
export const LOG10E = new ConstOp(Math.LOG10E);
export const LOG2E = new ConstOp(Math.LOG2E);
export const PI = new ConstOp(Math.PI);
export const SQRT1_2 = new ConstOp(Math.SQRT1_2);
export const SQRT2 = new ConstOp(Math.SQRT2);

export const abs = new PureSyncOp(Math.abs);
export const acos = new PureSyncOp(Math.acos);
export const acosh = new PureSyncOp(Math.acosh);
export const asin = new PureSyncOp(Math.asin);
export const asinh = new PureSyncOp(Math.asinh);
export const atan = new PureSyncOp(Math.atan);
export const atan2 = new PureSyncOp(Math.atan2);
export const atanh = new PureSyncOp(Math.atanh);
export const cbrt = new PureSyncOp(Math.cbrt);
export const ceil = new PureSyncOp(Math.ceil);
export const clz32 = new PureSyncOp(Math.clz32);
export const cos = new PureSyncOp(Math.cos);
export const cosh = new PureSyncOp(Math.cosh);
export const exp = new PureSyncOp(Math.exp);
export const expm1 = new PureSyncOp(Math.expm1);
export const floor = new PureSyncOp(Math.floor);
export const fround = new PureSyncOp(Math.fround);
export const hypot = new PureSyncOp(Math.hypot);
export const imul = new PureSyncOp(Math.imul);
export const log = new PureSyncOp(Math.log);
export const log10 = new PureSyncOp(Math.log10);
export const log1p = new PureSyncOp(Math.log1p);
export const log2 = new PureSyncOp(Math.log2);
export const max = new PureSyncOp(Math.max);
export const min = new PureSyncOp(Math.min);
export const pow = new PureSyncOp(Math.pow);
export const round = new PureSyncOp(Math.round);
export const sign = new PureSyncOp(Math.sign);
export const sin = new PureSyncOp(Math.sin);
export const sinh = new PureSyncOp(Math.sinh);
export const sqrt = new PureSyncOp(Math.sqrt);
export const tan = new PureSyncOp(Math.tan);
export const tanh = new PureSyncOp(Math.tanh);
export const trunc = new PureSyncOp(Math.trunc);

export const random: Op<number, object, [], {isSync:true}> = {
  async perform(_: object): Promise<number> { return Math.random(); },
  performSync(_: object): number { return Math.random(); },
  isSync: true,
};
