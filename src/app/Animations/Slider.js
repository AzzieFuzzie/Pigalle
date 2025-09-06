import GSAP from "gsap";

export default class Slider {
  constructor({ element }) {
    this.element = element;
    this.slider = this.element.querySelector(".reviews__slider");
    this.slides = [...this.element.querySelectorAll(".reviews__slide")];
    this.buttons = [...this.element.querySelectorAll(".reviews__dot")];
    this.peekOffset = 50;
    this.total = this.slides.length;
    this.currentIndex = 2; // default centered slide (3rd)
    this.slideWidth = this.slides[0].offsetWidth;

    console.log(window.innerWidth);
    // QuickTo function
    this.xTo = GSAP.quickTo(this.slider, "x", {
      duration: 0.8,
      ease: "expo.out"
    });

    this.onClick();
    this.update();
    this.startAutoplay()
  }

  onClick() {
    this.buttons.forEach((button, i) => {
      button.addEventListener("click", () => {
        let targetIndex = i; // zero-based
        this.goToSlide(targetIndex);
        this.restartAutoplay()
      });
    });
  }

  goToSlide(targetIndex) {
    let shift = targetIndex - this.currentIndex;

    this.currentIndex = (this.currentIndex + shift + this.total) % this.total;

    const containerWidth = this.slider.parentElement.offsetWidth;
    const centerOffset = containerWidth / 2 - this.slideWidth / 2;

    const newPosition = -this.currentIndex * this.slideWidth + centerOffset;

    console.log("Moving to slide:", this.currentIndex, "New X:", newPosition);

    this.xTo(newPosition);

    // Update classes for center, left, and right slides
    this.slides.forEach((slide, i) => {
      slide.classList.remove("--active", "--left", "--right");

      if (i === this.currentIndex) {
        slide.classList.add("--active");
      } else if (i === (this.currentIndex - 1 + this.total) % this.total) {
        slide.classList.add("--left");
      } else if (i === (this.currentIndex + 1) % this.total) {
        slide.classList.add("--right");
      }
    });


    // Add --active class to the current button
    this.buttons.forEach((button, i) => {
      button.classList.toggle("--active", i === this.currentIndex);
    });
  }

  update() {
    // initial render
    this.goToSlide(this.currentIndex);
  }

  startAutoplay() {
    this.autoplay = GSAP.to({}, {
      duration: 7,
      ease: "expo.out",
      repeat: - 1,
      onRepeat: () => this.goToSlide((this.currentIndex + 1) % this.total),
    });
  }

  restartAutoplay() {
    if (this.autoplay) this.autoplay.restart();
  }
}
