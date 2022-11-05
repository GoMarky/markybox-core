import { BaseObject } from '@/core/BaseObject';
import { GlyphRowElement } from '@/core/renderer/chars/GlyphRowElement';
import { GlyphNodeFragment } from '@/core/renderer/chars/GlyphNodeFragment';

export interface IAbstractFormatterFactory {
  createGlyphRow(): GlyphRowElement;

  createNodeFragment(): GlyphNodeFragment;
}

export class BaseFormatterFactory extends BaseObject implements IAbstractFormatterFactory {
  constructor() {
    super();
  }

  public createGlyphRow(): GlyphRowElement {
    return new GlyphRowElement()
  }

  public createNodeFragment(): GlyphNodeFragment {
    return new GlyphNodeFragment();
  }
}
