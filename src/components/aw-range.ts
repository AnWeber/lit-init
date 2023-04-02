import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { customElementIfNotExists } from "./custom-element";

@customElementIfNotExists("aw-range")
export class AwRange extends LitElement {
  constructor() {
    super();
  }

  private _value: number | undefined = undefined;
  @property()
  public get value() {
    if (this._value === undefined) {
      return this.max / 2;
    }
    return this._value;
  }

  public set value(val: number) {
    this._value = val;
  }

  @property()
  public step = 1;
  @property()
  public min = 0;
  @property()
  public max = 100;
  @property()
  public name: string | undefined;

  @property()
  public helplines: Array<string> | Record<string, number> = [];

  @property()
  public disabled: "" | boolean | undefined;

  private get isDisabled() {
    return this.disabled === "" || !!this.disabled;
  }

  render() {
    this.refreshTrackPosition();

    return html` <hr class="track" />
      <hr
        class="track track-selected ${this.isDisabled
          ? "track-selected--range-disabled"
          : ""}"
      />
      <input
        class="range"
        name="${ifDefined(this.name)}"
        type="range"
        step="${this.step}"
        min="${this.min}"
        max="${this.max}"
        ?disabled="${this.isDisabled}"
        value="${this.value}"
        @input=${this.handleInput}
      />${this.renderHelplines()}`;
  }

  private renderHelplines() {
    let template = html``;
    if (this.helplines) {
      let helpLines: Record<string, number>;
      if (Array.isArray(this.helplines)) {
        helpLines = this.helplines.reduce((result, curr, index) => {
          result[curr] = (index / (this.helplines.length - 1)) * this.max;
          return result;
        }, {} as Record<string, number>);
      } else {
        helpLines = this.helplines;
      }

      const setValue = (val: number) => {
        if (!this.isDisabled) {
          const input = this.shadowRoot?.querySelector("input");
          if (input) {
            this.value = val;
            input.value = `${val}`;
            this.dispatchEvent(
              new Event("input", {
                bubbles: true,
              })
            );
            this.refreshTrackPosition();
          }
        }
      };
      template = html` ${repeat(
        Object.entries(helpLines),
        ([title, value]) => html`<div
          class="helpline ${this.isDisabled ? "helpline--disabled" : ""}"
          title="${title}"
          @click="${() => {
            setValue(value);
          }}"
          style="--helpline-position: ${(value / this.max)};"
        ></div> `
      )}`;
    }
    return template;
  }

  private handleInput(evt: InputEvent & { target: HTMLInputElement }) {
    this.value = evt.target?.valueAsNumber;
    this.refreshTrackPosition();
  }

  private refreshTrackPosition() {
    this.style.setProperty(
      "--range-track-selected-position",
      `${(100 * this.value) / this.max}%`
    );
  }

  public static override styles = css`
    :host {
      position: relative;
      display: inline-block;
      --range-track-size: 0.1rem;
      --range-track-color: #b0bec5;
      --range-track-selected-size: 0.2rem;
      --range-track-selected-color: #546e7a;
      --range-thumb-color: #1976d2;
      --range-thumb-border-color: #fff;
      --range-thumb-border-size: 2px;
      --range-thumb-color-focus: #0d47a1;
      --range-thumb-color-disabled: #b0bec5;
      --range-thumb-size: 1rem;
      --range-helpline-width: 0.05rem;
      --range-helpline-color: #b0bec5;
    }
    .range {
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      cursor: pointer;
      width: 100%;
      position: relative;
      display: block;
      margin: 0;
    }

    .range:disabled {
      cursor: initial;
    }

    .range:focus {
      outline: none;
    }

    .range::-moz-range-track {
      background-color: transparent;
      width: 100%;
    }
    .range::-webkit-slider-runnable-track {
      background-color: transparent;
      width: 100%;
    }

    .range::-moz-range-thumb {
      -webkit-appearance: none; /* Override default look */
      appearance: none;

      background-color: var(--range-thumb-color);
      transition: background-color 0.5s;
      border-radius: 50%;
      border-width: var(--range-thumb-border-size);
      border-color: var(--range-thumb-border-color);
      border-style: solid;
      height: var(--range-thumb-size);
      width: var(--range-thumb-size);
      position: relative;
      z-index: 1;
    }
    .range::-webkit-slider-thumb {
      -webkit-appearance: none; /* Override default look */
      appearance: none;

      background: var(--range-thumb-color);
      transition: background-color 0.5s;
      border-radius: 50%;
      border-width: var(--range-thumb-border-size);
      border-color: var(--range-thumb-border-color);
      border-style: solid;
      height: var(--range-thumb-size);
      width: var(--range-thumb-size);
      position: relative;
      z-index: 1;
    }

    .range:focus::-webkit-slider-thumb {
      background: var(--range-thumb-color-focus);
    }
    .range:focus::-moz-range-thumb {
      background: var(--range-thumb-color-focus);
    }
    .range:disabled::-webkit-slider-thumb {
      background: var(--range-thumb-color-disabled);
    }
    .range:disabled::-moz-range-thumb {
      background: var(--range-thumb-color-disabled);
    }
    .track {
      position: absolute;
      z-index: 1;
      width: calc(100% - var(--range-thumb-size));
      left: calc(var(--range-thumb-size) / 2);
      background: var(--range-track-color);
      height: var(--range-track-size);
      border: 0px;
      margin: 0;
      top: calc(50% - var(--range-track-size) / 2);
      pointer-events: none;
    }
    .track-selected {
      height: var(--range-track-selected-size, --range-track-size);
      transform-origin: center left;
      transform: scaleX(var(--range-track-selected-position));
      background: var(--range-track-selected-color);
      top: calc(50% - var(--range-track-selected-size, --range-track-size) / 2);
    }
    .track-selected--range-disabled {
      display: none;
    }
    .helplines {
      position: absolute;
      width: calc(100% - var(--range-thumb-size));
      padding: 0 calc(var(--range-thumb-size) / 2);
      height: var(--range-thumb-size);
      top: 0px;
      box-sizing: border-box;
      left: calc(var(--range-thumb-size) / 2);
    }
    .helpline {
      top: 0;
      height: 100%;
      position: absolute;
      width: var(--range-helpline-width);
      background: var(--range-helpline-color);
      left: calc((var(--range-thumb-size) / 2) + var(--helpline-position) * (100% - var(--range-thumb-size)));
      cursor: pointer;
    }
    .helpline--disabled {
      cursor: initial;
    }
  `;
}
