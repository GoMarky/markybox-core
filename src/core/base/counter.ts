export class Counter {
  constructor(private _value: number = 0, private readonly step: number = 1) {
  }

  public increment(): void {
    this._value += this.step;
  }

  public decrement(): void {
    this._value -= this.step;
  }

  public get value(): number {
    return this._value;
  }

  public reset(): void {
    this._value = 0;
  }
}
