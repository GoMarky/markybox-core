/* eslint-disable @typescript-eslint/no-explicit-any */

const _typeof = {
  undefined: 'undefined',
  number: 'number',
  string: 'string',
  object: 'object',
  function: 'function',
};

/**
 * @author Teodor_Dre <swen295@gmail.com>
 *
 * @description
 *  Return true if parameter is string
 *
 * @param {unknown} str
 *
 * @returns boolean
 */
export function isString(str: unknown): str is string {
  return typeof str === _typeof.string;
}

export function isFunction(func: unknown): func is VoidFunction {
  return typeof func === _typeof.function;
}

export function isTrue(val: unknown): val is true {
  return val === true;
}

export function isFalse(val: unknown): val is false {
  return val === false;
}

/**
 * @author Teodor_Dre <swen295@gmail.com>
 *
 * @description
 *  Return true if parameter is undefined
 *
 * @param {unknown} obj
 *
 * @returns boolean
 */
export function isUndefined(obj: unknown): obj is undefined {
  return typeof obj === _typeof.undefined;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isDefined(obj: unknown): obj is boolean | number | null | string | object {
  return typeof obj !== _typeof.undefined;
}

/**
 * @author Teodor_Dre <swen295@gmail.com>
 *
 * @description
 *  Return true if parameter is pure object
 *
 * @param {unknown} obj
 *
 * @returns boolean
 */
export function isObject(obj: unknown): obj is Record<string, any> {
  return (
    typeof obj === _typeof.object &&
    obj !== null &&
    !Array.isArray(obj) &&
    !(obj instanceof RegExp) &&
    !(obj instanceof Date)
  );
}

export function isUndefinedOrNull(obj: unknown): obj is undefined | null {
  return isUndefined(obj) || obj === null;
}

/**
 * @author Teodor_Dre <swen295@gmail.com>
 *
 * @description
 *  Return true if parameter is number
 *
 * @param {unknown} num
 *
 * @returns boolean
 */
export function isNumber(num: unknown): num is number {
  return typeof num === _typeof.number;
}

/**
 * @author Teodor_Dre <swen295@gmail.com>
 *
 * @description
 *  Convert parameter to number and return true if converted object is number.
 *
 * @param {unknown} obj
 *
 * @returns boolean
 */
export function ensureIsNotNaN(obj: unknown): obj is number {
  return !Number.isNaN(Number(obj));
}
