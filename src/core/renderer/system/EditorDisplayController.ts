import { BaseObject } from '@/core/BaseObject';
import { IPosition } from '@/core/common';
import { IDOMPosition } from '@/core/renderer/common/helpers';
import { IRendererDisplay } from '@/core/renderer';
import { EditorGutterContainer } from '@/core/renderer/editor/EditorGutterContainer';
import { EditorStorage } from '@/core/renderer/system/EditorStorage';
import { Barrier, debounce } from '@/core/base/async';
import { toPixel } from '@/core/base/dom';
import { toDisposable } from '@/core/base/disposable';

interface IEditorDisplayOptions {
  width?: number;
  height?: number;
  fullscreen?: boolean;
}

export class EditorDisplayController extends BaseObject implements IRendererDisplay {
  public readonly whenMounted: Barrier = new Barrier();

  private root: HTMLElement;
  public readonly gutter: EditorGutterContainer;

  constructor(
    private readonly storage: EditorStorage,
    private readonly options: IEditorDisplayOptions) {
    super();
    this.gutter = new EditorGutterContainer();
  }

  public get rootWidth(): number {
    return this.root.offsetWidth;
  }

  public get rootHeight(): number {
    return this.root.offsetHeight;
  }

  public toDOMPosition(position: IPosition): IDOMPosition {
    const { row, column } = position;

    return {
      top: row * 16,
      left: column * 7.2,
    }
  }

  public toEditorPosition(event: MouseEvent): IPosition {
    const target = event.target as HTMLElement;

    const rect = target.getBoundingClientRect();

    const left = event.clientX - rect.left; // x position within the element.
    const top = event.clientY - rect.top;  // y position within the element.

    return {
      row: Math.round(top / 16),
      column: Math.round(left / 7.2),
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

    const { width, height } = this.options;

    if (width && height) {
      this.root.style.height = toPixel(height);
      this.root.style.width = toPixel(width);
    }

    this.registerListeners();
  }

  private registerListeners(): void {
    const { storage, root } = this;
    const resizeBodyDelayMilliseconds = 250;

    const onResize = () => {
      const { innerWidth } = window;
      root.style.width = toPixel(innerWidth);
    };

    window.addEventListener('resize', onResize)

    const debounced = debounce(() => {
      const { count } = storage;

      const offsetHeight = root.offsetHeight;

      const totalRowsHeight = count * 16;
      const rootHeight = totalRowsHeight > offsetHeight ? totalRowsHeight : offsetHeight;

      root.style.height = toPixel(rootHeight);
    }, resizeBodyDelayMilliseconds);

    this.disposables.add(toDisposable(() => window.removeEventListener('resize', onResize)))
    this.disposables.add(storage.onDidUpdate(debounced));
  }
}
