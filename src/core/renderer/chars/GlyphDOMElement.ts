import { BaseGlyph } from '@/core/BaseGlyph';

export abstract class GlyphDOMElement<T extends Node = HTMLElement> extends BaseGlyph {
  protected _el: T;

  protected constructor() {
    super();
  }

  public get text(): string {
    return this._el.textContent || '';
  }

  public get length(): number {
    return this.text.length;
  }

  public get el(): T {
    return this._el;
  }
}
