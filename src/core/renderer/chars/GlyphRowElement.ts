import { GlyphWordNode } from '@/core/renderer/glyphs/GlyphWordNode';
import { MChar } from '@/core/renderer/editor/EditorBodyTextarea';
import { GlyphTextNode } from '@/core/renderer/glyphs/GlyphTextNode';
import { GlyphDOMNode } from '@/core/renderer/glyphs/GlyphDOMNode';
import { HTMLRenderer } from '@/core';
import { splitAtIndex } from '@/core/common';
import { IVisitor } from '@/core/renderer/editor/EditorBodyContainer';
import { GlyphNodeFragment } from '@/core/renderer/chars/GlyphNodeFragment';
import { GlyphParenNode, ParenType } from '@/core/renderer/glyphs/GlyphParenNode';
import { GlyphRowGutterElement } from '@/core/renderer/chars/GlyphRowGutterElement';
import { GlyphSpecialCharNode } from '@/core/renderer/glyphs/GlyphSpecialCharNode';
import { containsSpecialSymbol, EditorCSSName } from '@/core/renderer/chars/helpers';
import { GlyphDOMElement } from '@/core/renderer/chars/GlyphDOMElement';
import { insertChildAtIndex } from '@/core/base/dom';
import { getLastElement } from '@/core/base/array';
import { isParen, removeFirstLetter } from '@/core/base/string';

export enum NodeType {
  Whitespace,
  Text,
  SpecialChar,
  Paren,
}

export interface IInputParseResult {
  start: number;
  end: number;
  type: NodeType;
  data: string;
}

export class GlyphRowElement extends GlyphDOMElement<HTMLDivElement> {
  private _text: string = '';
  private _renderer: HTMLRenderer;
  private _gutter: GlyphRowGutterElement;

  public fragment: GlyphNodeFragment = new GlyphNodeFragment();
  public index: number;

  constructor() {
    super();
  }

  public get text(): string {
    return this._text;
  }

  public setParent(renderer: HTMLRenderer, index: number): void {
    this._renderer = renderer;
    this.index = index;
    const rowElement = document.createElement('div');
    rowElement.classList.add(EditorCSSName.Row);
    this._gutter = new GlyphRowGutterElement(renderer, index);
    insertChildAtIndex(this._renderer.display.gutter.el, this._gutter.el, index);

    this._el = rowElement;
  }

  public lastCharIs(char: ParenType): boolean {
    if (!this.fragment) {
      throw new Error(`this.fragment must be defined`);
    }

    const last = getLastElement(this.fragment.children);

    return last instanceof GlyphParenNode && last.type === char;
  }

  public empty(): boolean {
    return this._text.length === 0;
  }

  public contains(column: number): boolean {
    return (this.length - 1) >= column;
  }

  public containsOnlyWhitespaces(): boolean {
    if (!this.fragment) {
      throw new Error(`this.fragment must be defined`);
    }

    return this.fragment.children.every(child => child instanceof GlyphTextNode);
  }

  public setIndex(index: number): void {
    this.index = index;
    this._gutter.index = index;
  }

  public clearLetterByPosition(column: number): void {
    const index = column - 1;

    const { _text } = this;
    const [first, last] = splitAtIndex(index)(_text);
    this._text = first + removeFirstLetter(last);

    this.render();
  }

  public erase(): void {
    return this.setText('');
  }

  public slice(start: number, end: number): void {
    if (this.containsOnlyWhitespaces()) {
      const slicedText = this._text.slice(0, start);

      this._text = slicedText;
      this.render();
    }

    const slicedText = this._text.slice(start, end);
    const restText = this._text.slice(0, -Math.abs(slicedText.length));

    this._text = restText;
  }

  public append(text: string): void {
    this._text = this._text + text;
    this.render();
  }

  public setText(text: string): void {
    this._text = text;

    this.render();
  }

  public inputAt(char: MChar, index: number): void {
    const [first, last] = splitAtIndex(index)(this._text);
    this._text = first + char + last;

    this.render();
  }

  public accept(visitors: IVisitor[]): void {
    const { fragment } = this;

    visitors.forEach((visitor) => visitor.visit(fragment));
  }

  public dispose(): void {
    this._gutter.dispose();
    this.fragment?.dispose();
    this._el.remove();
  }

  public toString(): string {
    return this._text;
  }

  protected parseWord(word: string): IInputParseResult[] {
    const result: IInputParseResult[] = [];
    const chars: string[] = word.split('');
    let tempString: string = '';

    const isWhitespace = word.trim().length === 0;

    if (isWhitespace) {
      result.push({ type: NodeType.Whitespace, data: word, start: 0, end: 0 });
      return result;
    }

    while (chars.length) {
      const char = chars.shift() as string;
      // Если попали на спец-символ
      if (containsSpecialSymbol(char)) {
        // Сохраняем нормальную строку (без спецсимвоволов) в результат парсинга
        if (tempString.length) {
          result.push({ type: NodeType.Text, data: tempString, start: 0, end: 0, });
          tempString = '';
        }

        // Спец.символ добавляем в результат парсинга.
        const specialCharType = isParen(char) ? NodeType.Paren : NodeType.SpecialChar;
        result.push({ type: specialCharType, data: char, start: 0, end: 0 });
        continue;
      }

      // Если не спец.символ - собираем строку символов дальше.
      tempString += char;
    }

    // Если что-то там успело остаться в конце, отправляем в результат парсинга
    if (tempString.length) {
      result.push({ type: NodeType.Text, data: tempString, start: 0, end: 0 });
    }

    return result;
  }

  protected parseText(text: string): IInputParseResult[] {
    const result: IInputParseResult[] = [];
    const words = text.split(/(\s+)/);

    const isAllTextWhiteSpace = text.trim().length === 0;
    if (isAllTextWhiteSpace) {
      result.push({ type: NodeType.Whitespace, data: text, start: 0, end: text.length });
      return result;
    }

    let start = 0;
    let end = 0;

    words.forEach((word) => {
      const parsedWords = this.parseWord(word);

      for (const parsedWord of parsedWords) {
        const { type, data } = parsedWord;
        const length = data.length;

        end += length;
        result.push({ type, data, start, end });
        start += length;
      }
    });

    return result;
  }

  private clearNodeFragment(): void {
    const { fragment } = this;

    this._el.replaceChildren();
    fragment.dispose();
    this.fragment = null!;
  }

  private render(): void {
    const { _text } = this;
    const words = this.parseText(_text);

    this.clearNodeFragment();

    const children: GlyphDOMNode[] = [];

    for (const { data, type, start, end } of words) {
      switch (type) {
        case NodeType.Whitespace: {
          const textNode = new GlyphTextNode(data, start, end);
          children.push(textNode);
          break;
        }
        case NodeType.Text: {
          const wordNode = new GlyphWordNode(data, start, end);
          children.push(wordNode);
          break;
        }
        case NodeType.Paren:
          const parenNode = new GlyphParenNode(data, start, end);
          children.push(parenNode);
          break;
        case NodeType.SpecialChar:
          const specialCharNode = new GlyphSpecialCharNode(data, start, end);
          children.push(specialCharNode);
          break;
      }
    }

    return this.doRender(children);
  }

  private doRender(children: GlyphDOMNode[]): void {
    const { body } = this._renderer;
    const { visitors } = body;

    const nodeFragment = new GlyphNodeFragment();
    nodeFragment.setChildren(children);
    this.fragment = nodeFragment;

    this.accept(visitors);
    this._gutter.expandable = false;
    this._el.appendChild(nodeFragment.el);
  }
}
