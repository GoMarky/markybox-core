import { GlyphDOMNode } from '@/core/renderer/glyphs/GlyphDOMNode';
import { EditorCSSName } from '@/core/renderer/common/helpers';

export class GlyphIndentNode extends GlyphDOMNode<HTMLSpanElement> {
  constructor(rawText: string, start: number, end: number) {
    super(start, end);

    this._el = document.createElement('span');
    this._el.textContent = rawText;
    this._el.classList.add(EditorCSSName.NodeIndent);
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();
    this._el.remove();
  }
}
