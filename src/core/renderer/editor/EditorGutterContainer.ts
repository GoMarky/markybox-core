import { EditorCSSName } from '@/core/renderer/chars/helpers';
import { GlyphDOMElement } from '@/core/renderer/chars/GlyphDOMElement';
import { insertChildAtIndex, toPixel } from '@/core/base/dom';

export class EditorGutterContainer extends GlyphDOMElement<HTMLDivElement> {
  constructor() {
    super();
  }

  public mount(root: HTMLElement): void {
    const gutterElement = document.createElement('div');
    gutterElement.style.width = toPixel(42);
    gutterElement.classList.add(EditorCSSName.GutterContainer)

    this._el = gutterElement;

    insertChildAtIndex(root, gutterElement, 0);
  }
}
