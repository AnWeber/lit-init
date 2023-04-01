import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("showcase-app")
export class ShowcaseApp extends LitElement {
  constructor() {
    super();
  }

  @state()
  public value: string | null = null;

  private helplines = ["25%", "50%", "75%"]

  render() {
    return html` <div>
      <aw-range
        @input="${(evt: InputEvent) => this.changeInput(evt)}"
        .helplines="${this.helplines}"
      ></aw-range>
      <input type="range">
      <div>${this.value}</div>
    </div>`;
  }

  private changeInput(evt: InputEvent) {
    this.value = (evt.target as HTMLInputElement).value;
  }
}
