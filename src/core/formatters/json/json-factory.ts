import { BaseFormatterFactory, IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';

export class JSONFactory extends BaseFormatterFactory implements IAbstractFormatterFactory {
  constructor() {
    super();
  }
}
