import { BaseLayer } from '@/core/renderer/layers/BaseLayer';
import { EditorCSSName } from '@/core/renderer/common/helpers';

export class CurrentRowMarkerLayer extends BaseLayer {
  constructor() {
    super();
  }

  private createActiveLine(): void {
    const lineElement = document.createElement('div');
    lineElement.classList.add(EditorCSSName.LayerActiveLine);

    this._el.appendChild(lineElement);
  }

  public mount(body: HTMLElement): void {
    const layerElement = document.createElement('div');
    layerElement.classList.add(EditorCSSName.Layer);
    layerElement.classList.add(EditorCSSName.LayerMarker)
    this._el = layerElement;
    body.appendChild(layerElement);

    this.createActiveLine();
  }
}
