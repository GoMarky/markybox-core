import { BaseObject } from '@/core/BaseObject';
import { HTMLRenderer } from '@/core';
import { GlyphRowElement } from '@/core/renderer/chars/GlyphRowElement';
import { splitAtIndex } from '@/core/types';
import { BASE_INDENT_VALUE } from '@/core/renderer/chars/helpers';
import { EditorAutoSaveController } from '@/core/renderer/lib/auto-save';
import { insertChildAtIndex } from '@/core/base/dom';
import { removeLastLetter } from '@/core/base/string';

export class EditorRowsController extends BaseObject {
  public readonly editorAutoSave: EditorAutoSaveController
  private _currentRow: GlyphRowElement;

  constructor(private readonly renderer: HTMLRenderer) {
    super();

    this.editorAutoSave = new EditorAutoSaveController(this.renderer.storage);
  }

  public get currentRow(): GlyphRowElement {
    return this._currentRow;
  }

  public get prevRow(): GlyphRowElement | null {
    const { index } = this.currentRow;
    const { storage } = this.renderer;

    return storage.at(index - 1);
  }

  public get nextRow(): GlyphRowElement | null {
    const { index } = this.currentRow;
    const { storage } = this.renderer;

    return storage.at(index + 1);
  }

  public splitCurrentRow(column: number): void {
    const { currentRow } = this;
    const { text } = currentRow;

    const [first, last] = splitAtIndex(column)(text);

    currentRow.setText(first);
    const nextRow = this.addRowAt(currentRow.index + 1);
    nextRow.setText(last);
  }

  public expandOrShrinkRow(_: number): void {
    const { storage } = this.renderer;

    throw new Error('Method not implemented');
  }

  public isCurrentColumnInsideGlyph(): boolean {
    const { navigator } = this.renderer;
    const { currentRow } = this;
    const { column } = navigator.position;

    return currentRow.contains(column);
  }

  public addRowAt(index: number): GlyphRowElement {
    const { storage, body } = this.renderer;
    const { renderer } = this;
    const { textLayer } = body;

    const factory = renderer.body.formatter.factory;
    const row = factory.createGlyphRow();

    row.setParent(renderer, index);
    storage.addRowAt(row, index);
    insertChildAtIndex(textLayer.el, row.el, index);

    return row;
  }

  public addRow(text: string): GlyphRowElement {
    const { storage, body } = this.renderer;
    const { renderer } = this;
    const { textLayer } = body;
    const factory = renderer.body.formatter.factory;

    const index = storage.count;
    const row = factory.createGlyphRow();

    row.setParent(renderer, index);
    row.setText(text);
    storage.addRow(row);

    textLayer.el.appendChild(row.el);

    return row;
  }

  public addEmptyRow(): GlyphRowElement {
    const { storage, body } = this.renderer;
    const { renderer } = this;
    const { textLayer } = body;
    const factory = renderer.body.formatter.factory;

    const index = storage.count;
    const row = factory.createGlyphRow();

    row.setParent(renderer, index);
    this._currentRow = row;
    storage.addRow(row);
    textLayer.el.appendChild(row.el);

    return row;
  }

  public removeLastRow(): void {
    const { storage } = this.renderer;

    const lastRow = storage.last();
    storage.removeRow(lastRow);
    this._currentRow = storage.last();
  }

  public removeRow(row: GlyphRowElement): void {
    const { storage } = this.renderer;

    storage.removeRow(row);
  }

  public setCurrentRow(row: GlyphRowElement): GlyphRowElement {
    this._currentRow = row;

    return row;
  }

  public removeLastLetterFromRow(row: GlyphRowElement): void {
    const { navigator } = this.renderer;

    const slicedText = removeLastLetter(row.text);

    row.setText(slicedText);
    navigator.setPosition({ row: row.index, column: row.length })
  }

  public pasteText(text: string): void {
    const textParts = text.split(/\n/);
  }

  public setWholeText(text: string): void {
    const textParts = text.split(/\n/);

    for (const [index, rowText] of textParts.entries()) {
      const row = this.addRow(rowText);

      const isLastIteration = index === textParts.length - 1;

      if (isLastIteration) {
        this._currentRow = row;
      }
    }
  }

  public removeIndentFromCurrentRow(): void {
    const { currentRow } = this;
    const { navigator } = this.renderer;
    const { column } = navigator.position;

    currentRow.slice(column - 4, column);
    navigator.setPosition({ row: currentRow.index, column: column - 4 })
  }

  public addIndentToCurrentRow(): void {
    const { currentRow } = this;
    const { navigator } = this.renderer;
    const { column } = navigator.position;

    currentRow.inputAt(BASE_INDENT_VALUE, column);
    navigator.setPosition({ row: currentRow.index, column: column + 4 })
  }

  public clear(): void {
    const { storage } = this.renderer;

    storage.clear();
    this.addEmptyRow();
  }
}
