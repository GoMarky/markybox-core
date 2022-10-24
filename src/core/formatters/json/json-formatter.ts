import { BaseFormatter, CodeStatement} from '@/core/formatters/formatter/base-formatter';
import { IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { JSONKeyApplicator } from '@/core/formatters/json/json-applicator';
import { IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';
import { JSONFactory } from '@/core/formatters/json/json-factory';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';

export class JSONCodeFormatter extends BaseFormatter {
  public readonly applicator: IAbstractKeyApplicator;
  public readonly factory: IAbstractFormatterFactory;

  constructor(context: EditorGlobalContext) {
    super('json', context);

    this.applicator = new JSONKeyApplicator(context);
    this.factory = new JSONFactory();
  }

  public parseKeyword(_: string): CodeStatement | undefined {
    return CodeStatement.Text;
  }
}
