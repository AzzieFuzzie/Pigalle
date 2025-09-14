import GSAP from "gsap";

export default class Slider {
  constructor({ element }) {
    this.element = element;
    console.log(this.element);
    this.slider = this.element.querySelector(".reviews__slider");
    this.slides = [...this.element.querySelectorAll(".reviews__slide")];
    this.buttons = [...this.element.querySelectorAll(".reviews__dot")];
    this.peekOffset = 50;
    this.total = this.slides.length;
    this.currentIndex = 2;
    this.slideWidth = this.slides[0].offsetWidth;

    this.xTo = GSAP.quickTo(this.slider, "x", {
      duration: 0.8,
      ease: "expo.out"
    });

    this._handleButtonClick = this._handleButtonClick.bind(this);
    this.onClick();
    this.update();
    this.startAutoplay();
  }

  onClick() {
    this.buttons.forEach((button, i) => {
      button.addEventListener("click", this._handleButtonClick);
    });
  }

  _handleButtonClick(event) {
    const index = this.buttons.indexOf(event.currentTarget);
    if (index !== -1) {
      this.goToSlide(index);
      this.restartAutoplay();
    }
  }

  goToSlide(targetIndex) {
    let shift = targetIndex - this.currentIndex;
    this.currentIndex = (this.currentIndex + shift + this.total) % this.total;

    const containerWidth = this.slider.parentElement.offsetWidth;
    const centerOffset = containerWidth / 2 - this.slideWidth / 2;
    const newPosition = -this.currentIndex * this.slideWidth + centerOffset;

    this.xTo(newPosition);

    // update slide classes
    this.slides.forEach((slide, i) => {
      slide.classList.remove("--active", "--left", "--right");
      if (i === this.currentIndex) slide.classList.add("--active");
      else if (i === (this.currentIndex - 1 + this.total) % this.total) slide.classList.add("--left");
      else if (i === (this.currentIndex + 1) % this.total) slide.classList.add("--right");
    });

    // update buttons
    this.buttons.forEach((button, i) => {
      button.classList.toggle("--active", i === this.currentIndex);
    });
  }

  update() {
    this.goToSlide(this.currentIndex);
  }

  startAutoplay() {
    this.autoplay = GSAP.to({}, {
      duration: 7,
      ease: "expo.out",
      repeat: -1,
      onRepeat: () => this.goToSlide((this.currentIndex + 1) % this.total),
    });
  }

  restartAutoplay() {
    this.autoplay?.restart();
  }

  destroy() {
    // Kill GSAP tweens
    if (this.xTo) this.xTo.kill();
    if (this.autoplay) this.autoplay.kill();

    // Remove event listeners
    this.buttons.forEach((button) => {
      button.removeEventListener("click", this._handleButtonClick);
    });

    // Clear references
    this.slider = null;
    this.slides = null;
    this.buttons = null;
    this.element = null;
    this.autoplay = null;
    this.xTo = null;
  }
}
