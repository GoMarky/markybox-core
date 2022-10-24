import { AbstractKeyApplicator, IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';

export class PlainKeyApplicator extends AbstractKeyApplicator implements IAbstractKeyApplicator {
  constructor(context: EditorGlobalContext) {
    super(context);
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
      return this.addEmptyRowAtPosition(currentRow.index);
    }

    return this.splitCurrentRow();
  }
}
