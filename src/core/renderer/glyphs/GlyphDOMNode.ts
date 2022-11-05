import { GlyphDOMElement } from '@/core/renderer/chars/GlyphDOMElement';

export abstract class GlyphDOMNode<T extends Node = Node> extends GlyphDOMElement<T> {
  protected constructor(public readonly start: number = 0, public readonly end: number = 0) {
    super();
  }
}
