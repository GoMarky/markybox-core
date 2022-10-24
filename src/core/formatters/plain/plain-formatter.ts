import { BaseFormatter, CodeStatement } from '@/core/formatters/formatter/base-formatter';
import { IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { PlainKeyApplicator } from '@/core/formatters/plain/plain-applicator';
import { IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';
import { PlainFactory } from '@/core/formatters/plain/plain-factory';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';

export class PlainFormatter extends BaseFormatter {
  public readonly applicator: IAbstractKeyApplicator;
  public readonly factory: IAbstractFormatterFactory;

  constructor(context: EditorGlobalContext) {
    super('plain', context);

    this.applicator = new PlainKeyApplicator(context);
    this.factory = new PlainFactory();
  }

  public parseKeyword(_: string): CodeStatement | undefined {
    return CodeStatement.Text;
  }
}
