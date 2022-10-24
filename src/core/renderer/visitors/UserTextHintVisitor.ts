import { BaseObject } from '@/core/BaseObject';
import { IVisitor } from '@/core/renderer/editor/EditorBodyContainer';
import { GlyphNodeFragment } from '@/core/renderer/common/GlyphNodeFragment';
import { EditorBodyNavigator } from '@/core/renderer/editor/EditorBodyNavigator';

const arr = [
  'constructor',
  'extends',
  'class',
  'const',
  'implements',
  'interface',
];

export class UserTextHintVisitor extends BaseObject implements IVisitor {
  constructor(private readonly navigator: EditorBodyNavigator) {
    super();
  }

  private generateHints(text: string): string[] {
    return arr.filter(keyword => keyword.startsWith(text));
  }

  public visit(fragment: GlyphNodeFragment): void {
    const { navigator } = this;

    const position = navigator.position;
    const textGlyph = fragment.at(position.column);

    if (textGlyph && textGlyph.length > 1) {
      this.generateHints(textGlyph.text);
    }
  }
}
