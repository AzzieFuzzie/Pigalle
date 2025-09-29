import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
GSAP.registerPlugin(ScrollTrigger);

// Note: Assuming Page and MobileCategorySwipe imports are handled correctly elsewhere
// For completeness, these classes are defined here but should match your module pathing:
// import Page from '@classes/Page';
import MobileCategorySwipe from '@animations/MobileCategorySwipe';


/**
 * MenuPin Class (Fixed)
 * Handles the ScrollTrigger pinning and image swapping logic.
 */
export default class PinSwapper {
  constructor() {
    // FIX: Crucial: Manually bind methods to 'this' for proper context
    this.setupDesktop = this.setupDesktop.bind(this);
    this.showImage = this.showImage.bind(this);
    this.destroy = this.destroy.bind(this);

    this.mm = null;             // matchMedia instance
    this.triggers = [];         // ScrollTrigger instances
    this.clickHandlers = [];    // mobile click handlers
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
        // FIX: Removed complex image load logic and timeout.
        // Since Menu.showCategory makes the section visible first,
        // height reads should be safe, or deferred with requestAnimationFrame.
        initDesktop();
        return () => { };
      });

      // Mobile
      this.mm.add("(max-width:1023px)", () => {
        requestAnimationFrame(() => this.setupMobile(section));
        return () => { };
      });
    };

    // If your calling code (Menu.showCategory) handles activation,
    // you only need to run setup immediately.
    runSetup();
  }


  setupDesktop(section) {
    const imageWrapper = section.querySelector(".menu__image__wrapper");
    if (!imageWrapper) return;

    const images = Array.from(section.querySelectorAll(".menu__image"));
    // These reads are safe because initDesktop is deferred via matchMedia/requestAnimationFrame
    const firstImg = section.querySelector(".menu__image");
    if (!firstImg) return;

    const imageHeight = firstImg.getBoundingClientRect().height;
    const items = Array.from(section.querySelectorAll(".menu__item"));
    const itemHeight = section.querySelector(".menu__item").getBoundingClientRect().height;
    if (!items.length) return;

    // spacer at the end
    let spacer = section.querySelector(".menu__spacer");
    if (!spacer) {
      spacer = document.createElement("div");
      spacer.classList.add("menu__spacer");
      section.appendChild(spacer);
    }
    // Calculates the required spacer height
    spacer.style.height = `${imageHeight - itemHeight - 41}px`;

    // Pin image wrapper
    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      // FIX: Using "bottom top" from the working canvas code. 
      // This is safer than relying on section.scrollHeight, which can be miscalculated.
      end: "bottom top",
      pin: imageWrapper,
      pinSpacing: false,
      anticipatePin: 0,
      markers: false, // Keep markers for debugging
    });
    this.triggers.push(pinTrigger);

    // Ensure first image is visible
    GSAP.set(images[0], { opacity: 1 });

    // Then set up triggers
    items.forEach((item, i) => {
      const t = ScrollTrigger.create({
        trigger: item,
        start: `top-=25 top`,
        end: `bottom-=25 top`,
        onEnter: () => this.showImage(images, i),
        onEnterBack: () => this.showImage(images, i),
        markers: false, // Keep markers for debugging
      });
      this.triggers.push(t);
    });
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
    this.showImage(images, 0); // Changed from commented out line
  }

  showImage(images, index) {
    // Simplified image visibility toggle
    images.forEach((img, i) => {
      if (i !== index) {
        GSAP.set(img, { opacity: 0 });
      }
    });

    // Animate the target image
    GSAP.to(images[index], {
      opacity: 1,
      duration: 0.25,
      ease: "expo.out"
    });
  }


  destroy() {
    // kill all ScrollTrigger instances
    this.triggers.forEach(t => t && t.kill());
    this.triggers = [];

    // FIX: CRITICAL: Revert matchMedia changes to clean up responsive logic
    this.mm && this.mm.revert();

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

    // FIX: CRITICAL: Refresh after destruction and DOM changes to prevent layout jump
    ScrollTrigger.refresh();
  }
}