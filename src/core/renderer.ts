import { IDisposable } from '@/core/base/disposable';

export interface IRendererDisplay {
  setFullScreen(): void;
}

export interface IAbstractRenderer extends IDisposable {
  readonly display: IRendererDisplay;

  unlock(): void;

  lock(): void;

  setText(text: string): void;

  getText(): string;
}
