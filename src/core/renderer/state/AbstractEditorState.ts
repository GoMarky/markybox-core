import { BaseObject } from '@/core/BaseObject';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';
import { EditorMouseEvent } from '@/core/renderer/mouse/mouse-event';
import { EditorKeyboardEvent } from '@/core/renderer/keyboard/keyboard-event';

export abstract class AbstractEditorState extends BaseObject {
  protected constructor(protected readonly context: EditorGlobalContext) {
    super();
  }

  public abstract onContextMenu(event: EditorMouseEvent): void;

  public abstract onInput(letter: string): void;

  public abstract onClick(event: EditorMouseEvent): void;

  public abstract onDoubleClick(event: EditorMouseEvent): void;

  public abstract onTripleClick(event: EditorMouseEvent): void;

  public abstract onQuadClick(event: EditorMouseEvent): void;

  public abstract onKeyUp(event: EditorKeyboardEvent): void;

  public abstract onKeyDown(event: EditorKeyboardEvent): void;

  public abstract onSelectionStart(event: EditorMouseEvent): void;

  public abstract onSelectionEnd(event: EditorMouseEvent): void;

  public abstract onSelectionMove(event: EditorMouseEvent): void
}


