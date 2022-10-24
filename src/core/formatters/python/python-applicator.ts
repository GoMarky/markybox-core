import { AbstractKeyApplicator, IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { BASE_INDENT_VALUE } from '@/core/renderer/common/helpers';
import { ParenType } from '@/core/renderer/glyphs/GlyphParenNode';
import { GlyphIndentNode } from '@/core/renderer/glyphs/GlyphIndentNode';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';
import { copyStringNumberOfTimes } from '@/core/base/string';

export class PythonKeyApplicator extends AbstractKeyApplicator implements IAbstractKeyApplicator {
  constructor(context: EditorGlobalContext) {
    super(context);
  }

  private addRowAtPositionWithIndent(index: number): void {
    const { navigator, controller } = this.context;
    const { currentRow } = controller;
    // Индекс строчки с пробелами
    const indentRowIndex = index + 1;
    // Индекс строчки с правой скобкой
    const rightParenRowIndex = indentRowIndex + 1;
    // Строчка с пробелами, добавляем ее в редактор
    const indentRow = controller.addRowAt(indentRowIndex);
    // Считаем количество отступов (учитываем соседние скобки до этого)
    const amountLeftParen = 1;
    let _amountLeftParen = amountLeftParen;

    const indentGlyphs: GlyphIndentNode[] = [];

    while (_amountLeftParen) {
      --_amountLeftParen;

      const glyph = new GlyphIndentNode(BASE_INDENT_VALUE, 0, 0);
      indentGlyphs.push(glyph);
    }

    const text = indentGlyphs.reduce((acc, glyph) => {
      acc += glyph.text
      return acc;
    }, '');

    indentRow.setText(text);

    // Выставляем нужно количество пробелов в зависимости от количества левых скобок
    const indentWhitespace = copyStringNumberOfTimes(BASE_INDENT_VALUE, amountLeftParen);

    controller.addRowAt(rightParenRowIndex);

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
      // Если текущий символ - это lparen -> :

      const isLastCharColon = currentRow.lastCharIs(ParenType.Colon);

      if (isLastCharColon) {
        return this.addRowAtPositionWithIndent(currentRow.index);
      } else {
        // Если текущий символ последний иной - то добавляем пустую строку.
        return this.addEmptyRowAtPosition(currentRow.index);
      }
    }

    return this.splitCurrentRow();
  }
}
