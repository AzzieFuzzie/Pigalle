import GSAP from "gsap";

export default class Transition {
  constructor({ lenis }) {
    this.cols = document.querySelectorAll(".transition__col");
    this.lenis = lenis;

    GSAP.set(this.cols, {
      scaleY: 0,
      transformOrigin: "bottom center",
    });
  }

  _disableScroll() {
    if (this.lenis) this.lenis.stop();

  }

  _enableScroll() {
    if (this.lenis) this.lenis.start();

  }

  async onEnter() {
    this._disableScroll();
    return GSAP.to(this.cols, {
      scaleY: 1,
      ease: "expo.inOut",
      duration: 0.8,
      stagger: 0.15,
    });
  }

  async onLeave() {
    this._disableScroll();
    return GSAP.to(this.cols, {
      scaleY: 0,
      ease: "expo.inOut",
      duration: 0.8,
      stagger: 0.15,
      onComplete: () => this._enableScroll(),
    });
  }
}
