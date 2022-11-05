import { GlyphDOMElement } from '@/core/renderer/chars/GlyphDOMElement';
import { toPixel } from '@/core/base/dom';

export abstract class BaseLayer extends GlyphDOMElement<HTMLDivElement> {
  public top(px: number): void {
    this._el.style.top = toPixel(px);
  }

  public left(px: number): void {
    this._el.style.left = toPixel(px);
  }

  public hide(): void {
    this._el.style.display = 'none';
  }

  public show(): void {
    this._el.style.display = 'block';
  }
}
