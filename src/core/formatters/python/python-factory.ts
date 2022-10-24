import { BaseFormatterFactory, IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';
import { GlyphNodeFragment } from '@/core/renderer/common/GlyphNodeFragment';
import { MHTMLPythonNodeFragment } from '@/core/formatters/python/python-node-fragment';
import { GlyphRowElement } from '@/core/renderer/common/GlyphRowElement';

export class PythonFactory extends BaseFormatterFactory implements IAbstractFormatterFactory {
  constructor() {
    super();
  }

  public createGlyphRow(): GlyphRowElement {
    return super.createGlyphRow();
  }

  public createNodeFragment(): GlyphNodeFragment {
    return new MHTMLPythonNodeFragment()
  }
}
