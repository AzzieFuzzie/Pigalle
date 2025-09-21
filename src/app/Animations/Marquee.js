import Component from '../classes/Component';
import GSAP from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

GSAP.registerPlugin(ScrollTrigger);

export default class Marquee extends Component {
  constructor({ element, elements }) {
    super({ element, elements });
    this._onResize = this._onResize.bind(this);
    this.wrapper = this.element.querySelector('.marquee__wrapper');
    this.direction = this.element.dataset.direction || "left";
    this.init();
  }

  init() {
    this.wrapperWidth = this.wrapper.getBoundingClientRect().width;
    const move = this.direction === "left" ? -this.wrapperWidth : this.wrapperWidth;

    this.tween = GSAP.to(this.element, {
      x: `${move}px`,
      duration: 40,
      ease: "none",
      repeat: -1,
      paused: true, // start paused
      modifiers: {
        x: (x) => {
          const currentWidth = this.wrapper.getBoundingClientRect().width;
          const num = parseFloat(x);
          return (num % -currentWidth) + "px";
        }
      }
    });

    // ScrollTrigger controls play/pause
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.element,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => this.tween.play(),
      onEnterBack: () => this.tween.play(),
      onLeave: () => this.tween.pause(),
      onLeaveBack: () => this.tween.pause(),
    });

    window.addEventListener("resize", this._onResize);
  }

  _onResize() {
    this.wrapperWidth = this.wrapper.getBoundingClientRect().width;
  }

  destroy() {
    this.tween?.kill();
    this.scrollTrigger?.kill();
    window.removeEventListener("resize", this._onResize);
  }
}
