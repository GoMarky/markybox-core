import { BaseObject } from '@/core/BaseObject';
import { EditorLang } from '@/core';
import { IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';

export enum CodeStatement {
  Text = 'text',
  VariableDeclaration = 'VariableDeclaration',
  GlobalVariable = 'GlobalVariable',
}

export abstract class BaseFormatter extends BaseObject {
  public abstract readonly applicator: IAbstractKeyApplicator;
  public abstract readonly factory: IAbstractFormatterFactory;

  protected constructor(
    public readonly name: EditorLang,
    protected readonly context: EditorGlobalContext,
  ) {
    super();
  }

  public abstract parseKeyword(input: string): CodeStatement | undefined;

  public toString(): string {
    return this.name;
  }
}
