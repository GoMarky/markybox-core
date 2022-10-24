import * as fns from 'date-fns';
import { isUndefinedOrNull } from '@/core/base/types';

export type Mime = 'text/plain';

export function timestamp(timestamp: number): string {
  return fns.format(fns.fromUnixTime(timestamp).getTime(), 'yyyy-MM-dd hh:mm',);
}

export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

export function copyStringNumberOfTimes(text: string, amount: number): string {
  let result: string = '';

  while (amount) {
    result += text;
    amount--;
  }

  return result;
}

export function removeLastLetter(text: string): string {
  if (isUndefinedOrNull(text)) {
    return '';
  }

  return text.slice(0, -1);
}

export function removeFirstLetter(text: string): string {
  if (isUndefinedOrNull(text)) {
    return '';
  }

  return text.slice(1);
}

export function getLastLetter(text: string): string {
  if (!text?.length) {
    return '';
  }

  return text.at(-1) as string;
}

export function isEmptyString(str?: string): boolean {
  return str?.length === 0;
}

export function toUppercase(str?: string): string {
  if (!str) {
    return '';
  }

  return str.toUpperCase();
}

export function toLowerCase(str?: string): string {
  if (!str) {
    return '';
  }

  return str.toLowerCase();
}

export function ensureEndSlash(string: string) {
  return string.endsWith('/') ? string : `${string}/`;
}

export function ensureNoFirstSlash(str: string): string {
  if (str === '/') {
    return '/';
  }

  return str[0] === '/' ? str.slice(1) : str;
}

export function isOpenBracket(char: string): boolean {
  if (char.length > 1) {
    return false;
  }

  return char === '[';
}

export function isCloseBracket(char: string): boolean {
  if (char.length > 1) {
    return false;
  }

  return char === ']';
}

export function isOpenBrace(char: string): boolean {
  if (char.length > 1) {
    return false;
  }

  return char === '{';
}

export function isCloseBrace(char: string): boolean {
  if (char.length > 1) {
    return false;
  }

  return char === '}';
}

export function isOpenParenthesis(char: string): boolean {
  if (char.length > 1) {
    return false;
  }

  return char === '(';
}

export function isColon(char: string): boolean {
  if (char.length > 1) {
    return false;
  }

  return char === ':';
}

export function isCloseParenthesis(char: string): boolean {
  if (char.length > 1) {
    return false;
  }

  return char === ')';
}

export function isParen(char?: string): boolean {
  if (!char) {
    return false;
  }

  return isOpenBrace(char) || isCloseBrace(char) || isOpenBracket(char) || isCloseBracket(char) || isOpenParenthesis(char) || isCloseParenthesis(char);
}

export function isDot(char?: string): boolean {
  if (!char) {
    return false;
  }

  return char === '.';
}

export function containsDot(text: string): boolean {
  return text.includes('.');
}

export function containsColon(text: string): boolean {
  return text.includes(':');
}

export function containsParen(text: string): boolean {
  for (let i = 0; i < text.length; i++) {
    if (isParen(text.charAt(i))) {
      return true;
    }
  }

  return false;
}
