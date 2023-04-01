import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("showcase-app")
export class ShowcaseApp extends LitElement {
  constructor() {
    super();
  }

  @state()
  public value: string | null = null;

  private helplines = ["0%", "25%", "50%", "75%", "100%"];

  render() {
    return html` <div>
      <fieldset>
        <legend>Range</legend>
        <aw-range
          @input="${(evt: InputEvent) => this.changeInput(evt)}"
          .helplines="${this.helplines}"
        ></aw-range>
        <aw-range
          @input="${(evt: InputEvent) => this.changeInput(evt)}"
          disabled
          .helplines="${this.helplines}"
        ></aw-range>
        <input type="range">
        <input type="range">
        <div>${this.value}</div>
      </fieldset>
    </div>`;
  }

  private changeInput(evt: InputEvent) {
    this.value = (evt.target as HTMLInputElement).value;
  }
}
