import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
GSAP.registerPlugin(ScrollTrigger);

export default class MenuPin {
  constructor() {
    this.mm = null;               // matchMedia instance
    this.triggers = [];           // ScrollTrigger instances
    this.clickHandlers = [];      // mobile click handlers
    this.currentSection = null;
  }

  setupSection(section) {
    if (!section) return;

    const runSetup = () => {
      // destroy previous triggers/spacers
      this.destroy();

      this.currentSection = section;
      this.mm = GSAP.matchMedia();

      const initDesktop = () => {
        this.setupDesktop(section);
      };

      // Desktop
      this.mm.add("(min-width:1024px)", () => {
        const firstImg = section.querySelector(".menu__image");
        if (firstImg && !firstImg.complete) {
          firstImg.addEventListener("load", initDesktop, { once: true });
          setTimeout(initDesktop, 300);
        } else {
          initDesktop();
        }
        return () => { };
      });

      // Mobile
      this.mm.add("(max-width:1023px)", () => {
        requestAnimationFrame(() => this.setupMobile(section));
        return () => { };
      });
    };

    // Run immediately if DOM is ready, otherwise wait for DOMContentLoaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", runSetup);
    } else {
      runSetup();
    }
  }


  setupDesktop(section) {
    const imageWrapper = section.querySelector(".menu__image__wrapper");
    if (!imageWrapper) return;

    const images = Array.from(section.querySelectorAll(".menu__image"));
    const items = Array.from(section.querySelectorAll(".menu__item"));
    if (!items.length) return;

    const imageHeight = imageWrapper.getBoundingClientRect().height;

    // spacer at the end
    let spacer = section.querySelector(".menu__spacer");
    if (!spacer) {
      spacer = document.createElement("div");
      spacer.classList.add("menu__spacer");
      section.appendChild(spacer);
    }
    spacer.style.height = `${imageHeight}px`;

    const pinDuration = section.scrollHeight + imageHeight;

    // Pin image wrapper
    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${pinDuration}`,
      pin: imageWrapper,
      pinSpacing: false,
      markers: true,
    });
    this.triggers.push(pinTrigger);

    // Swap images per item
    items.forEach((item, i) => {
      const t = ScrollTrigger.create({
        trigger: item,
        start: `top top+=${imageHeight / 2}`,
        end: `bottom top`,
        onEnter: () => this.showImage(images, i),
        onEnterBack: () => this.showImage(images, i),
        markers: true,
      });
      this.triggers.push(t);
    });

    // show first image immediately
    this.showImage(images, 0);
  }

  setupMobile(section) {
    const images = Array.from(section.querySelectorAll(".menu__image"));
    const items = Array.from(section.querySelectorAll(".menu__item"));

    // remove previous handlers
    items.forEach(item => {
      if (item._menuPinHandler) {
        item.removeEventListener("click", item._menuPinHandler);
        delete item._menuPinHandler;
      }
    });

    // add click handlers
    items.forEach((item, i) => {
      const handler = () => this.showImage(images, i);
      item.addEventListener("click", handler);
      item._menuPinHandler = handler;
      this.clickHandlers.push({ el: item, handler });
    });

    // show first image
    this.showImage(images, 0);
  }

  showImage(images, index) {
    images.forEach((img, i) => {
      GSAP.set(img, { autoAlpha: i === index ? 1 : 0 });
    });
    GSAP.to(images[index], { autoAlpha: 1, duration: 0.25, ease: "expo.out" });
  }

  destroy() {
    // kill triggers
    this.triggers.forEach(t => t && t.kill());
    this.triggers = [];

    // remove click handlers
    this.clickHandlers.forEach(({ el, handler }) => {
      el.removeEventListener("click", handler);
      if (el._menuPinHandler) delete el._menuPinHandler;
    });
    this.clickHandlers = [];

    // remove spacer
    if (this.currentSection) {
      const sp = this.currentSection.querySelector(".menu__spacer");
      if (sp) sp.remove();
    }

    this.currentSection = null;
  }
}
