import { BaseLayer } from '@/core/renderer/layers/BaseLayer';
import { toPixel } from '@/core/base/dom';
import { EditorCSSName } from '@/core/renderer/chars/helpers';
import { EditorDisplayController } from '@/core/renderer/system/EditorDisplayController';

export class UserPartitionLayer extends BaseLayer {
  constructor() {
    super();
  }

  public mount(body: HTMLElement): void {
    // создаем элемент
    this.createPartitionElement();
    body.appendChild(this._el);

    const left = body.offsetWidth / 1.5;

    this._el.style.left = toPixel(left);
  }

  private createPartitionElement(): void {
    const partitionElement = document.createElement('div');
    partitionElement.classList.add(EditorCSSName.Layer);
    partitionElement.classList.add(EditorCSSName.LayerPartition)

    this._el = partitionElement;
  }
}
