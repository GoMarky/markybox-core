import { BaseLayer } from '@/core/renderer/layers/BaseLayer';
import { EditorCSSName } from '@/core/renderer/common/helpers';

export class ContextMenuLayer extends BaseLayer {
  constructor() {
    super();
  }

  public mount(body: HTMLElement): void {
    const bodyElement = document.createElement('div');
    bodyElement.classList.add(EditorCSSName.LayerContextMenubar)
    this._el = bodyElement;
    body.appendChild(bodyElement);
  }
}
