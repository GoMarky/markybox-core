import { BaseFormatterFactory, IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';

export class GolangFactory extends BaseFormatterFactory implements IAbstractFormatterFactory {
  constructor() {
    super();
  }
}
