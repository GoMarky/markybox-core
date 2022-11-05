import { BaseObject } from '@/core/BaseObject';
import { GlyphRowElement } from '@/core/renderer/chars/GlyphRowElement';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';
import { Counter } from '@/core/base/counter';
import { throttle } from '@/core/base/async';

export interface IAbstractKeyApplicator {
  backspace(options: { isRepeat: boolean }): void;

  enter(): void;
}

export class AbstractKeyApplicator extends BaseObject implements IAbstractKeyApplicator {
  protected readonly backspaceKeyCounter: Counter = new Counter(0);

  constructor(
    protected readonly context: EditorGlobalContext
  ) {
    super();
  }

  private doBackspaceAction(): void {
    const { navigator, controller } = this.context;
    const { currentRow } = controller;

    /**
     * Если текущая строка пустая - удаляем ее.
     */
    if (currentRow.empty()) {
      return this.removeCurrentEmptyRow();
    }

    /**
     * Если текущая строка содержит только пробелы, то не удаляем ее - а просто очищаем от пробелов
     */
    if (currentRow.containsOnlyWhitespaces()) {
      navigator.setPosition({ row: currentRow.index, column: 0 })
      return currentRow.erase();
    }

    const { position: { column } } = navigator;

    /**
     * Если мы находимся в начале строки и
     * предыдущая строчка пустая -> то удаляем предыдущую строчку.
     */
    if (column === 0 && controller.prevRow?.empty()) {
      controller.removeRow(controller.prevRow);
      navigator.setPosition({ row: currentRow.index, column })
      return;
    }

    /**
     * Если мы находимся в начале строки и
     * предыдущая строчка НЕ пустая, то склеиваем текущую
     * с предыдущей.
     * Текущую удаляем
     */
    if (column === 0 && controller.prevRow && !controller.prevRow?.empty()) {
      const currentRowText = controller.currentRow.text;

      const prevRow = controller.prevRow;
      prevRow.append(currentRowText);
      controller.removeRow(controller.currentRow);
      navigator.setPosition({ row: prevRow.index, column: prevRow.length - currentRowText.length })
      return;
    }

    const { backspaceKeyCounter } = this;

    if (backspaceKeyCounter.value > 50) {
      return this.removeGlyphByPosition(column);
    }

    return this.removeLetterByPosition(column);
  }

  protected throttleSlice = throttle((row: GlyphRowElement, start: number, end: number) => {
    row.slice(start, end);
  }, 250)

  protected removeGlyphByPosition(column: number): void {
    const { controller } = this.context;
    const { currentRow } = controller;

    const { fragment } = currentRow;

    if (!fragment) {
      throw new Error('BaseApplicator#Expect fragment to be defined');
    }

    const glyph = fragment.at(column);

    if (!glyph) {
      throw new Error('Expect glyph to be defined');
    }

    const { start, end } = glyph;

    this.throttleSlice(currentRow, start, end);
  }

  protected removeLetterByPosition(column: number): void {
    const { navigator, controller } = this.context;
    const { currentRow } = controller;

    if (column === 0) {
      return;
    }

    navigator.prevColumn();
    currentRow.clearLetterByPosition(column);
  }

  protected removeCurrentEmptyRow(): void {
    const { navigator, controller } = this.context;
    const { currentRow } = controller;
    const { index } = currentRow;

    controller.removeRow(currentRow);
    const prevRow = controller.prevRow;

    let column = 0;

    if (prevRow) {
      column = prevRow.length;
    }

    navigator.setPosition({ row: index - 1, column })
  }

  protected addEmptyRowAtPosition(index: number): void {
    const { navigator, controller } = this.context;
    const newIndex = index + 1;
    controller.addRowAt(newIndex);
    navigator.nextRow();
  }

  protected splitCurrentRow(): void {
    const { navigator, controller } = this.context;
    const { currentRow } = controller;
    const { position: { column } } = navigator;

    controller.splitCurrentRow(column);
    return navigator.setPosition({ row: currentRow.index, column: 0 })
  }

  public backspace(options: { isRepeat: boolean }): void {
    const { isRepeat } = options;

    if (isRepeat) {
      this.backspaceKeyCounter.increment();
    } else {
      this.backspaceKeyCounter.reset();
    }

    this.doBackspaceAction();
  }

  public enter(): void {
  }
}
