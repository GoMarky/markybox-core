import { GlyphNodeFragment } from '@/core/renderer/chars/GlyphNodeFragment';
import { GlyphDOMNode } from '@/core/renderer/glyphs/GlyphDOMNode';
import { GlyphTextNode } from '@/core/renderer/glyphs/GlyphTextNode';
import { GlyphIndentNode } from '@/core/renderer/glyphs/GlyphIndentNode';
import { Disposable } from '@/core/base/disposable';

export class EditorSelectionDetailParser extends Disposable {
  public readonly groups: GlyphDOMNode[][];

  constructor(
    fragment: GlyphNodeFragment
  ) {
    super();

    this.groups = this.parse(fragment);
  }

  private parse(fragment: GlyphNodeFragment): GlyphDOMNode[][] {
    const { children } = fragment;

    // [ [glyph, glyph], [glyph, glyph]];
    const result: GlyphDOMNode[][] = [];
    const tempSet: Set<GlyphDOMNode> = new Set();

    for (const glyph of children) {
      const isWhitespace = glyph instanceof GlyphTextNode || glyph instanceof GlyphIndentNode;

      if (!isWhitespace) {
        tempSet.add(glyph);
      } else {
        result.push(Array.from(tempSet.values()))
        tempSet.clear();
      }
    }

    // Если что-то осталось в конце
    if (tempSet.size > 0) {
      result.push(Array.from(tempSet.values()));
    }

    return result;
  }
}
