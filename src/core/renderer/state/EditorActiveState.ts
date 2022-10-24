import { AbstractEditorState } from '@/core/renderer/state/AbstractEditorState';
import { MChar } from '@/core/renderer/editor/EditorBodyTextarea';
import { IPosition } from '@/core/common';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';
import { EditorContextKeys } from '@/core/renderer/system/EditorContext';
import { Char } from '@/core/base/char';

export class EditorActiveState extends AbstractEditorState {
  constructor(context: EditorGlobalContext) {
    super(context);
  }

  public onContextMenu(event: MouseEvent): void {
    const { display } = this.context;
    event.preventDefault();

    console.log(event);

    const position = display.toEditorPosition(event);

    return this.openContextMenu(position);
  }

  public onSelectionStart(event: MouseEvent): void {
    const { selection, display } = this.context;
    const isLeftClick = event.button === 0;

    if (!isLeftClick) {
      return;
    }

    if (selection.startPosition) {
      selection.lastPosition = null;
      selection.clearSelect();
    }

    selection.started = true;
    selection.startPosition = display.toEditorPosition(event);
  }

  public onSelectionMove(event: MouseEvent): void {
    const { selection, display } = this.context;

    if (!selection.started) {
      return;
    }

    selection.lastPosition = display.toEditorPosition(event);

    const start = selection.startPosition as IPosition;
    const end = selection.lastPosition;

    const differenceX = Math.abs(start.column - end.column);

    // Убираем фейковые сдвиги
    if (differenceX <= 0) {
      return;
    }

    selection.updateSelection({ start, end });
  }

  public onSelectionEnd(_: MouseEvent): void {
    const { selection } = this.context;

    selection.started = false;
  }

  public onInput(char: MChar): void {
    void this.context.command.executeCommand('editor.char.add', char);
  }

  public onKeyUp(_: KeyboardEvent) {
    //
  }

  public onDoubleClick(event: MouseEvent): void {
    const { storage, display, selection } = this.context;
    const position = display.toEditorPosition(event);

    const { row, column } = position;
    const matchedRow = storage.at(row);

    if (!matchedRow) {
      throw new Error('onDoubleClick - expect row to be defined');
    }

    const glyph = matchedRow.fragment.at(column);

    if (!glyph) {
      throw new Error('onDoubleClick - expect glyph to be defined');
    }

    // Включаем режим двойного клика
    EditorContextKeys.doubleClickMode.set(true);
    selection.selectGlyph(matchedRow, glyph);

    // Выключаем режим двойного клика
    window.setTimeout(() => {
      EditorContextKeys.doubleClickMode.set(false);
    }, 1000);
  }

  public onTripleClick(event: MouseEvent): void {
     console.log(event);
  }

  public onQuadClick(event: MouseEvent): void {
    console.log(event);
  }

  public onClick(event: MouseEvent): void {
    const { display, storage, selection, body } = this.context;

    const isLeftMouseKey = event.button === 0;

    if (!isLeftMouseKey) {
      return;
    }

    if (body.contextMenu.isOpen) {
      body.contextMenu.removeMenu();
    }

    const position = display.toEditorPosition(event);
    const matchedRow = storage.at(position.row);

    let row: number;
    let column: number;

    // Если попали в существующую строку, переводим курсор в нее
    if (matchedRow) {
      row = position.row;
      column = position.column > matchedRow.length ? matchedRow.length : position.column;
    } else {
      // Если попали "вникуда", переводим курсор на последнюю строку, последней колонки.
      const lastRow = storage.last();
      row = lastRow.index;
      column = lastRow.length;
    }

    const isDoubleClickPressed = EditorContextKeys.doubleClickMode.get();
    const normalizedPosition: IPosition = { row, column };

    // Если до этого сделалил двойной клик по слову, переходим в режим выделения всей строки
    if (isDoubleClickPressed && matchedRow) {
      const glyph = matchedRow.fragment.at(column);

      if (!glyph) {
        throw new Error('onDoubleClick - expect glyph to be defined');
      }

      selection.selectRow(matchedRow, glyph);
      // process double click
      return;
    }

    void this.context.command.executeCommand('editor.position.update', normalizedPosition);
  }

  public onKeyDown(event: KeyboardEvent): void {
    const { storage, navigator, controller } = this.context;
    const code = event.code as Char;
    const isRepeat = event.repeat;
    const { position: { row } } = navigator;

    switch (code) {
      case Char.ArrowLeft:
        return navigator.prevColumn();
      case Char.ArrowRight:
        return navigator.nextColumn();
      case Char.ArrowUp: {
        return navigator.setPosition({ row: row - 1, column: 0 })
      }
      case Char.ArrowDown: {
        const isCurrentPositionHasLastRow = (row + 1) === storage.count;

        if (isCurrentPositionHasLastRow) {
          const { index } = controller.addEmptyRow();
          return navigator.setPosition({ row: index, column: 0 })
        } else {
          navigator.nextRow();
        }

        break;
      }
      case Char.Backspace: {
        return this.backspace({ isRepeat });
      }
      case Char.Enter: {
        return this.enter();
      }
    }

    return controller.editorAutoSave.save();
  }

  private openContextMenu(position: IPosition): void {
    const { body } = this.context;

    body.contextMenu.createMenu(position, [
      {
        title: 'Copy',
        action: () => console.log('copy'),
      },
      {
        title: 'Paste',
        action: () => console.log('paste'),
      },
    ]);
  }

  private enter(): void {
    const { applicator } = this.context.body.formatter;

    return applicator.enter();
  }

  private backspace(options: { isRepeat: boolean }): void {
    const { applicator } = this.context.body.formatter;
    return applicator.backspace(options);
  }
}
