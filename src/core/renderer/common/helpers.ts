export const EditorCSSName = {
  RootClassName: 'marky',
  LightTheme: 'marky_light-theme',
  DarkTheme: 'marky_dark-theme',

  Identifier: 'marky__identifier',
  IdentifierName: 'marky__identifier-name',
  IdentifierString: 'marky__identifier-string',
  ClassName: 'marky__class-name',
  Comment: 'marky__comment',
  Number: 'marky__number',
  Type: 'marky__type',

  CellGutter: 'marky__gutter-cell',
  CellGutterWidget: 'marky__gutter-cell-widget',

  NodeIndent: 'marky__indent-node',
  NodeSpecialChar: 'marky__special-char',
  NodeWord: 'marky__word-node',
  NodeParen: 'marky__paren-node',

  GutterContainer: 'marky__gutter',
  Row: 'marky__row',
  Body: 'marky__body',
  Textarea: 'marky__textarea',

  LayerCaretLabel: 'marky__layer-caret-label',
  LayerCaret: 'marky__layer-caret',
  LayerText: 'marky__layer-text',
  LayerPartition: 'marky__layer-partition',
  Layer: 'marky__layer',
  LayerMarker: 'marky__layer-marker',
  LayerCaretContainer: 'marky__layer-caret-container',
  LayerActiveLine: 'marky__layer-marker-active-line',
  LayerSelection: 'marky__layer-selection',
  SelectionRow: 'marky__selection-row',

  LayerContextMenubar: 'marky__context-menubar',
  LayerContextMenubarList: 'marky__context-menubar-list',
  ContextMenubarItemContent: 'marky__context-menubar-item-content',
  ContextMenubarItemTitle: 'marky__context-menubar-item-title',
  ContextMenuBarItemText: 'marky__context-menubar-item-title-text',
}

export interface IDOMPosition {
  left: number;
  top: number;
}

const indentLength = 4;

export const BASE_INDENT_VALUE = Array.from({ length: indentLength }, () => ' ').join('');
