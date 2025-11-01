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

    const categoryEl = document.querySelector(".menu__category");
    if (categoryEl) {
      new MobileCategorySwipe({ element: categoryEl });
    }

    const firstSection = document.querySelector(".menu__section.--active");
    if (firstSection) {
      this.pinSwapper.setupSection(firstSection);
    }

    this.elements.button.forEach(btn => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;
        this.showCategory(category);
      });
    });
  }

  showCategory(category) {
    if (this.pinSwapper) {
      this.pinSwapper.destroy();
    }

    // --- START: MODIFICATION FOR FADE-IN ---

    const activeSection = Array.from(this.elements.section).find(s => s.dataset.category === category);

    this.elements.section.forEach(section => {
      section.classList.remove('--active');

      // Animate out all non-active sections
      if (section !== activeSection) {
        GSAP.to(section, {
          autoAlpha: 0,
          duration: 0.4, // Fade-out duration
          ease: 'power2.out',

        });
      }
    });

    if (activeSection) {
      activeSection.classList.add('--active');
      // Animate in the active section
      GSAP.fromTo(activeSection, {
        autoAlpha: 0  // <-- Force it to start from 0
      }, {
        autoAlpha: 1,       // <-- Animate to 1
        duration: 0.4,
        delay: 0.1,
        ease: 'power2.in',
      });
    }

    // --- END: MODIFICATION FOR FADE-IN ---


    // Update buttons
    this.elements.button.forEach(btn => {
      const isActive = btn.dataset.category === category;
      btn.classList.toggle('--active', isActive);
      GSAP.to(btn, {
        color: isActive ? "#000" : "#CBC4B1",
        duration: 0.5,
        ease: "expo.out"
      });
    });

    // Re-initialize the PinSwapper on the new section
    if (activeSection) {
      this.pinSwapper.setupSection(activeSection);
    }

    // Refresh ScrollTrigger after the DOM has been updated.
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
}