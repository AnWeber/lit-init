import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

@customElement("aw-range")
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
          ? "track-selected--disabled"
          : ""}"
      />
      <input
        class="range"
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
      template = html` <div class="helplines">
        ${repeat(
          Object.entries(helpLines),
          ([title, value]) => html`<div
            class="helpline ${this.isDisabled
          ? "helpline--disabled"
          : ""}"
            title="${title}"
            @click="${() => {
              setValue(value);
            }}"
            style="left: calc(${(value / this.max) * 100}%"
          ></div> `
        )}
      </div>`;
    }
    return template;
  }

  private handleInput(evt: InputEvent & { target: HTMLInputElement }) {
    this.value = evt.target?.valueAsNumber;
    this.refreshTrackPosition();
  }

  private refreshTrackPosition() {
    this.style.setProperty(
      "--track-selected-position",
      `${(100 * this.value) / this.max}%`
    );
  }

  public static override styles = css`
    :host {
      position: relative;
      display: inline-block;
      --track-size: 0.1rem;
      --track-color: #b0bec5;
      --track-selected-size: 0.2rem;
      --track-selected-color: #546e7a;
      --thumb-color: #1976d2;
      --thumb-border-color: #fff;
      --thumb--border-size: 2px;
      --thumb-color-focus: #0d47a1;
      --thumb-color-disabled: #b0bec5;
      --thumb-size: 1rem;
      --helpline-width: 0.05rem;
      --helpline-color: #b0bec5;
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

    .range:disabled{
      cursor: initial;
    }

    .range:focus {
      outline: none;
    }

    .range::-moz-range-track {
      background-color: transparent;
    }
    .range::-webkit-slider-runnable-track {
      background-color: transparent;
    }

    .range::-moz-range-thumb {
      -webkit-appearance: none; /* Override default look */
      appearance: none;

      background-color: var(--thumb-color);
      transition: background-color 0.5s;
      border-radius: 50%;
      border-width: var(--thumb--border-size);
      border-color: var(--thumb-border-color);
      border-style: solid;
      height: var(--thumb-size);
      width: var(--thumb-size);
      position: relative;
      z-index: 1;
    }
    .range::-webkit-slider-thumb {
      -webkit-appearance: none; /* Override default look */
      appearance: none;

      background: var(--thumb-color);
      transition: background-color 0.5s;
      border-radius: 50%;
      border-width: var(--thumb--border-size);
      border-color: var(--thumb-border-color);
      border-style: solid;
      height: var(--thumb-size);
      width: var(--thumb-size);
      position: relative;
      z-index: 1;
    }

    .range:focus::-webkit-slider-thumb {
      background: var(--thumb-color-focus);
    }
    .range:focus::-moz-range-thumb {
      background: var(--thumb-color-focus);
    }
    .range:disabled::-webkit-slider-thumb {
      background: var(--thumb-color-disabled);
    }
    .range:disabled::-moz-range-thumb {
      background: var(--thumb-color-disabled);
    }
    .track {
      position: absolute;
      z-index: 1;
      width: calc(100% - var(--thumb-size));
      left: calc(var(--thumb-size) / 2);
      background: var(--track-color);
      height: var(--track-size);
      border: 0px;
      margin: 0;
      top: calc(50% - var(--track-size) / 2);
      pointer-events: none;
    }
    .track-selected {
      height: var(--track-selected-size, --track-size);
      transform-origin: center left;
      transform: scaleX(var(--track-selected-position));
      background: var(--track-selected-color);
      top: calc(50% - var(--track-selected-size, --track-size) / 2);
    }
    .track-selected--disabled {
      display: none;
    }
    .helplines {
      position: absolute;
      width: calc(100% - var(--thumb-size));
      padding: 0 calc(var(--thumb-size) / 2);
      height: var(--thumb-size);
      top: 0px;
      box-sizing: border-box;
      left: calc(var(--thumb-size) / 2);
    }
    .helpline {
      top: 0;
      height: 100%;
      position: absolute;
      width: var(--helpline-width);
      background: var(--helpline-color);
      cursor: pointer;
    }
    .helpline {
      cursor: initial;
    }
  `;
}
