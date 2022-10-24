import { BaseObject } from '@/core/BaseObject';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';

export abstract class AbstractEditorState extends BaseObject {
  protected constructor(protected readonly context: EditorGlobalContext) {
    super();
  }

  public abstract onContextMenu(event: MouseEvent): void;

  public abstract onInput(letter: string): void;

  public abstract onClick(event: MouseEvent): void;

  public abstract onDoubleClick(event: MouseEvent): void;

  public abstract onTripleClick(event: MouseEvent): void;

  public abstract onQuadClick(event: MouseEvent): void;

  public abstract onKeyUp(event: KeyboardEvent): void;

  public abstract onKeyDown(event: KeyboardEvent): void;

  public abstract onSelectionStart(event: MouseEvent): void;

  public abstract onSelectionEnd(_: MouseEvent): void;

  public abstract onSelectionMove(event: MouseEvent): void
}


