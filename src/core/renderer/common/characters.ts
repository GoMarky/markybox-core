export const SPECIAL_PROGRAM_CHARACTERS = [
  '~', // Tilde,
  '`', // backquote,
  '!', // exclamation mark
  '@', // ampersat
  '#', // hash
  '$', // dollar
  '%', // percent
  '^', // caret
  '&', // ampersand
  '*', // asterisk
  '(', // open parenthesis
  ')', // close parenthesis
  '-', // minus
  '_', // underscore
  '+', // plus
  '-', // minus
  '=', // equal
  '{', // open brace
  '}', // close brace
  '[', // open bracket
  ']', // close bracket
  '|', // pipe
  '/\/', // backslash,
  '/', // forward slash
  ':', // colon
  '"', // double quote
  "'", // single quote
  '<', // less
  '>', // greater
  ',', // comma
  '.', // dot
  '?', // question mark
];

const specialKeyRegExp = new RegExp(`[^A-Za-z0-9]`);
const numberKeyRegExp = new RegExp(/^\d+$/);

export function containsSpecialSymbol(word: string): boolean {
  return specialKeyRegExp.test(word);
}

export function isStringContainsOnlyNumbers(word: string): boolean {
  return numberKeyRegExp.test(word);
}
