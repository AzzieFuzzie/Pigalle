import Component from '../classes/Component';
import GSAP from 'gsap';

export default class Marquee extends Component {

  constructor({ element, elements }) {
    super({ element, elements })
    this.animateIn()
  }


  animateIn() {

    const wrapper = this.element.querySelector('.marquee__wrapper');
    const direction = this.element.dataset.direction || "left";
    let wrapperWidth = wrapper.getBoundingClientRect().width

    const move = direction === "left" ? -wrapperWidth : wrapperWidth;
    this.tween = GSAP.to(this.element, {
      x: `${move}px`,
      duration: 40,
      ease: "linear",
      repeat: -1,
      modifiers: {
        x: (x) => {
          let currentWidth = wrapper.getBoundingClientRect().width;  // read fresh width each frame
          const num = parseFloat(x);
          return (num % -currentWidth) + "px";
        }
      }
    });


    // handle window resize
    window.addEventListener("resize", () => {
      wrapperWidth = wrapper.getBoundingClientRect().width;
      console.log(wrapperWidth);
    });
  }


  animateOut() {
    // console.log('animation stopped');
    // if (this.tween) this.tween.kill();

  }

} 