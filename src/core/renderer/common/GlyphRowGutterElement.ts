import { GlyphDOMNode } from '@/core/renderer/glyphs/GlyphDOMNode';
import { toPixel } from '@/base/dom';
import { HTMLRenderer } from '@/core';
import { toDisposable } from '@/app/platform/lifecycle/common/lifecycle';
import { EditorCSSName } from '@/core/renderer/common/helpers';
import { GlyphDOMElement } from '@/core/renderer/common/GlyphDOMElement';

export class GlyphRowGutterElement extends GlyphDOMElement<HTMLSpanElement> {
  private _expandable: boolean = false;
  private _widgetElement: HTMLSpanElement;

  constructor(private readonly renderer: HTMLRenderer, private _index: number) {
    super();

    const element = document.createElement('span');
    element.classList.add(EditorCSSName.CellGutter);
    element.style.height = toPixel(16);

    this._el = element;
    this.render();
  }

  public get index(): number {
    return this._index;
  }

  public set index(value) {
    this._index = value;
    this.render();
  }

  public get expandable(): boolean {
    return this._expandable;
  }

  public set expandable(value) {
    this._expandable = value;
    this.render();
  }

  private createExpandableWidget(): void {
    this._widgetElement?.remove();

    const widgetElement = document.createElement('span');
    widgetElement.classList.add(EditorCSSName.CellGutterWidget);
    widgetElement.style.height = toPixel(16);
    this._el.appendChild(widgetElement);
    this._widgetElement = widgetElement;

    this._el.addEventListener('click', this.onClick);

    this.disposables.add(toDisposable(() => this._el.removeEventListener('click', this.onClick)));
  }

  private onClick = (): void => {
    const { index, renderer } = this;
    const { controller } = renderer;

    controller.expandOrShrinkRow(index);
  }

  private render(): void {
    const { index, expandable } = this;

    this._el.textContent = (index + 1).toString();

    if (expandable) {
      this.createExpandableWidget();
    }
  }

  public dispose(): void {
    this._el.removeEventListener('click', this.onClick);
    this._el.remove();
  }
}
