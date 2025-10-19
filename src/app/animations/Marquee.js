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

    // Use a timeout to ensure the DOM is fully ready before initializing.
    this.initTimeout = setTimeout(this.init.bind(this), 100);

    window.addEventListener("resize", this._onResize);
  }

  init() {
    // Clear any existing animations before creating new ones.
    this.destroyAnimations();

    this.wrapperWidth = this.wrapper.getBoundingClientRect().width;
    const move = this.direction === "left" ? -this.wrapperWidth : this.wrapperWidth;

    this.tween = GSAP.to(this.element, {
      x: `${move}px`,
      duration: 35,
      ease: "none",
      repeat: -1,
      paused: true,
      modifiers: {
        x: (x) => {
          const num = parseFloat(x);
          return (num % -this.wrapperWidth) + "px";
        }
      }

    });

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.element,
      start: "top-=50 bottom",
      end: "bottom top",
      onEnter: () => this.tween.play(),
      onEnterBack: () => this.tween.play(),
      onLeave: () => this.tween.pause(),
      onLeaveBack: () => this.tween.pause(),
      markers: false,
    });
  }

  _onResize() {
    // Debounce the resize event to avoid firing too often.
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(this.init.bind(this), 200); // Re-initialize after 200ms of no resizing.
  }

  destroyAnimations() {
    // A dedicated function to safely kill GSAP instances.
    this.tween?.kill();
    this.scrollTrigger?.kill();
  }

  destroy() {
    // Complete cleanup when the page changes.
    clearTimeout(this.initTimeout);
    clearTimeout(this.resizeTimeout);
    this.destroyAnimations();
    window.removeEventListener("resize", this._onResize);
  }
}