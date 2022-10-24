import { Char } from '@/core/base/char';

export interface ILogger {
  info(message: string, ...args: any[]): void;

  warn(message: string, ...args: any[]): void;

  error(message: string, ...args: any[]): void;
}

export type ITuplePosition = [number, number]; // [row, column]

export interface IPosition {
  row: number;
  column: number;
}

export function isSystemChar(code: Char): boolean {
  return Object.values(Char).includes(code);
}

export const splitAtIndex = (index: number) => (x: string) => [x.slice(0, index), x.slice(index)];

