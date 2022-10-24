import {  BaseFormatter, CodeStatement} from '@/core/formatters/formatter/base-formatter';
import { IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { PythonKeyApplicator } from '@/core/formatters/python/python-applicator';
import { IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';
import { PythonFactory } from '@/core/formatters/python/python-factory';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';

const Regexp = {
  VariableStatement: /^(def|class|False|await|else|import|pass|None|break|except|in|rais|True|finally|is|return|and|continue|for|lambda|try|as|from|nonlocal|while|assert|del|global|not|with|async|elif|if|or|yield$)/,
};

export class PythonCodeFormatter extends BaseFormatter {
  public readonly applicator: IAbstractKeyApplicator;
  public readonly factory: IAbstractFormatterFactory;

  constructor(context: EditorGlobalContext) {
    super('python', context);

    this.applicator = new PythonKeyApplicator(context);
    this.factory = new PythonFactory();
  }

  public parseKeyword(input: string): CodeStatement | undefined {
    const isVariableStatement = Regexp.VariableStatement.test(input);

    switch (true) {
      case isVariableStatement:
        return CodeStatement.VariableDeclaration;
      default:
        return CodeStatement.Text;
    }
  }
}


