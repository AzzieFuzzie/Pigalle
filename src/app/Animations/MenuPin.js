import GSAP from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

GSAP.registerPlugin(ScrollTrigger);

export default class MenuPin {
  constructor() {
    this.desktop = GSAP.matchMedia();
    this.init();
  }

  init() {
    const sections = document.querySelectorAll(".menu__section");

    this.desktop.add("(min-width: 1024px)", () => {
      sections.forEach(section => {
        const imageWrapper = section.querySelector(".menu__image__wrapper");
        if (!imageWrapper) return;

        const images = section.querySelectorAll(".menu__image");
        const items = section.querySelectorAll(".menu__item");

        // Total height of all text items + image height
        let totalTextHeight = 0;
        items.forEach(item => totalTextHeight += item.offsetHeight);
        const imageHeight = imageWrapper.offsetHeight;
        const pinDuration = totalTextHeight + imageHeight + 200; // add extra buffer


        // Pin the image wrapper for full scroll duration
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${pinDuration}`,
          pin: imageWrapper,
          pinSpacing: false,
          // scrub: true,
          markers: true,
        });

        // Swap images as each text block reaches the top of the pinned image
        items.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: `top top+=${imageHeight / 2}`, // start fade when item reaches middle of image
            end: `bottom top`,
            onEnter: () => this.showImage(images, i),
            onEnterBack: () => this.showImage(images, i),
            markers: true,
          });
        });
      });
    });
  }

  showImage(images, index) {
    images.forEach((img, i) => {
      GSAP.to(img, {
        autoAlpha: i === index ? 1 : 0,
        duration: 0.4,
        ease: "power1.out",
        zIndex: i === index ? 2 : 1,
      });
    });
  }

  destroy() {
    this.desktop.revert();
  }
}
