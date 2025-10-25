import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export default class Slider {
  constructor({ element }) {
    this.element = element;
    this.slider = this.element.querySelector(".reviews__slider");
    this.slides = [...this.element.querySelectorAll(".reviews__slide")];
    this.buttons = [...this.element.querySelectorAll(".reviews__dot")];
    this.total = this.slides.length;
    this.currentIndex = 0;

    this._handleButtonClick = this._handleButtonClick.bind(this);
    this._onResize = this._onResize.bind(this);

    this.init();
  }

  init() {
    this.updateSlideWidth();
    this._initButtons();
    this._initDrag();
    this.update();
    this.startAutoplay();

    window.addEventListener("resize", this._onResize);
  }

  updateSlideWidth() {
    this.slideWidths = this.slides.map(slide => slide.offsetWidth);
    this.slideWidth = this.slideWidths[0]; // Use first slide width
    const containerWidth = this.slider.parentElement.offsetWidth;
    this.centerOffset = containerWidth / 2 - this.slideWidth / 2;
  }

  _initButtons() {
    this.buttons.forEach(button => {
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
    this.currentIndex = (targetIndex + this.total) % this.total;
    const newPosition = -this.currentIndex * this.slideWidth + this.centerOffset;

    gsap.to(this.slider, {
      x: newPosition,
      duration: 0.6,
      ease: "expo.out",
    });

    this._updateClasses();
  }

  _updateClasses() {
    this.slides.forEach((slide, i) => {
      slide.classList.remove("--active", "--left", "--right");
      if (i === this.currentIndex) slide.classList.add("--active");
      else if (i === (this.currentIndex - 1 + this.total) % this.total) slide.classList.add("--left");
      else if (i === (this.currentIndex + 1) % this.total) slide.classList.add("--right");
    });

    this.buttons.forEach((button, i) => {
      button.classList.toggle("--active", i === this.currentIndex);
    });
  }

  update() {
    this.goToSlide(this.currentIndex);
  }

  startAutoplay() {
    this.autoplay = gsap.to({}, {
      duration: 4,
      repeat: -1,
      onRepeat: () => this.goToSlide((this.currentIndex + 1) % this.total),
    });
  }

  restartAutoplay() {
    this.autoplay?.kill(); // remove old tween
    this.startAutoplay();  // start fresh
  }

  _initDrag() {
    if (window.innerWidth > 768) return; // only mobile drag

    const containerWidth = this.slider.parentElement.offsetWidth;
    const minX = -((this.total - 1) * this.slideWidth) + this.centerOffset;
    const maxX = this.centerOffset;

    this.draggable = Draggable.create(this.slider, {

      type: "x",
      bounds: { minX, maxX },
      inertia: true,
      edgeResistance: 0.9,
      onPress: () => this.autoplay?.pause(),
      onRelease: () => this.updateSlideWidth(),
      onDragEnd: () => {
        this.restartAutoplay()
        this.updateSlideWidth(); // recalc widths in case of resize
        const x = this.draggable.x;
        let closestIndex = Math.round((-x + this.centerOffset) / this.slideWidth);
        closestIndex = Math.max(0, Math.min(this.total - 1, closestIndex));
        this.goToSlide(closestIndex);
      },
    })[0];
  }

  _onResize() {
    this.updateSlideWidth();
    if (this.draggable) {
      const minX = -((this.total - 1) * this.slideWidth) + this.centerOffset;
      const maxX = this.centerOffset;
      this.draggable.applyBounds({ minX, maxX });

      // Snap to current slide after resize
      this.goToSlide(this.currentIndex);
    }
  }

  destroy() {
    window.removeEventListener("resize", this._onResize);
    this.autoplay?.kill();
    this.draggable?.kill();
    this.buttons.forEach(button => button.removeEventListener("click", this._handleButtonClick));
  }
}
