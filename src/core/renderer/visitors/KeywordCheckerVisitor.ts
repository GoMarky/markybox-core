import { BaseObject } from '@/core/BaseObject';
import { IVisitor, EditorBodyContainer } from '@/core/renderer/editor/EditorBodyContainer';
import { GlyphWordNode } from '@/core/renderer/glyphs/GlyphWordNode';
import { GlyphNodeFragment } from '@/core/renderer/common/GlyphNodeFragment';
import { CodeStatement } from '@/core/formatters/formatter/base-formatter';
import { EditorCSSName } from '@/core/renderer/common/helpers';
import { GlyphParenNode } from '@/core/renderer/glyphs/GlyphParenNode';
import { GlyphSpecialCharNode } from '@/core/renderer/glyphs/GlyphSpecialCharNode';
import { GlyphDOMNode } from '@/core/renderer/glyphs/GlyphDOMNode';
import { isStringContainsOnlyNumbers } from '@/core/renderer/common/characters';

function getClassNameByStatement(statement?: CodeStatement): string | undefined {
  if (!statement) {
    return undefined;
  }

  switch (statement) {
    case CodeStatement.VariableDeclaration:
      return EditorCSSName.Identifier;
    case CodeStatement.GlobalVariable:
      return EditorCSSName.IdentifierName;
    case CodeStatement.Text:
    default:
      return undefined;
  }
}

function addClass(glyph: GlyphDOMNode, className: string): void {
  const element = glyph.el as HTMLElement;

  element.classList.add(className);
}

export class KeywordCheckerVisitor extends BaseObject implements IVisitor {
  constructor(
    private readonly body: EditorBodyContainer
  ) {
    super();
  }

  public visit(fragment: GlyphNodeFragment): void {
    const { children } = fragment;

    const glyphs = children.filter((glyph) =>
      glyph instanceof GlyphWordNode
      || glyph instanceof GlyphParenNode
      || glyph instanceof GlyphSpecialCharNode);

    let allNextNodesIsCommented = false;

    for (const [index, current] of glyphs.entries()) {
      if (allNextNodesIsCommented) {
        addClass(current, EditorCSSName.Comment);
        continue;
      }

      const isStatement = this.checkStatement(current);
      const previous = glyphs[index - 1];

      if (isStatement) {
        continue;
      }

      if (current instanceof GlyphWordNode && previous instanceof GlyphWordNode) {
        const isStatementName = this.checkStatementName(previous);

        if (isStatementName) {
          addClass(current, EditorCSSName.IdentifierName);
          continue;
        }
      }

      if (current instanceof GlyphWordNode && previous instanceof GlyphSpecialCharNode) {
        const isTypeStatement = this.isTypeStatement(current, previous);

        if (isTypeStatement) {
          addClass(current, EditorCSSName.Type);

          continue;
        }
      }

      if (current instanceof GlyphSpecialCharNode && previous instanceof GlyphSpecialCharNode) {
        const isCommentStarted = this.isComment(current, previous);

        if (isCommentStarted) {
          addClass(current, EditorCSSName.Comment);
          addClass(previous, EditorCSSName.Comment);
          allNextNodesIsCommented = true;
          continue;
        }
      }

      if (current instanceof GlyphWordNode) {
        const isNumber = this.isNumber(current);

        if (isNumber) {
          addClass(current, EditorCSSName.Number);
        }
      }
    }
  }

  private isComment(current: GlyphSpecialCharNode, previous: GlyphSpecialCharNode): boolean {
    return current.is('/') && previous.is('/');
  }

  private isTypeStatement(_: GlyphWordNode, previous: GlyphSpecialCharNode): boolean {
    return previous.is(':');
  }

  private isNumber(word: GlyphWordNode): boolean {
    const { text } = word;

    return isStringContainsOnlyNumbers(text);
  }

  private isString(_: GlyphDOMNode): boolean {
    return false;
  }

  private checkStatementName(previous?: GlyphDOMNode): boolean {
    if (!previous) {
      return false;
    }

    const { formatter } = this.body;

    const statement = formatter.parseKeyword(previous.text);

    return statement === CodeStatement.VariableDeclaration;
  }

  private checkStatement(glyph: GlyphDOMNode): boolean {
    const { formatter } = this.body;

    const statement = formatter.parseKeyword(glyph.text);
    const className = getClassNameByStatement(statement);

    if (className) {
      addClass(glyph, className);
      return true;
    }

    return false;
  }
}
