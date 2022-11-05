import { Disposable } from '@/core/base/disposable';
import { IPosition } from '@/core/types';
import { IDOMPosition } from '@/core/renderer/chars/helpers';

export class EditorMouseEvent extends Disposable {
  private _row: number;
  private _column: number;

  constructor(
    private readonly domEvent: MouseEvent,
  ) {
    super();

    this.setEditorPosition();
  }

  public get domPosition(): IDOMPosition {
    return {
      top: this._row * 16,
      left: this._column * 7.2,
    }
  }

  public get position(): IPosition {
    return {
      row: this._row,
      column: this._column,
    }
  }

  public get row() {
    return this._row;
  }

  public get column() {
    return this._column;
  }

  private setEditorPosition() {
    const { domEvent: event } = this;

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    const left = event.clientX - rect.left; // x position within the element.
    const top = event.clientY - rect.top;  // y position within the element.

    this._row = Math.round(top / 16);
    this._column = Math.round(left / 7.2);
  }

  public preventDefault() {
    return this.domEvent.preventDefault();
  }

  public get isLeftMouseKey() {
    return this.domEvent.button === 0;
  }
}
