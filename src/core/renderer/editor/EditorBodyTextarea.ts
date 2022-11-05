import { isSystemChar } from '@/core/types';
import { EditorCSSName } from '@/core/renderer/chars/helpers';
import { GlyphDOMElement } from '@/core/renderer/chars/GlyphDOMElement';
import { Emitter, IEvent } from '@/core/base/event';
import { toPixel } from '@/core/base/dom';
import { Char } from '@/core/base/char';
import { toDisposable } from '@/core/base/disposable';

export type MChar = string;

export class EditorBodyTextarea extends GlyphDOMElement<HTMLTextAreaElement> {
  private readonly _onDidUpdate: Emitter<string> = new Emitter<string>();
  public readonly onDidUpdate: IEvent<string> = this._onDidUpdate.event;

  constructor(private readonly root: HTMLElement) {
    super();

    this.init();
  }

  private createTextareaElement(): void {
    const { root } = this;

    const element = document.createElement('textarea');

    element.setAttribute('wrap', 'off');
    element.setAttribute('autocapitalize', 'off');
    element.setAttribute('autocorrect', 'off');
    element.setAttribute('spellcheck', 'false');
    element.classList.add(EditorCSSName.Textarea)

    root.appendChild(element);
    this._el = element;
  }

  private init(): void {
    this.createTextareaElement();

    const { _el } = this;
    _el.style.left = toPixel(42);

    const onKeydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      const { key } = event;
      const isSystemKey = isSystemChar(key as Char);

      if (isSystemKey) {
        return event.preventDefault();
      }

      if (key === ' ') {
        event.preventDefault();
      }

      this._onDidUpdate.fire(key);
    }

    window.addEventListener('keydown', onKeydown);

    this.disposables.add(toDisposable(() => {
      window.removeEventListener('keydown', onKeydown);
    }))
  }
}
