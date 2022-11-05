import { EditorLang } from '@/core/types';
import { EditorBodyTextarea } from '@/core/renderer/editor/EditorBodyTextarea';
import { GlyphNodeFragment } from '@/core/renderer/chars/GlyphNodeFragment';
import { BaseFormatter } from '@/core/formatters/formatter/base-formatter';
import { PlainFormatter } from '@/core/formatters/plain/plain-formatter';
import { JavascriptCodeFormatter } from '@/core/formatters/javascript/javascript-formatter';
import { JSONCodeFormatter } from '@/core/formatters/json/json-formatter';
import { PythonCodeFormatter } from '@/core/formatters/python/python-formatter';
import { CPPCodeFormatter } from '@/core/formatters/cpp/cpp-formatter';
import { TextContainerLayer } from '@/core/renderer/layers/TextContainerLayer';
import { CurrentRowMarkerLayer } from '@/core/renderer/layers/CurrentRowMarkerLayer';
import { UserPartitionLayer } from '@/core/renderer/layers/UserPartitionLayer';
import { GolangCodeFormatter } from '@/core/formatters/golang/golang-formatter';
import { EditorStorage } from '@/core/renderer/system/EditorStorage';
import { EditorCSSName } from '@/core/renderer/chars/helpers';
import { GlyphDOMElement } from '@/core/renderer/chars/GlyphDOMElement';
import { EditorCustomContextMenu } from '@/core/renderer/editor/EditorContextMenu';
import { EditorDisplayController } from '@/core/renderer/system/EditorDisplayController';
import { isUndefinedOrNull } from '@/core/base/types';
import { EditorGlobalContext } from '@/core/renderer/system/EditorGlobalContext';
import { EditorBodyNavigator } from '@/core/renderer/editor/EditorBodyNavigator';
import { EditorRowsController } from '@/core/renderer/editor/EditorRowsController';
import { UserTextHintVisitor } from '@/core/renderer/visitors/UserTextHintVisitor';
import { KeywordCheckerVisitor } from '@/core/renderer/visitors/KeywordCheckerVisitor';

export interface IVisitor {
  visit(fragment: GlyphNodeFragment): void;
}

export class EditorBodyContainer extends GlyphDOMElement<HTMLDivElement> {
  public readonly textLayer: TextContainerLayer;
  public readonly markerLayer: CurrentRowMarkerLayer;
  public readonly contextMenu: EditorCustomContextMenu;
  private readonly partitionLayer: UserPartitionLayer;
  private readonly visitorMap: Map<string, IVisitor> = new Map();

  public rootElement: HTMLElement | null = null;
  private context: EditorGlobalContext;

  constructor(
    private readonly storage: EditorStorage,
    private readonly display: EditorDisplayController,
    private readonly navigator: EditorBodyNavigator,
    private readonly rowsController: EditorRowsController
  ) {
    super();

    this.textLayer = new TextContainerLayer();
    this.markerLayer = new CurrentRowMarkerLayer();
    this.partitionLayer = new UserPartitionLayer();
    this.contextMenu = new EditorCustomContextMenu();

    this.addVisitor('hint', new UserTextHintVisitor(navigator));
    this.addVisitor('keyword', new KeywordCheckerVisitor(this));
  }

  private _formatter: BaseFormatter;
  public get formatter(): BaseFormatter {
    return this._formatter;
  }

  public get visitors(): IVisitor[] {
    return Array.from(this.visitorMap.values());
  }

  public setContext(context: EditorGlobalContext): void {
    this.context = context;
  }

  public setFormat(type: EditorLang = 'plain'): void {
    const { context } = this;

    switch (type) {
      case 'cpp':
        this._formatter = new CPPCodeFormatter(context);
        break;
      case 'js':
        this._formatter = new JavascriptCodeFormatter(context);
        break;
      case 'json':
        this._formatter = new JSONCodeFormatter(context);
        break;
      case 'python':
        this._formatter = new PythonCodeFormatter(context);
        break;
      case 'plain':
        this._formatter = new PlainFormatter(context);
        break;
      case 'golang':
        this._formatter = new GolangCodeFormatter(context);
        break;
      default:
        this._formatter = new PlainFormatter(context);
        console.warn(`Get unrecognized lang syntax value - ${type}.`)
        break;
    }

    if (this.storage.count) {
      this.reRenderExistNodes();
    }
  }

  public reRenderExistNodes(): void {
    const { storage: { rows } } = this;
    const keywordChecker = this.visitorMap.get('keyword');

    if (isUndefinedOrNull(keywordChecker)) {
      throw new Error(`Keyword checker is undefined`);
    }

    for (const row of rows) {
      const { fragment } = row;

      if (isUndefinedOrNull(fragment)) {
        throw new Error(`EditorBodyContainer#Expect fragment to be defined.`);
      }

      fragment.clearSyntaxClasses();
      keywordChecker.visit(fragment);
    }
  }

  public addVisitor(id: string, visitor: IVisitor): void {
    this.visitorMap.set(id, visitor);
  }

  public mount(root: HTMLElement): void {
    this.createHTMLElement(root);
    this.rootElement = root;

    this.disposables.add(this.navigator.onDidUpdatePosition((position) => {
      const row = this.storage.at(position.row);

      const { top } = this.display.toDOMPosition(position);
      this.markerLayer.top(top);

      if (!row) {
        throw new Error(`Expected row at position: ${position.row}. Got undefined`);
      }

      this.rowsController.setCurrentRow(row);
    }));

    const body = this._el;

    this.textLayer.mount(body);
    this.markerLayer.mount(body);
    this.partitionLayer.mount(body);
    this.contextMenu.mount(body);

    const textarea = new EditorBodyTextarea(root);
    textarea.onDidUpdate((letter) => this.context.state.current.onInput(letter));
  }

  private createHTMLElement(root: HTMLElement): void {
    const bodyElement = document.createElement('div');
    bodyElement.style.width = '100%';
    bodyElement.classList.add(EditorCSSName.Body)
    this._el = bodyElement;
    root.appendChild(bodyElement);
  }
}
