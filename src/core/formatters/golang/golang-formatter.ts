import {  BaseFormatter, CodeStatement} from '@/core/formatters/formatter/base-formatter';
import { IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';
import { GolangFactory } from '@/core/formatters/golang/golang-factory';
import { GolangKeyApplicator } from '@/core/formatters/golang/golang-applicator';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';

const Regexp = {
  VariableStatement: /^(break|default|func|interface|select|case|defer|go|map|struct|chan|else|goto|package|switch|const|fallthrough|if|range|type|continue|for|import|return|var$)/,
};

export class GolangCodeFormatter extends BaseFormatter {
  public readonly applicator: IAbstractKeyApplicator;
  public readonly factory: IAbstractFormatterFactory;

  constructor(context: EditorGlobalContext) {
    super('python', context);

    this.applicator = new GolangKeyApplicator(context);
    this.factory = new GolangFactory();
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


