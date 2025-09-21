import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
GSAP.registerPlugin(ScrollTrigger);

export default class MenuPin {
  constructor() {
    this.mm = null;               // current matchMedia instance
    this.triggers = [];           // all ScrollTrigger instances
    this.clickHandlers = [];      // {el, handler} for mobile cleanup
    this.currentSection = null;
  }

  setupSection(section) {
    if (!section) return;

    // tear down previous triggers
    this.destroy();

    this.currentSection = section;
    this.mm = GSAP.matchMedia();

    // Helper to safely initialize desktop after layout/images ready
    const safeInitDesktop = () => {
      // small timeout/raf to ensure layout paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            this.setupDesktop(section);
            // ensure ScrollTrigger recalculates with correct measurements
            ScrollTrigger.refresh();
          } catch (e) {
            console.warn('MenuPin desktop init error', e);
          }
        });
      });
    };

    // Desktop: wait for first image to be loaded if present
    this.mm.add("(min-width: 1024px)", () => {
      const firstImg = section.querySelector(".menu__image");
      if (firstImg && !firstImg.complete) {
        firstImg.addEventListener('load', safeInitDesktop, { once: true });
        // also set a fallback timeout in case load event has issues
        setTimeout(safeInitDesktop, 300);
      } else {
        safeInitDesktop();
      }
      return () => { /* matchMedia will cleanup via destroy() */ };
    });

    // Mobile setup (click handlers) — also delay a frame so layout exists
    this.mm.add("(max-width: 1023px)", () => {
      requestAnimationFrame(() => {
        this.setupMobile(section);
      });
      return () => { /* cleaned by destroy() */ };
    });
  }


  setupDesktop(section) {
    const imageWrapper = section.querySelector(".menu__image__wrapper");
    if (!imageWrapper) return;
    GSAP.set(imageWrapper, { x: 0, y: 0 });

    const images = Array.from(section.querySelectorAll(".menu__image"));
    const items = Array.from(section.querySelectorAll(".menu__item"));
    if (!items.length) return;

    // total height of all items
    const totalTextHeight = items.reduce((acc, it) => acc + it.getBoundingClientRect().height, 0);
    const imageHeight = imageWrapper.getBoundingClientRect().height;

    // create or update spacer
    let spacer = section.querySelector(".menu__spacer");
    if (!spacer) {
      spacer = document.createElement("div");
      spacer.classList.add("menu__spacer");
      section.appendChild(spacer);
    }
    spacer.style.height = `${totalTextHeight}px`;

    // pin duration = total section scroll minus image wrapper height
    const sectionHeight = section.scrollHeight;
    const pinDuration = sectionHeight - imageHeight;

    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      pin: imageWrapper,
      pinSpacing: false,
      scrub: true,
      markers: true,
    });
    this.triggers.push(pinTrigger);

    // create image triggers based on menu items
    items.forEach((item, i) => {
      const imgTrigger = ScrollTrigger.create({
        trigger: item,
        start: "top top",
        end: "bottom top",
        onEnter: () => this.showImage(images, i),
        onEnterBack: () => this.showImage(images, i),
        markers: true,
      });
      this.triggers.push(imgTrigger);
    });

    // initial visible image
    this.showImage(images, 0);
  }


  setupMobile(section) {
    const images = Array.from(section.querySelectorAll(".menu__image"));
    const items = Array.from(section.querySelectorAll(".menu__item"));

    // defensive: remove previous handlers on these elements (in case)
    items.forEach((item) => {
      if (item._menuPinHandler) {
        item.removeEventListener("click", item._menuPinHandler);
        delete item._menuPinHandler;
      }
    });

    items.forEach((item, i) => {
      const handler = () => this.showImage(images, i);
      item.addEventListener("click", handler);
      item._menuPinHandler = handler;
      this.clickHandlers.push({ el: item, handler });
    });

    this.showImage(images, 0);
  }

  showImage(images, index) {
    // set current state immediately (avoid flicker), then animate target
    images.forEach((img, i) => {
      GSAP.set(img, { autoAlpha: i === index ? 1 : 0 });
    });
    GSAP.to(images[index], { autoAlpha: 1, duration: 0.25, ease: "expo.out" });
  }

  destroy() {
    // kill all ScrollTriggers created by this instance
    if (this.triggers && this.triggers.length) {
      this.triggers.forEach((t) => t && t.kill());
    }
    this.triggers = [];

    // remove mobile click handlers
    if (this.clickHandlers && this.clickHandlers.length) {
      this.clickHandlers.forEach(({ el, handler }) => {
        el.removeEventListener("click", handler);
        if (el._menuPinHandler) delete el._menuPinHandler;
      });
    }
    this.clickHandlers = [];

    // remove spacer only from the current section
    if (this.currentSection) {
      const sp = this.currentSection.querySelector(".menu__spacer");
      if (sp) sp.remove();
    }

    this.currentSection = null;
  }

}
