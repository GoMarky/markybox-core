import { GlyphDOMNode } from '@/core/renderer/glyphs/GlyphDOMNode';

export class GlyphTextNode extends GlyphDOMNode<Text> {
  constructor(rawText: string, start: number, end: number) {
    super(start, end);

    this._el = document.createTextNode(rawText);
    this._el.textContent = rawText;
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();
    this._el.remove();
  }
}
