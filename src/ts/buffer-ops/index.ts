
import { Op } from '..'

class BufferOp<T, TArgs extends unknown[]> implements Op<T, object, TArgs, {isDeterministic:false, isSideEffectFree:false, isSync:true}> {
  constructor(readonly func: (...args: TArgs) => T) { }
  async perform(_: object, ...args: TArgs): Promise<T> { return this.func(...args); }
  performSync(_: object, ...args: TArgs): T { return this.func(...args); }
  get isSync(): true { return true; }
}

export const alloc = new BufferOp(Buffer.alloc);
export const from = new BufferOp(Buffer.from);

export const getUint8 = new BufferOp((buf: Buffer, offset: number) => buf[offset]);
export const getInt8 = new BufferOp((buf: Buffer, offset: number) => buf[offset] << 24 >> 24);
export const setUint8 = new BufferOp((buf: Buffer, offset: number, value: number) => { buf[offset] = value; });
export const setInt8 = new BufferOp((buf: Buffer, offset: number, value: number) => { buf[offset] = value; });

export const getUint16LE = new BufferOp((buf: Buffer, offset: number) => buf.readUInt16LE(offset));
export const getInt16LE = new BufferOp((buf: Buffer, offset: number) => buf.readInt16LE(offset));
export const getUint32LE = new BufferOp((buf: Buffer, offset: number) => buf.readUInt32LE(offset));
export const getInt32LE = new BufferOp((buf: Buffer, offset: number) => buf.readInt32LE(offset));
export const getBigUint64LE = new BufferOp((buf: Buffer, offset: number) => buf.readBigUInt64LE(offset));
export const getBigInt64LE = new BufferOp((buf: Buffer, offset: number) => buf.readBigInt64LE(offset));
export const getFloat32LE = new BufferOp((buf: Buffer, offset: number) => buf.readFloatLE(offset));
export const getFloat64LE = new BufferOp((buf: Buffer, offset: number) => buf.readDoubleLE(offset));
export const setUint16LE = new BufferOp((buf: Buffer, offset: number, value: number) => { buf.writeUInt16LE(value, offset) });
export const setUint32LE = new BufferOp((buf: Buffer, offset: number, value: number) => { buf.writeUInt32LE(value, offset) });
export const setBigUint64LE = new BufferOp((buf: Buffer, offset: number, value: bigint) => { buf.writeBigUInt64LE(value, offset); });
export const setFloat32LE = new BufferOp((buf: Buffer, offset: number, value: number) => buf.writeFloatLE(value, offset));
export const setFloat64LE = new BufferOp((buf: Buffer, offset: number, value: number) => buf.writeDoubleLE(value, offset));

export const getUint16BE = new BufferOp((buf: Buffer, offset: number) => buf.readUInt16BE(offset));
export const getInt16BE = new BufferOp((buf: Buffer, offset: number) => buf.readInt16BE(offset));
export const getUint32BE = new BufferOp((buf: Buffer, offset: number) => buf.readUInt32BE(offset));
export const getInt32BE = new BufferOp((buf: Buffer, offset: number) => buf.readInt32BE(offset));
export const getBigUint64BE = new BufferOp((buf: Buffer, offset: number) => buf.readBigUInt64BE(offset));
export const getBigInt64BE = new BufferOp((buf: Buffer, offset: number) => buf.readBigInt64BE(offset));
export const getFloat32BE = new BufferOp((buf: Buffer, offset: number) => buf.readFloatBE(offset));
export const getFloat64BE = new BufferOp((buf: Buffer, offset: number) => buf.readDoubleBE(offset));
export const setUint16BE = new BufferOp((buf: Buffer, offset: number, value: number) => { buf.writeUInt16BE(value, offset) });
export const setUint32BE = new BufferOp((buf: Buffer, offset: number, value: number) => { buf.writeUInt32BE(value, offset) });
export const setBigUint64BE = new BufferOp((buf: Buffer, offset: number, value: bigint) => { buf.writeBigUInt64BE(value, offset); });
export const setFloat32BE = new BufferOp((buf: Buffer, offset: number, value: number) => buf.writeFloatBE(value, offset));
export const setFloat64BE = new BufferOp((buf: Buffer, offset: number, value: number) => buf.writeDoubleBE(value, offset));

export const swap16 = new BufferOp((buffer: Buffer) => { buffer.swap16(); });
export const swap32 = new BufferOp((buffer: Buffer) => { buffer.swap32(); });
export const swap64 = new BufferOp((buffer: Buffer) => { buffer.swap64(); });

export const compare = new BufferOp((b1: Buffer, b2: Uint8Array, targetStart?: number, targetEnd?: number, sourceStart?: number, sourceEnd?: number) => b1.compare(b2, targetStart, targetEnd, sourceStart, sourceEnd));
export const copy = new BufferOp((b1: Buffer, b2: Uint8Array, targetStart?: number, sourceStart?: number, sourceEnd?: number) => b1.copy(b2, targetStart, sourceStart, sourceEnd));
export const equals = new BufferOp((b1: Buffer, b2: Uint8Array) => b1.equals(b2));

export const fillBuffer = new BufferOp((b1: Buffer, b2: Uint8Array, offset?: number, end?: number) => { b1.fill(b2, offset, end) });
export const fillString = new BufferOp((b1: Buffer, b2: string, offset?: number, end?: number, encoding?: BufferEncoding) => { b1.fill(b2, offset, end, encoding) });
export const fillByte = new BufferOp((b1: Buffer, b2: number, offset?: number, end?: number) => { b1.fill(b2, offset, end) });

export const includesBuffer = new BufferOp((b1: Buffer, b2: Buffer, offset?: number) => b1.includes(b2, offset));
export const includesString = new BufferOp((b1: Buffer, b2: string, offset?: number, encoding?: BufferEncoding) => b1.includes(b2, offset, encoding));
export const includesByte = new BufferOp((b1: Buffer, b2: number, offset?: number) => b1.includes(b2, offset));

export const indexOfBuffer = new BufferOp((b1: Buffer, b2: Buffer, offset?: number) => b1.indexOf(b2, offset));
export const indexOfString = new BufferOp((b1: Buffer, b2: string, offset?: number, encoding?: BufferEncoding) => b1.indexOf(b2, offset, encoding));
export const indexOfByte = new BufferOp((b1: Buffer, b2: number, offset?: number) => b1.indexOf(b2, offset));

export const lastIndexOfBuffer = new BufferOp((b1: Buffer, b2: Buffer, offset?: number) => b1.lastIndexOf(b2, offset));
export const lastIndexOfString = new BufferOp((b1: Buffer, b2: string, offset?: number, encoding?: BufferEncoding) => b1.lastIndexOf(b2, offset, encoding));
export const lastIndexOfByte = new BufferOp((b1: Buffer, b2: number, offset?: number) => b1.lastIndexOf(b2, offset));

export const subarray = new BufferOp((b1: Buffer, startOffset?: number, endOffset?: number) => b1.subarray(startOffset, endOffset));
export const write = new BufferOp((b1: Buffer, s: string, offset: number, encoding?: BufferEncoding) => b1.write(s, offset, encoding));

export const reverse = new BufferOp((b1: Buffer) => { b1.reverse(); });
