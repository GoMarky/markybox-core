import { BaseFormatterFactory, IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';

export class JavascriptFactory extends BaseFormatterFactory implements IAbstractFormatterFactory {
  constructor() {
    super();
  }
}
