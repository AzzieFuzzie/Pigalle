import GSAP from 'gsap';
import AutoBind from 'auto-bind';

export default class Carousel {
  constructor({ buttons, slider, counter }) {

    this.carousel = document.querySelector(".carousel");
    this.slides = GSAP.utils.toArray(document.querySelectorAll(".carousel__slide"));
    this.prevButton = document.querySelector(".btn__prev");
    this.nextButton = document.querySelector(".btn__next");
    this.controls = document.querySelector(".carousel__controls");
    this.currentIndex = 0;

    this.counter = document.querySelector(".carousel__counter span");

    if (this.slides.length) {
      this.init();
    }
  }

  /**
   * Sets up initial styles, layouts, and event listeners for the carousel.
   */
  init() {


    // For each slide, change the styling so they all stack up
    // and set opacity to 0, unless it's the first slide
    this.slides.forEach((slide, i) => {
      slide.classList.add("carousel__slide--abs");
      GSAP.set(slide, { opacity: (i === 0 ? 1 : 0) });
    });

    // Update the progress text initially
    this.updateProgress();

    // Add event listeners for prev/next buttons
    // Use arrow functions to maintain the correct 'this' context
    this.nextButton.addEventListener("click", () => this.changeSlide(1));
    this.prevButton.addEventListener("click", () => this.changeSlide(-1));
  }

  /**
   * Animates the transition between slides.
   * @param {number} direction - The direction to move (-1 for previous, 1 for next).
   */
  changeSlide(direction) {
    // Prevent changing slides if an animation is already in progress
    if (GSAP.isTweening(this.slides)) {
      return;
    }

    // Current slide's outro animation
    GSAP.to(this.slides[this.currentIndex], {
      opacity: 0,
      ease: "power2.in"
    });

    // Calculate the next index. 
    // GSAP.utils.wrap() creates a seamless loop.
    this.currentIndex = GSAP.utils.wrap(0, this.slides.length, this.currentIndex + direction);

    // New current slide's intro animation
    GSAP.to(this.slides[this.currentIndex], {
      opacity: 1,
      ease: "power2.inOut"
    });

    this.updateProgress();
  }

  /**
   * Updates the progress indicator text.
   */
  updateProgress() {
    if (this.counter) {
      GSAP.set(this.counter, {
        innerText: `${this.currentIndex + 1}/${this.slides.length}`
      });
    }
  }
}