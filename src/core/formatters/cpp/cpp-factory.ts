import { BaseFormatterFactory, IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';

export class CppFactory extends BaseFormatterFactory implements IAbstractFormatterFactory {
  constructor() {
    super();
  }
}
