import GSAP from 'gsap';
import AutoBind from 'auto-bind';

export default class Carousel {
  constructor({ buttons, slider, counter }) {
    AutoBind(this);

    this.nextBTN = document.querySelector(buttons.next);
    this.prevBTN = document.querySelector(buttons.prev);
    this.slides = document.querySelectorAll(slider);
    console.log(this.slides);
    this.counterEl = document.querySelector(counter);

    if (!this.nextBTN || !this.slides.length) return;

    this.currentIndex = 0;
    this.isAnimating = false;
    this.wrapIndex = GSAP.utils.wrap(0, this.slides.length);

    this._initSlides();
    this._updateCounter();
    this._events();
  }

  _initSlides() {
    this.slides.forEach((slide, i) => {
      // Hide all slides except the first one initially.
      GSAP.set(slide, {
        autoAlpha: i === 0 ? 1 : 0,
      });
    });
  }

  /**
   * The core animation logic with directional reveal.
   * @param {number} index - The index of the slide to animate to.
   * @param {number} direction - 1 for "next", -1 for "previous".
   */
  _animateTo(index, direction) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const prevSlide = this.slides[this.currentIndex];
    const nextSlide = this.slides[index];

    // Get the inner image elements for the parallax effect.
    const prevImage = prevSlide.querySelector('.food__image');
    const nextImage = nextSlide.querySelector('.food__image');

    // Create a GSAP timeline for perfect synchronization.
    const tl = GSAP.timeline({
      onComplete: () => {
        // After the animation, hide the old slide and reset its properties.
        GSAP.set(prevSlide, { autoAlpha: 0 });
        this.isAnimating = false;
      },
      // Set default animation properties for all tweens in this timeline.
      defaults: {
        duration: 0.9, // A slightly longer, more elegant duration.
        ease: 'power3.inOut',
      },
    });

    // 1. Prepare the slides for animation.
    GSAP.set(prevSlide, { zIndex: 1 });
    GSAP.set(nextSlide, { autoAlpha: 1, zIndex: 2 });

    // 2. Animate OUT the current slide's container.
    tl.to(prevSlide, { xPercent: -100 * direction }, 0);

    // 3. Animate IN the next slide with a parallax reveal effect.
    tl.from(nextSlide, { xPercent: 100 * direction }, 0)
      .from(nextImage, {
        // Move the image in the opposite direction of the container.
        xPercent: -100 * direction,
        // Add a subtle scale for more depth.
        scale: 1.1,
      }, 0);

    this.currentIndex = index;
    this._updateCounter();
  }

  // Pass a direction value to the core animation function.
  _animateNext() {
    const nextIndex = this.wrapIndex(this.currentIndex + 1);
    this._animateTo(nextIndex, 1); // 1 indicates "forward".
  }

  _animatePrev() {
    const prevIndex = this.wrapIndex(this.currentIndex - 1);
    this._animateTo(prevIndex, -1); // -1 indicates "backward".
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

    // Kill tweens of inner images as well.
    this.slides.forEach(slide => GSAP.killTweensOf(slide.querySelector('.food__image')));

    this.slides = null;
    this.nextBTN = null;
    this.prevBTN = null;
    this.counterEl = null;
  }
}