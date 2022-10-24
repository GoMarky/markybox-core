import { GlyphDOMNode } from '@/core/renderer/glyphs/GlyphDOMNode';
import { MChar } from '@/core/renderer/editor/EditorBodyTextarea';
import * as string from '@/core/base/string';
import { EditorCSSName } from '@/core/renderer/common/helpers';

export enum ParenType {
  Unknown,
  OpenBrace,
  CloseBrace,
  OpenBracket,
  CloseBracket,
  OpenParenthesis,
  CloseParenthesis,
  Colon,
}

function getParenType(char: MChar): ParenType {
  switch (true) {
    case string.isOpenBrace(char):
      return ParenType.OpenBrace;
    case string.isCloseBrace(char):
      return ParenType.CloseBrace
    case string.isOpenBracket(char):
      return ParenType.OpenBracket;
    case string.isCloseBracket(char):
      return ParenType.CloseBracket
    case string.isOpenParenthesis(char):
      return ParenType.OpenParenthesis
    case string.isCloseParenthesis(char):
      return ParenType.CloseParenthesis
    case string.isColon(char):
      return ParenType.Colon;
    default:
      return ParenType.Unknown
  }
}

export class GlyphParenNode extends GlyphDOMNode<HTMLSpanElement> {
  public readonly type: ParenType;

  constructor(char: string, start: number, end: number) {
    super(start, end);

    this.type = getParenType(char)
    this._el = document.createElement('span');
    this._el.textContent = char;
    this._el.classList.add(EditorCSSName.NodeParen)
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();
    this._el.remove();
  }
}
