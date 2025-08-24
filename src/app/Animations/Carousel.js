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

    this._events();
    this._showSlide(this.currentIndex);
  }

  _showSlide(index) {
    this.slides.forEach((slide, i) => {
      slide.style.opacity = i === index ? 1 : 0;

    });
  }

  _animateNext() {
    const prevSlide = this.slides[this.currentIndex];
    this.currentIndex = this.wrapIndex(this.currentIndex + 1);
    const nextSlide = this.slides[this.currentIndex];

    GSAP.fromTo(nextSlide,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1, ease: "power2.inOut" }
    );

    GSAP.to(prevSlide, {
      opacity: 0,
      scale: 1.05,
      duration: 1,
      ease: "power2.inOut"
    });
  }

  _animatePrev() {
    const prevSlide = this.slides[this.currentIndex];
    this.currentIndex = this.wrapIndex(this.currentIndex - 1);
    const nextSlide = this.slides[this.currentIndex];

    GSAP.fromTo(nextSlide,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power1.out" }
    );

    GSAP.to(prevSlide, {
      opacity: 0,
      scale: 1.05,
      duration: 0.5,
      ease: "power2.inOut"
    });
  }

  _events() {
    this.nextBTN.addEventListener('click', this._animateNext);
    this.prevBTN.addEventListener('click', this._animatePrev);

  }
}
