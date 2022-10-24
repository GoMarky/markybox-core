import { BaseLayer } from '@/core/renderer/layers/BaseLayer';
import { toPixel } from '@/core/base/dom';
import { EditorCSSName, IDOMPosition } from '@/core/renderer/common/helpers';

const colors: string[] = [
  'rgba(255,87,51,0.4)',
  'rgba(51,189,255,0.4)',
  'rgba(51,81,255,0.4)',
  'rgba(219,51,255,0.4)',
  'rgba(59,220,21,0.4)',
  'rgba(217,158,8,0.4)'
]

const getRandomColor = (): string => {
  return colors.shift() as string;
}

export class CaretUserLayer extends BaseLayer {
  constructor(private readonly label: string) {
    super();
  }

  public setPosition(position: IDOMPosition): void {
    const { left, top } = position;

    this._el.style.left = toPixel(left);
    this._el.style.top = toPixel(top);
  }

  public mount(body: HTMLElement): void {
    const bodyElement = document.createElement('div');
    bodyElement.classList.add(EditorCSSName.LayerCaretContainer)
    this._el = bodyElement;
    body.appendChild(bodyElement);

    this.createCaretElement();
    this.createUserLabelElement(body);
  }

  private createCaretElement(): void {
    const caretElement = document.createElement('div');
    caretElement.classList.add(EditorCSSName.Layer);
    caretElement.classList.add(EditorCSSName.LayerCaret)

    this._el.appendChild(caretElement);
  }

  private createUserLabelElement(body: HTMLElement): void {
    const { label } = this;

    const labelElement = document.createElement('div');
    labelElement.classList.add(EditorCSSName.LayerCaretLabel)
    labelElement.textContent = label;
    labelElement.style.background = getRandomColor();
    body.appendChild(labelElement);

    this._el.appendChild(labelElement);
  }
}
