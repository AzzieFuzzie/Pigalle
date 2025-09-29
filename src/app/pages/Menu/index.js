import Page from '@classes/Page';
import PinSwapper from '@animations/PinSwapper.js';
import MobileCategorySwipe from '@animations/MobileCategorySwipe';
import GSAP from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
GSAP.registerPlugin(ScrollTrigger);
export default class Menu extends Page {
  constructor() {
    super({
      element: '.menu',
      elements: {
        wrapper: '.menu__wrapper',
        section: '.menu__section',
        button: '.menu__category__label',
      },
    });
  }

  create() {
    super.create();

    this.pinSwapper = new PinSwapper();

    // Note: MobileCategorySwipe is assumed to be imported and functional.
    const categoryEl = document.querySelector(".menu__category");
    if (categoryEl) {
      // new MobileCategorySwipe({ element: categoryEl });
    }

    const firstSection = document.querySelector(".menu__section.--active");
    if (firstSection) {
      this.menuPin.setupSection(firstSection);
    }

    // bind buttons
    this.elements.button.forEach(btn => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;
        this.showCategory(category);
      });
    });
  }

  showCategory(category) {
    // Hide all sections first
    this.elements.section.forEach(section => {
      const isActive = section.dataset.category === category;
      if (isActive) {
        section.classList.add('--active');

        // CRITICAL STEP: Ensure visibility before height reads
        GSAP.set(section, { opacity: 1 });

        // CRITICAL STEP: Destroy old triggers completely
        if (this.menuPin) this.menuPin.destroy();

        // Setup the pin/animations for the new section
        this.menuPin.setupSection(section);

        // CRITICAL STEP: Final refresh after layout changes
        requestAnimationFrame(() => ScrollTrigger.refresh());
      } else {
        section.classList.remove('--active');
        GSAP.set(section, { opacity: 0 });
      }
    });

    // Update buttons
    this.elements.button.forEach(btn => {
      const isActive = btn.dataset.category === category;
      btn.classList.toggle('--active', isActive);
      GSAP.to(btn, { color: isActive ? "#000" : "#CBC4B1", duration: 0.5, ease: "expo.out" });
    });
  }
}
