import GSAP from 'gsap';


export default class Transition {
  constructor() {
    this.cols = document.querySelectorAll(".transition__col");

    // start hidden
    GSAP.set(this.cols, {
      scaleY: 0,
      transformOrigin: "bottom center"
    });
  }

  async onEnter() {
    console.log('enter');
    return GSAP.to(this.cols, {
      scaleY: 1,
      ease: "expo.inOut",
      duration: 0.8,
      stagger: 0.15
    });
  }

  async onLeave() {
    console.log('leave');
    return GSAP.to(this.cols, {
      scaleY: 0,
      ease: "expo.inOut",
      duration: 0.8,
      stagger: 0.15
    });
  }
}

