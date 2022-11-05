import { BaseObject } from '@/core/BaseObject';
import { CaretUserLayer } from '@/core/renderer/layers/CaretUserLayer';
import { Emitter, IEvent } from '@/core/base/event';
import { IPosition } from '@/core/types';
import { EditorStorage } from '@/core/renderer/system/EditorStorage';
import { EditorDisplayController } from '@/core/renderer/system/EditorDisplayController';

export class MHTMLEditorNavigator extends BaseObject {
  protected _currentPosition: IPosition = { row: 0, column: 0 };
  private readonly layer: CaretUserLayer;

  constructor(
    protected readonly display: EditorDisplayController,
    protected readonly storage: EditorStorage,
    public readonly name: string) {
    super();

    this.layer = new CaretUserLayer(name);
  }

  public get position(): IPosition {
    return this._currentPosition;
  }

  public setPosition(position: IPosition): void {
    return this.doSetPosition(position);
  }

  public mount(root: HTMLElement): void {
    this.layer.mount(root);
  }

  public prevColumn() {
    const { row, column } = this._currentPosition;

    let newColumn = column - 1;

    if (newColumn < 0) {
      newColumn = 0;
    }

    const newPosition: IPosition = { row, column: newColumn };
    this.doSetPosition(newPosition);
  }

  public nextColumn() {
    const { row, column } = this._currentPosition;

    const newPosition: IPosition = { row, column: column + 1 };
    this.doSetPosition(newPosition);
  }

  public previousRow() {
    const { row, column } = this._currentPosition;

    const newPosition: IPosition = { row: row - 1, column }
    this.doSetPosition(newPosition);
  }

  public nextRow() {
    const { row, column } = this._currentPosition;

    const newPosition: IPosition = { row: row + 1, column }
    this.doSetPosition(newPosition);
  }

  protected doSetPosition(position: IPosition): void {
    const { layer, storage } = this;
    let { row, column } = position;

    if (row < 0) {
      row = 0;
    }

    if (column < 0) {
      column = 0;
    }

    const matchedRow = storage.at(row);

    if (!matchedRow) {
      return console.warn(`Can't set position on unknown row index - ${row}`)
    }

    if (matchedRow.empty()) {
      column = 0;
    } else if (column >= matchedRow.length) {
      column = matchedRow.length;
    }

    const normalizedPosition: IPosition = { row, column };
    const displayPosition = this.display.toDOMPosition(normalizedPosition);

    layer.setPosition(displayPosition);
    this._currentPosition = normalizedPosition;
  }
}

export class EditorBodyNavigator extends MHTMLEditorNavigator {
  private readonly _onDidUpdatePosition: Emitter<IPosition> = new Emitter<IPosition>();
  public readonly onDidUpdatePosition: IEvent<IPosition> = this._onDidUpdatePosition.event;

  constructor(
    storage: EditorStorage,
    display: EditorDisplayController,
    name: string
  ) {
    super(display, storage, name);
  }

  protected doSetPosition(position: IPosition): void {
    super.doSetPosition(position);

    this._onDidUpdatePosition.fire(this._currentPosition);
  }
}
