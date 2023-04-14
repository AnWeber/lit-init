import { LitElement, css, html } from "lit";
import { customElementIfNotExists } from "./custom-element";
import { property } from "lit/decorators.js";

const splitterPositionProperty = "--splitter-position";

@customElementIfNotExists("aw-split")
export class AwSplit extends LitElement {
  constructor() {
    super();
  }

  @property({
    converter: (value) =>
      value?.toLowerCase() === "vertical" ? "vertical" : "horizontal",
  })
  public orientation: "vertical" | "horizontal" = "horizontal";

  @property({ type: Number })
  public keywidth = 3;

  @property({ type: Number })
  public snap = 0;

  disconnectedCallback() {
    this.cleanUp();
    super.disconnectedCallback();
  }

  private disposables: Array<() => void> = [];

  private cleanUp() {
    for (const dispose of this.disposables) {
      dispose();
    }
    this.disposables.length = 0;
    delete this.dragState;
  }

  private get positionGetter() {
    if (this.orientation === "vertical") {
      return {
        pointerPosition: (evt: PointerEvent) => evt.clientY,
        minPosition: (rect: DOMRect) => rect.y,
        maxPosition: (rect: DOMRect) => rect.y + rect.height,
      };
    }
    return {
      pointerPosition: (evt: PointerEvent) => evt.clientX,
      minPosition: (rect: DOMRect) => rect.x,
      maxPosition: (rect: DOMRect) => rect.x + rect.width,
    };
  }

  private dragState:
    | {
        minPosition: number;
        maxPosition: number;
        modifier: number;
      }
    | undefined;

  private pointerdown(evt: PointerEvent) {
    const getter = this.positionGetter;

    let modifier = 0;
    if (this.isSplitterElement(evt.currentTarget)) {
      const targetRect = evt.currentTarget?.getBoundingClientRect();
      const minPosition = getter.minPosition(targetRect);
      modifier = getter.pointerPosition(evt) - minPosition;
    }

    const boundingRect = this.getBoundingClientRect();
    this.dragState = {
      minPosition: getter.minPosition(boundingRect),
      maxPosition: getter.maxPosition(boundingRect),
      modifier,
    };

    this.registerWindowListener("pointermove", this.pointermove);
    this.registerWindowListener("pointerup", this.pointerup);

    evt.preventDefault();
  }

  private isSplitterElement(evt: EventTarget | null): evt is HTMLDivElement {
    const obj = evt as HTMLDivElement;
    return (
      typeof obj.getBoundingClientRect === "function" &&
      obj.tagName?.toLowerCase() === "div"
    );
  }

  private registerWindowListener(
    type: "pointerup" | "pointermove",
    handler: (evt: PointerEvent) => void
  ) {
    const bindhandler = handler.bind(this);
    window.addEventListener(type, bindhandler);
    this.disposables.push(() => window.removeEventListener(type, bindhandler));
  }

  private pointerup(evt: PointerEvent) {
    console.info("pointerup", evt);
    this.cleanUp();
    evt.preventDefault();
  }

  private pointermove(evt: PointerEvent) {
    if (this.dragState) {
      const getter = this.positionGetter;
      const currentPosition = this.getPointerPosition(
        getter.pointerPosition(evt)
      );

      const distance = currentPosition - this.dragState.minPosition;
      console.info(
        "distance",
        distance,
        getter.pointerPosition(evt),
        this.dragState.modifier
      );

      this.setStyleProperty(distance - this.dragState.modifier);
      evt.preventDefault();
    }
  }

  private setStyleProperty(val: number) {
    this.style.setProperty(splitterPositionProperty, `${Math.max(0, val)}px`);
  }

  private getPointerPosition(position: number) {
    let result = position;
    if (this.dragState) {
      if (this.dragState.minPosition + this.snap > position) {
        result = this.dragState.minPosition;
      } else if (this.dragState.maxPosition - this.snap < position) {
        result = this.dragState.maxPosition;
      }
    }
    return result;
  }

  private keydown(evt: KeyboardEvent) {
    if (this.isSplitterElement(evt.currentTarget)) {
      let delta = 0;
      if (["Up", "ArrowUp", "ArrowLeft", "Left"].indexOf(evt.key) >= 0) {
        delta = -this.keywidth;
      } else if (
        ["Down", "ArrowDown", "ArrowRight", "Right"].indexOf(evt.key) >= 0
      ) {
        delta = this.keywidth;
      }
      if (delta) {
        const position =
          this.positionGetter.minPosition(
            evt.currentTarget.getBoundingClientRect()
          ) - this.positionGetter.minPosition(this.getBoundingClientRect());
        this.setStyleProperty(position + delta);
        evt.preventDefault();
      }
    }
  }

  public render(): unknown {
    return html` <slot id="primary" name="primary"></slot>
      <div
        part="splitter"
        id="splitter"
        @pointerdown="${this.pointerdown}"
        @keydown="${this.keydown}"
        tabindex="0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 96 960 960"
        >
          <path
            d="M207.858 624Q188 624 174 609.858q-14-14.141-14-34Q160 556 174.142 542q14.141-14 34-14Q228 528 242 542.142q14 14.141 14 34Q256 596 241.858 610q-14.141 14-34 14Zm272 0Q460 624 446 609.858q-14-14.141-14-34Q432 556 446.142 542q14.141-14 34-14Q500 528 514 542.142q14 14.141 14 34Q528 596 513.858 610q-14.141 14-34 14Zm272 0Q732 624 718 609.858q-14-14.141-14-34Q704 556 718.142 542q14.141-14 34-14Q772 528 786 542.142q14 14.141 14 34Q800 596 785.858 610q-14.141 14-34 14Z"
          />
        </svg>
      </div>
      <slot id="secondary" name="secondary"></slot>`;
  }

  public static override styles = css`
    :host {
      --splitter-position: 50%;
      --splitter-size: 1rem;
      display: flex;
      overflow: hidden !important;
      transform: translateZ(0);
    }
    :host([hidden]) {
      display: none !important;
    }
    :host([orientation="vertical"]) {
      flex-direction: column;
    }
    [part="splitter"] {
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: ew-resize;
      flex: 0 0 0;
      position: relative;
      z-index: 1;
      overflow: visible;
      min-width: var(--splitter-size);
      min-height: var(--splitter-size);
    }
    :host([orientation="vertical"]) > [part="splitter"] {
      cursor: ns-resize;
    }
    svg{
      height: var(--splitter-size);
      transform: rotate(90deg);
    }
    :host([orientation="vertical"]) svg {
      transform: initial;
    }
    :host ::slotted(*) {
      flex: 1 1 auto;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
    :host ::slotted([slot="primary"]) {
      flex: 1 1 var(--splitter-position);
    }
    :host ::slotted([slot="secondary"]) {
      flex: 1 1 calc(100% - var(--splitter-position) - var(--splitter-size));
    }
  `;
}
