import Component from '../classes/Component';
import GSAP from 'gsap';

export default class Marquee extends Component {

  constructor({ element, elements }) {
    super({ element, elements });
    this._onResize = this._onResize.bind(this); // bind for removal
    this.animateIn();
  }

  animateIn() {
    const wrapper = this.element.querySelector('.marquee__wrapper');
    this.direction = this.element.dataset.direction || "left";
    this.wrapperWidth = wrapper.getBoundingClientRect().width;

    const move = this.direction === "left" ? -this.wrapperWidth : this.wrapperWidth;

    this.tween = GSAP.to(this.element, {
      x: `${move}px`,
      duration: 40,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => {
          const currentWidth = wrapper.getBoundingClientRect().width;
          const num = parseFloat(x);
          return (num % -currentWidth) + "px";
        }
      }
    });

    window.addEventListener("resize", this._onResize);
  }

  _onResize() {
    const wrapper = this.element.querySelector('.marquee__wrapper');
    this.wrapperWidth = wrapper.getBoundingClientRect().width;
  }

  destroy() {
    // Kill the tween
    this.tween?.kill();

    // Remove event listener
    window.removeEventListener("resize", this._onResize);
  }
}
