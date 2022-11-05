import { Disposable } from '@/core/base/disposable';

type ConfigKey = 'readonly-mode' | 'user-name';

type ConfigOption = {
  key: ConfigKey;
  value: any;
}

export class AppConfig extends Disposable {
  private readonly map: Map<ConfigKey, any> = new Map();

  constructor() {
    super();
  }

  public setOption(key: ConfigKey, value: any): void {
    this.map.set(key, value);
  }

  public getOption<T>(key: ConfigKey): T {
    return this.map.get(key);
  }

  public setOptions(options: ConfigOption[]): void {
    for (const option of options) {
      this.setOption(option.key, option.value);
    }
  }
}
