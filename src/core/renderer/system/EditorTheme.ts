import { BaseObject } from '@/core/BaseObject';
import { EditorBodyContainer } from '../editor/EditorBodyContainer';
import { EditorCSSName } from '../common/helpers';
import { EditorTheme } from '@/core/common';

const editorThemeToCSSClass = (theme: EditorTheme): string => {
  switch (theme) {
    case 'dark':
      return EditorCSSName.DarkTheme;
    case 'light':
    default:
      return EditorCSSName.LightTheme
  }
};

export class EditorThemeService extends BaseObject {
  private _theme: EditorTheme = 'light';

  constructor(
    private readonly body: EditorBodyContainer,
  ) {
    super();
  }

  public get theme(): EditorTheme {
    return this._theme;
  }

  public setTheme(theme: EditorTheme): void {
    const root = this.body.rootElement;

    if (!root) {
      this._theme = theme;
      return;
    }

    root.classList.remove(editorThemeToCSSClass(this._theme))
    root.classList.add(editorThemeToCSSClass(theme));

    this._theme = theme;
  }

  public init(): void {
    this.setTheme(this._theme);
  }
}
