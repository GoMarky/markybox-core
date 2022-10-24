export function getFirstElement<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }

  return array.at(0);
}

export function getLastElement<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }

  return array.at(-1);
}

/**
 * @param {number} index
 * @returns {boolean}
 */
export function indexOutOfRange(index: number): boolean {
  return index < 0;
}
