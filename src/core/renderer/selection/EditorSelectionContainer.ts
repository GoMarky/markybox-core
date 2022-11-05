import { BaseObject } from '@/core/BaseObject';
import { IPosition } from '@/core/types';
import { UserSelectionLayer } from '@/core/renderer/layers/UserSelectionLayer';
import { HTMLRenderer } from '@/core';
import { EditorDisplayController } from '@/core/renderer/system/EditorDisplayController';
import { EditorStorage } from '@/core/renderer/system/EditorStorage';
import { getFirstElement, getLastElement } from '@/core/base/array';
import { GlyphDOMNode } from '@/core/renderer/glyphs/GlyphDOMNode';
import { GlyphRowElement } from '@/core/renderer/chars/GlyphRowElement';
import { EditorSelectionDetailParser } from '@/core/renderer/selection/EditorSelectionDetailParser';
import { GlyphSpecialCharNode } from '@/core/renderer/glyphs/GlyphSpecialCharNode';
import { EditorMouseHandler } from '@/core/renderer/mouse/mouse-handler';
import { EditorMouseEvent } from '@/core/renderer/mouse/mouse-event';

export interface ISelectionPosition {
  row: number;
  startColumn: number;
  endColumn: number;
}

export class EditorSelectionContainer extends BaseObject {
  private readonly layer: UserSelectionLayer;
  private _positions: ISelectionPosition[] = [];

  public started = false;
  public startPosition: IPosition | null;
  public lastPosition: IPosition | null;

  public get positions(): ISelectionPosition[] {
    return this._positions;
  }

  constructor(
    private readonly renderer: HTMLRenderer,
    private readonly storage: EditorStorage,
    private readonly display: EditorDisplayController,
    private readonly mouse: EditorMouseHandler,
  ) {
    super();

    this.layer = new UserSelectionLayer(display);
  }

  private render(): void {
    this.layer.addSelectionRows(this._positions);
  }

  public getSelectedText(): string {
    const { rows } = this.storage;

    const filteredRows = rows.filter((row) => this._positions.find((position) => position.row === row.index));
    let selectedText: string = '';

    for (let i = 0; i < filteredRows.length; i++) {
      const row = filteredRows[i];
      const position = this._positions[i];

      const slicedText = row.text.slice(position.startColumn, position.endColumn);

      selectedText += `${slicedText}\n`;
    }

    return selectedText;
  }

  public selectRow(row: GlyphRowElement, glyph: GlyphDOMNode): void {
    const { fragment } = row;

    const first = fragment.first();
    const last = fragment.last();

    if (!first || !last) {
      throw new Error('Expect first or last glyph in fragment to be defined');
    }

    const detailedParser = new EditorSelectionDetailParser(fragment);
    const { groups } = detailedParser;

    let startColumn = first.start;
    let endColumn = last.end;

    for (const group of groups) {
      // Выделяем несколько нод сразу только в том случае, если их больше одной.
      if (group.includes(glyph) && group.length > 1) {
        const first = getFirstElement(group) as GlyphDOMNode;
        const last = getLastElement(group) as GlyphDOMNode;

        // Если начинаются с спец символов
        if (first instanceof GlyphSpecialCharNode && last instanceof GlyphSpecialCharNode) {
          startColumn = first.start;
          endColumn = last.end;

          break;
        }
      }
    }

    const position: ISelectionPosition = { row: row.index, startColumn, endColumn };

    this._positions = [position];
    this.render();
  }

  public selectGlyph(row: GlyphRowElement, glyph: GlyphDOMNode): void {
    const { start, end } = glyph;

    const position: ISelectionPosition = { row: row.index, startColumn: start, endColumn: end };

    this._positions = [position];
    this.render();
  }

  public selectAll(): void {
    const { rows } = this.storage;

    this._positions = rows.map((row) => ({ row: row.index, startColumn: 0, endColumn: row.length }))

    this.render();
  }

  public updateSelection = (position: { start: IPosition, end: IPosition }) => {
    const { storage } = this;
    const { start, end } = position;

    const isNotMoved = start.row === end.row && start.column === end.column;

    if (isNotMoved) {
      return;
    }

    const startRow = Math.abs(start.row < end.row ? start.row : end.row);
    let endRow = Math.abs(start.row > end.row ? start.row : end.row);

    if (endRow > storage.count) {
      endRow = storage.count;
    }

    const startColumn: number = Math.abs(start.column < end.column ? start.column : end.column);
    const endColumn: number = Math.abs(end.column > start.column ? end.column : start.column);

    const positions: ISelectionPosition[] = [];
    const isSingleRowSelection = startRow === endRow;

    // Если выделение идет в рамках одной и той же строки.
    if (isSingleRowSelection) {
      positions.push({ row: startRow, startColumn, endColumn });
    } else {
      // Если идет мультивыделение строк
      for (let i = startRow; i <= endRow - 1; i++) {
        positions.push({ row: i, startColumn, endColumn });
      }
    }

    const lastRowPosition = getLastElement(positions);

    if (lastRowPosition) {
      const { endColumn: lastRowEndColumnPosition, row } = lastRowPosition;
      const matchedRow = storage.at(row);

      if (!matchedRow) {
        throw new Error('updateSelection# - expect row to be defined');
      }

      const { length: rowLength } = matchedRow;
      // Количество выделенных колонок в последней строке, не должно превышать количество
      // символов в строке
      if (lastRowEndColumnPosition > rowLength) {
        lastRowPosition.endColumn = rowLength;
      }
    }

    this._positions = positions;
    this.render();
  }

  public clearSelect(): void {
    this.layer.clear();
  }

  public mount(body: HTMLElement): void {
    this.layer.mount(body);

    const onContextmenu = (event: EditorMouseEvent) => this.renderer.state.current.onContextMenu(event);
    const onMousedown = (event: EditorMouseEvent) => this.renderer.state.current.onSelectionStart(event);
    const onMousemove = (event: EditorMouseEvent) => this.renderer.state.current.onSelectionMove(event);
    const onMouseup = (event: EditorMouseEvent) => this.renderer.state.current.onSelectionEnd(event);
    const onDoubleClick = (event: EditorMouseEvent) => this.renderer.state.current.onDoubleClick(event);

    this.mouse.addEventListener('contextmenu', onContextmenu);
    this.mouse.addEventListener('mousedown', onMousedown);
    this.mouse.addEventListener('mousemove', onMousemove);
    this.mouse.addEventListener('mouseup', onMouseup);
    this.mouse.addEventListener('dblclick', onDoubleClick);
  }
}
