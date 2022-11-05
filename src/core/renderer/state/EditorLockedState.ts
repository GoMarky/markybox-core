import { AbstractEditorState } from '@/core/renderer/state/AbstractEditorState';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';
import { EditorMouseEvent } from '@/core/renderer/mouse/mouse-event';
import { EditorKeyboardEvent } from '@/core/renderer/keyboard/keyboard-event';

export class EditorLockedState extends AbstractEditorState {
  constructor(context: EditorGlobalContext) {
    super(context);
  }

  public onQuadClick(_: EditorMouseEvent) {
    //
  }

  public onTripleClick(_: EditorMouseEvent) {
    //
  }

  public onContextMenu(_: EditorMouseEvent): void {
    //
  }

  public onDoubleClick(_: EditorMouseEvent): void {
    //
  }

  public onKeyUp(_: EditorKeyboardEvent): void {
    //
  }

  public onInput(_: string): void {
    //
  }

  public onClick(_: EditorMouseEvent): void {
    this.context.state.unlock();
  }

  public onKeyDown(_: EditorKeyboardEvent): void {
    //
  }

  public onSelectionEnd(_: EditorMouseEvent): void {
    //
  }

  public onSelectionMove(_: EditorMouseEvent): void {
    //
  }

  public onSelectionStart(_: EditorMouseEvent): void {
    //
  }
}
