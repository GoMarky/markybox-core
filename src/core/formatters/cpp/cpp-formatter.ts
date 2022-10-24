import { BaseFormatter, CodeStatement } from '@/core/formatters/formatter/base-formatter';
import { CPPKeyApplicator } from '@/core/formatters/cpp/cpp-applicator';
import { IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';
import { CppFactory } from '@/core/formatters/cpp/cpp-factory';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';

export class CPPCodeFormatter extends BaseFormatter {
  public readonly applicator: IAbstractKeyApplicator;
  public readonly factory: IAbstractFormatterFactory;

  constructor(context: EditorGlobalContext) {
    super('json', context);

    this.applicator = new CPPKeyApplicator(context);
    this.factory = new CppFactory();
  }

  public parseKeyword(_: string): CodeStatement | undefined {
    return CodeStatement.Text;
  }
}
