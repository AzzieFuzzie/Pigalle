import GSAP from 'gsap';
import AutoBind from 'auto-bind';

export default class Carousel {
  constructor({ buttons, slider }) {
    AutoBind(this);

    this.nextBTN = document.querySelector(buttons.next);
    this.prevBTN = document.querySelector(buttons.prev);
    this.slides = document.querySelectorAll(slider);

    this.currentIndex = 0;
    this.wrapIndex = GSAP.utils.wrap(0, this.slides.length);

    this._initSlides();
    this._events();
  }

  _initSlides() {
    this.slides.forEach((slide, i) => {
      GSAP.set(slide, {
        autoAlpha: i === 0 ? 1 : 0, // only first slide visible
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        ease: "linear"
      });
    });
  }

  _animateTo(index) {
    const prevSlide = this.slides[this.currentIndex];
    const nextSlide = this.slides[index];

    // Ensure the next slide starts hidden (prevents flicker)
    GSAP.set(nextSlide, { autoAlpha: 0 });

    // Crossfade animation
    GSAP.to(prevSlide, {
      autoAlpha: 0,
      duration: 0.6,
      ease: "linear",
    });

    GSAP.to(nextSlide, {
      autoAlpha: 1,
      duration: 0.6,
      ease: "linear",
    });

    this.currentIndex = index;
  }

  _animateNext() {
    const nextIndex = this.wrapIndex(this.currentIndex + 1);
    this._animateTo(nextIndex);
  }

  _animatePrev() {
    const prevIndex = this.wrapIndex(this.currentIndex - 1);
    this._animateTo(prevIndex);
  }

  _events() {
    this.nextBTN.addEventListener("click", this._animateNext);
    this.prevBTN.addEventListener("click", this._animatePrev);
  }
}
