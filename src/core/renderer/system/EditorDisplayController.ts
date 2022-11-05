import { BaseObject } from '@/core/BaseObject';
import { IPosition } from '@/core/types';
import { IDOMPosition } from '@/core/renderer/chars/helpers';
import { IRendererDisplay } from '@/core/renderer';
import { EditorGutterContainer } from '@/core/renderer/editor/EditorGutterContainer';
import { toPixel } from '@/core/base/dom';

export class EditorDisplayController extends BaseObject implements IRendererDisplay {
  private root: HTMLElement;
  public readonly gutter: EditorGutterContainer;

  constructor() {
    super();
    this.gutter = new EditorGutterContainer();
  }

  public toDOMPosition(position: IPosition): IDOMPosition {
    const { row, column } = position;

    return {
      top: row * 16,
      left: column * 7.2,
    }
  }

  public setFullScreen(): void {
    const { innerWidth, innerHeight } = window;
    const { root } = this;

    root.style.width = toPixel(innerWidth);
    root.style.height = toPixel(innerHeight);
  }

  public mount(root: HTMLElement): void {
    this.root = root;
    this.gutter.mount(root);
  }
}
