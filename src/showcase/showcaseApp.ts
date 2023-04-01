import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("showcase-app")
export class ShowcaseApp extends LitElement {
  constructor() {
    super();
  }

  @state()
  public rangeValue: string | null = null;
  @state()
  public switchValue: boolean | null = null;

  private helplines = ["0%", "25%", "50%", "75%", "100%"];

  render() {
    return html` <div>
      <fieldset>
        <legend>Range</legend>
        <aw-range
          @input="${(evt: InputEvent) => this.changeRange(evt)}"
          .helplines="${this.helplines}"
        ></aw-range>
        <aw-range
          @input="${(evt: InputEvent) => this.changeRange(evt)}"
          disabled
          .helplines="${this.helplines}"
        ></aw-range>
        <input type="range" />
        <input type="range" />
        <div>${this.rangeValue}</div>
      </fieldset>
      <fieldset>
        <legend>Switch</legend>
        <aw-switch
          @input="${(evt: InputEvent) => this.changeSwitch(evt)}"
        >Stereo<span slot="after">Mono</span></aw-switch>
        <aw-switch
          @input="${(evt: InputEvent) => this.changeSwitch(evt)}"
          disabled
        ></aw-switch>
        <aw-switch
          @input="${(evt: InputEvent) => this.changeSwitch(evt)}"
          checked="true"
          disabled
        ></aw-switch>
        <label><input type="checkbox" />Click Me</label>

        <label> <input type="checkbox" />Click Me</label>
        <div>${this.switchValue}</div>
      </fieldset>
    </div>`;
  }

  private changeRange(evt: InputEvent) {
    this.rangeValue = (evt.target as HTMLInputElement).value;
  }
  private changeSwitch(evt: InputEvent) {
    this.switchValue = (evt.target as HTMLInputElement).checked;
  }
}
