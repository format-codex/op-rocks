
import { PureSyncOp } from '.'

export const from = new PureSyncOp((v: string | number) => BigInt(v));
export const asIntN = new PureSyncOp(BigInt.asIntN);
export const asUintN = new PureSyncOp(BigInt.asUintN);

export const add = new PureSyncOp((a: bigint, b: bigint) => a + b);
export const multiply = new PureSyncOp((a: bigint, b: bigint) => a * b);
export const subtract = new PureSyncOp((a: bigint, b: bigint) => a - b);
export const divide = new PureSyncOp((a: bigint, b: bigint) => a / b);
export const modulo = new PureSyncOp((a: bigint, b: bigint) => a % b);
export const negate = new PureSyncOp((a: bigint) => -a);
export const pow = new PureSyncOp((a: bigint, b: bigint) => a ** b);

export const bitAnd = new PureSyncOp((a: bigint, b: bigint) => a & b);
export const bitOr = new PureSyncOp((a: bigint, b: bigint) => a | b);
export const bitXor = new PureSyncOp((a: bigint, b: bigint) => a ^ b);
export const bitNot = new PureSyncOp((a: bigint) => ~a);
export const lshift = new PureSyncOp((a: bigint, b: bigint) => a << b);
export const rshiftSigned = new PureSyncOp((a: bigint, b: bigint) => a >> b);
