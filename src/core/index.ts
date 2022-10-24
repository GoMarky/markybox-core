import { HTMLRenderer } from '@/core/renderer/HTMLRenderer';
import { EditorLang, EditorTheme } from '@/core/renderer/editor/EditorBodyContainer';

function sayHello(): void {
  const args = [
    `\n %c %c %c You're running alpha text editor core - ✰ marky v0.0.1 ✰  %c  %c  %c %c ♥%c♥%c♥ \n\n`,
    'background: #93AF27; padding:5px 0;',
    'background: #93AF27; padding:5px 0;',
    'color: #93AF27; background: #030307; padding:5px 0;',
    'background: #93AF27; padding:5px 0;',
    'background: #ffc3dc; padding:5px 0;',
    'background: #93AF27; padding:5px 0;',
    'color: #ff2424; background: #fff; padding:5px 0;',
    'color: #ff2424; background: #fff; padding:5px 0;',
    'color: #ff2424; background: #fff; padding:5px 0;',
  ];

  console.log(...args);
}

function getSupportedSyntaxes(): EditorLang[] {
  return [
    'plain',
    'python',
    'cpp',
    'json',
    'js',
    'golang'
  ];
}

function getDefaultSyntax(): EditorLang {
  return 'plain';
}

const fileExtensions: Record<string, string[]> = {
  'cpp': ['cpp', 'h'],
  'python': ['py'],
  'golang': ['go'],
  'js': ['js', 'ts'],
  'plain': [],
  'json': ['json'],
}

function getValuableSyntax(filename: string): EditorLang {
  for (const key in fileExtensions) {
    const extensions = fileExtensions[key];

    const [, ext] = filename.split('.');

    if (extensions.includes(ext)) {
      return key as EditorLang;
    }
  }

  return 'plain';
}

sayHello();

export {
  EditorLang,
  EditorTheme,
  HTMLRenderer,
  getDefaultSyntax,
  getValuableSyntax,
  getSupportedSyntaxes,
}
