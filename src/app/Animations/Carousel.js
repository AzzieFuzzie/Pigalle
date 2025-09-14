import GSAP from 'gsap';
import AutoBind from 'auto-bind';

export default class Carousel {
  constructor({ buttons, slider, counter }) {
    AutoBind(this);

    this.nextBTN = document.querySelector(buttons.next);
    this.prevBTN = document.querySelector(buttons.prev);
    this.slides = document.querySelectorAll(slider);
    this.counterEl = document.querySelector(counter); // NEW

    this.currentIndex = 0;
    this.wrapIndex = GSAP.utils.wrap(0, this.slides.length);

    this._initSlides();
    this._updateCounter(); // initial counter
    this._events();
  }

  _initSlides() {
    this.slides.forEach((slide, i) => {
      GSAP.set(slide, {
        autoAlpha: i === 0 ? 1 : 0,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        ease: 'linear',
      });
    });
  }

  _animateTo(index) {
    const prevSlide = this.slides[this.currentIndex];
    const nextSlide = this.slides[index];

    GSAP.killTweensOf([prevSlide, nextSlide]);

    GSAP.set(nextSlide, { autoAlpha: 0, zIndex: 2 });
    GSAP.set(prevSlide, { zIndex: 1 });

    const tl = GSAP.timeline({
      onComplete: () => {
        GSAP.set(prevSlide, { zIndex: 0 });
        GSAP.set(nextSlide, { zIndex: 1 });
      }
    });

    tl.to(prevSlide, { autoAlpha: 0, duration: 0.8, ease: 'power2.out' }, 0)
      .to(nextSlide, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0);

    this.currentIndex = index;
    this._updateCounter(); // update counter after slide change
  }

  _animateNext() {
    const nextIndex = this.wrapIndex(this.currentIndex + 1);
    this._animateTo(nextIndex);
  }

  _animatePrev() {
    const prevIndex = this.wrapIndex(this.currentIndex - 1);
    this._animateTo(prevIndex);
  }

  _updateCounter() {
    this.counterEl.textContent = `${this.currentIndex + 1}/${this.slides.length}`;
  }

  _events() {
    this.nextBTN.addEventListener('click', this._animateNext);
    this.prevBTN.addEventListener('click', this._animatePrev);
  }

  destroy() {
    this.nextBTN.removeEventListener('click', this._animateNext);
    this.prevBTN.removeEventListener('click', this._animatePrev);
    GSAP.killTweensOf(this.slides);

    this.slides = null;
    this.nextBTN = null;
    this.prevBTN = null;
    this.counterEl = null;
  }
}
