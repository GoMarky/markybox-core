import { BaseObject } from '@/core/BaseObject';
import { GlyphRowElement } from '@/core/renderer/common/GlyphRowElement';
import { Emitter, IEvent } from '@/core/base/event';
import { indexOutOfRange } from '@/core/base/array';

export class EditorStorage extends BaseObject {
  private readonly _rows: GlyphRowElement[] = [];

  private readonly _onDidUpdate: Emitter<void> = new Emitter<void>();
  public readonly onDidUpdate: IEvent<void> = this._onDidUpdate.event;

  constructor() {
    super();
  }

  public clear(): void {
    for (const row of this._rows) {
      row.dispose();
    }

    this._rows.splice(0, this._rows.length);
    this._update();
  }

  public addRow(row: GlyphRowElement, tick = true): void {
    this._rows.push(row);

    if (tick) {
      this._update();
    }
  }

  public addRowAt(row: GlyphRowElement, index: number, tick = true): void {
    this._rows.splice(index, 0, row);

    if (tick) {
      this._update();
    }
  }

  public removeRow(row: GlyphRowElement): void {
    const index = this._rows.findIndex((r) => r === row);


    // Если удаляемая строчка первая и единственная - то не удаляем ее.
    if (this.count === 1 && index === 0) {
      return;
    }

    if (indexOutOfRange(index)) {
      throw new Error(`Cant find row: ${row}`);
    }

    row.dispose();
    this._rows.splice(index, 1);
    this._update();
  }

  public last(): GlyphRowElement {
    return this._rows[this.count - 1];
  }

  public has(index: number): boolean {
    return Boolean(this._rows[index]);
  }

  public at(index: number): GlyphRowElement | null {
    if (this.has(index)) {
      return this._rows[index];
    }

    return null;
  }

  public get rows(): GlyphRowElement[] {
    return this._rows;
  }

  public get count(): number {
    return this._rows.length;
  }

  private _update(): void {
    for (const [index, row] of this._rows.entries()) {
      row.setIndex(index);
    }

    this._onDidUpdate.fire();
  }
}
