import { BaseLayer } from '@/core/renderer/layers/BaseLayer';
import { toPixel } from '@/core/base/dom';
import { EditorCSSName } from '@/core/renderer/chars/helpers';
import { EditorDisplayController } from '@/core/renderer/system/EditorDisplayController';

export class UserPartitionLayer extends BaseLayer {
  constructor(
    private readonly display: EditorDisplayController,
  ) {
    super();

    this.display.whenMounted.wait().then(() => {
      const rootWidth = this.display.rootWidth;

      this._el.style.left = toPixel(rootWidth / 1.5);
    });
  }

  public mount(body: HTMLElement): void {
    // создаем элемент
    this.createPartitionElement();
    body.appendChild(this._el);

    this._el.style.left = toPixel(676);
  }

  private createPartitionElement(): void {
    const partitionElement = document.createElement('div');
    partitionElement.classList.add(EditorCSSName.Layer);
    partitionElement.classList.add(EditorCSSName.LayerPartition)

    this._el = partitionElement;
  }
}
