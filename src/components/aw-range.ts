import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

@customElement("aw-range")
export class AwRange extends LitElement {
  constructor() {
    super();
  }

  private _value: number| undefined = undefined;
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
  public helplines: Array<string> = [];

  render() {
    this.refreshTrack();
    let helplines = html``;
    if (this.helplines) {
      helplines = html`
        <div class="helpline"></div>
        ${repeat(
          this.helplines,
          (title, index) =>
            html`<div
              class="helpline"
              title="${title}"
              style="left: ${((index + 1) / this.helplines.length) * 100}%"
            ></div> `
        )}
        <div class="helpline"></div>
      `;
    }
    return html` <hr class="track" />
      <hr class="track track--selected" />
      <input
        type="range"
        step="${this.step}"
        min="${this.min}"
        max="${this.max}"
        value="${this.value}"
        @input=${this.handleInput}
      />${helplines}`;
  }

  private handleInput(evt: InputEvent & { target: HTMLInputElement }) {
    this.value = evt.target?.valueAsNumber;
    this.refreshTrack();
  }

  private refreshTrack() {

    this.style.setProperty("--track-selected-position", `${100 * this.value / this.max}%`);
  }

  public static override styles = css`
    :host {
      position: relative;
      display: block;

      --track-size: 0.1em;
      --track-color: #b0bec5;
      --track-selected-size: 0.2em;
      --track-selected-color: #546e7a;
      --thumb-color: #1976d2;
      --thumb-border-color: #fff;
      --thumb--border-size: 2px;
      --thumb-color-selected: #0d47a1;
      --thumb-size: 1em;
      --helpline-width: 0.1em;
      --helpline-color: #b0bec5;
    }
    .track {
      position: absolute;
      z-index:1;
      width: 100%;
      background: var(--track-color);
      height: var(--track-size);
      border: 0px;
      margin: 0;
      top: calc(50% - var(--track-size) / 2);
    }
    .track--selected {
      height: var(--track-selected-size, --track-size);
      width: var(--track-selected-position);
      background: var(--track-selected-color);
      top: calc(50% -  var(--track-selected-size, --track-size) / 2);
    }
    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      cursor: pointer;
      width: 100%;
      margin: 0;
      position: relative;
      display: block;
    }

    /* Removes default focus */
    input[type="range"]:focus {
      outline: none;
    }

    input[type="range"]::-moz-range-track {
      background-color: transparent;
    }
    input[type="range"]::-webkit-slider-runnable-track {
      background-color: transparent;
    }

    input[type="range"]::-moz-range-thumb {
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
    input[type="range"]::-webkit-slider-thumb {
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

    input[type="range"]:focus::-webkit-slider-thumb {
      background-color: var(--thumb-color-selected);
    }
    input[type="range"]:focus::-moz-range-thumb {
      background-color: var(--thumb-color-selected);
    }
    .helpline {
      top: 0;
      height: 100%;
      position: absolute;
      width: var(--helpline-width);
      background-color: var(--helpline-color);
    }
  `;
}
