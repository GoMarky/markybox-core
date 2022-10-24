import { AbstractKeyApplicator, IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { BASE_INDENT_VALUE } from '@/core/renderer/common/helpers';
import { ParenType } from '@/core/renderer/glyphs/GlyphParenNode';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';
import { copyStringNumberOfTimes } from '@/core/base/string';

export class JavascriptKeyApplicator extends AbstractKeyApplicator implements IAbstractKeyApplicator {
  constructor(context: EditorGlobalContext) {
    super(context);
  }

  private addRowAtPositionWithIndent(index: number): void {
    const { navigator, controller } = this.context;
    // Индекс строчки с пробелами
    const indentRowIndex = index + 1;
    // Индекс строчки с правой скобкой
    const rightParenRowIndex = indentRowIndex + 1;
    // Строчка с пробелами, добавляем ее в редактор
    const indentRow = controller.addRowAt(indentRowIndex);

    // Считаем количество отступов (учитываем соседние скобки до этого)
    const amountLeftParen = 1;
    // Выставляем нужно количество пробелов в зависимости от количества левых скобок
    const indentWhitespace = copyStringNumberOfTimes(BASE_INDENT_VALUE, amountLeftParen);
    indentRow.setText(indentWhitespace);

    const rightParenRow = controller.addRowAt(rightParenRowIndex);
    rightParenRow.setText('}');

    navigator.setPosition({ row: indentRowIndex, column: indentWhitespace.length });
  }

  public enter(): void {
    const { navigator, controller } = this.context;
    const { currentRow } = controller;
    const { position } = navigator;
    const isCurrentRowEmpty = currentRow.empty();

    const isChosenLastLetter = position.column >= currentRow.length;

    /**
     * Если текущая строка пустая - просто добавляем еще пустую строку
     */
    if (isCurrentRowEmpty) {
      return this.addEmptyRowAtPosition(currentRow.index);
    }

    /**
     * Если текущий символ - последний
     */
    if (isChosenLastLetter) {
      // Если текущий символ - это lparen -> { / [ / (
      if (currentRow.lastCharIs(ParenType.OpenBrace) || currentRow.lastCharIs(ParenType.OpenBracket)) {
        return this.addRowAtPositionWithIndent(currentRow.index);
      } else {
        // Если текущий символ последний иной - то добавляем пустую строку.
        return this.addEmptyRowAtPosition(currentRow.index);
      }
    }

    return this.splitCurrentRow();
  }
}
