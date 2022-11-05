import { GlyphDOMNode } from '@/core/renderer/glyphs/GlyphDOMNode';
import { GlyphDOMElement } from '@/core/renderer/chars/GlyphDOMElement';
import { getFirstElement, getLastElement } from '@/core/base/array';

function removeClasses(glyph: GlyphDOMNode): void {
  const { el } = glyph;

  if (el instanceof HTMLElement) {
    el.removeAttribute('class');
  }
}

export class GlyphNodeFragment extends GlyphDOMElement<DocumentFragment> {
  protected _children: GlyphDOMNode[] = [];
  public parenDepthLevel: number = 0;

  constructor() {
    super();
  }

  public setParentDepthLevel(level: number): void {
    this.parenDepthLevel = level;
  }

  public clearSyntaxClasses(): void {
    for (const glyph of this._children) {
      removeClasses(glyph);
    }
  }

  public setChildren(children: GlyphDOMNode[]): void {
    this._el = document.createDocumentFragment();

    this._children = children;

    for (const glyph of children) {
      this._el.appendChild(glyph.el);
    }
  }

  public at(column: number): GlyphDOMNode | undefined {
    const glyphs = this._children;

    return glyphs.find((glyph) => glyph.start <= column && glyph.end >= column);
  }

  public last(): GlyphDOMNode | undefined {
    return getLastElement(this._children);
  }

  public first(): GlyphDOMNode | undefined {
    return getFirstElement(this._children);
  }

  public get children(): GlyphDOMNode[] {
    return this._children;
  }

  public dispose(): void {
    super.dispose();
    this._children = [];
  }
}
