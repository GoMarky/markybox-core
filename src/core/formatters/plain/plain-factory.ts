import { BaseFormatterFactory, IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';

export class PlainFactory extends BaseFormatterFactory implements IAbstractFormatterFactory {
  constructor() {
    super();
  }
}
