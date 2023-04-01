import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement("aw-switch")
export class AwSwitch extends LitElement {
  constructor() {
    super();
  }
  private _checked = false;
  @property()
  public get checked() {
    return this._checked;
  }
  public set checked(val: boolean) {
    this._checked = val;
  }
  @property()
  public name: string | undefined;

  @property()
  public disabled: "" | boolean | undefined;

  private get isDisabled() {
    return this.disabled === "" || !!this.disabled;
  }

  render() {
    return html`<label class="switch">
      <slot></slot>
      <input
        name="${ifDefined(this.name)}"
        type="checkbox"
        ?checked="${this.checked}"
        ?disabled="${this.isDisabled}"
        @input=${this.handleInput}
      />
      <span class="slider"></span>
      <slot name="after"></slot>
    </label>`;
  }

  private handleInput(evt: InputEvent & { target: HTMLInputElement }) {
    this.checked = !!evt.target?.checked;
  }

  public static override styles = css`
    :host {
      --switch-width: 1.5rem;
      --switch-gap: 2px;
      --switch-transition: 0.4s;
      --switch-track-color: #424242;
      --switch-track-color-checked: #4fc3f7;
      --switch-track-color-disabled: #CCC;
      --switch-track-size: 0.5rem;
      --switch-thumb-size: 0.8rem;
      --switch-thumb-color: #fff;
      --switch-thumb-color-checked: #1976d2;
      --switch-thumb-color-focus: #0d47a1;
    }
    @media (prefers-reduced-motion) {
      :host {
        --switch-transition: 0;
      }
    }
    /* The switch - the box around the slider */
    .switch {
      position: relative;
      display: inline-flex;
      gap: var(--switch-gap);
      flex-direction: row;
      align-items: center;
      cursor: pointer;
    }

    /* Hide default HTML checkbox */
    .switch input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: relative;
      width: var(--switch-width);
      height: var(--switch-thumb-size);
    }

    .slider:before {
      content: "";
      position: absolute;
      width: 100%;
      top: calc(50% - var(--switch-track-size) / 2);
      height: var(--switch-track-size);
      background: var(--switch-track-color);
      transition: var(--switch-transition);
      border-radius: var(--switch-track-size);
    }
    input:checked + .slider:before {
      background: var(--switch-track-color-checked);
    }
    input:disabled + .slider:before {
      background: var(--switch-track-color-disabled);
    }

    .slider:after {
      content: "";
      display: block;
      position: relative;
      height: var(--switch-thumb-size);
      width: var(--switch-thumb-size);
      background: var(--switch-thumb-color);
      transition: var(--switch-transition);
      border-radius: 50%;
      box-shadow: 0 0 1px var(--switch-track-color);
    }


    input:checked + .slider:after {
      transform: translateX(calc(var(--switch-width) - var(--switch-thumb-size)));
      background: var(--switch-thumb-color-checked);
      box-shadow: 0 0 1px var(--switch-thumb-color-checked);
    }
    input:focus:checked + .slider:after {
      background: var(--switch-thumb-color-focus);
    }
    input:focus + .slider:after {
      background: var(--switch-thumb-color);
    }
  `;
}
