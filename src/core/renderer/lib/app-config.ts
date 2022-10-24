import { Disposable } from '@/core/base/disposable';

type ConfigKey = 'mode';

export class EditorConfig extends Disposable {
  private readonly map: Map<ConfigKey, any> = new Map();

  constructor() {
    super();
  }

  public setOption(): void {}

  public getOption(): void {
    return this.map.get('mode');
  }

  public setOptions(): void {}

  public getOptions(): void {}
}
