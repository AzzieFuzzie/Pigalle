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

    // Initialize PinSwapper, but don't set it up yet
    this.pinSwapper = new PinSwapper();

    const categoryEl = document.querySelector(".menu__category");
    if (categoryEl) {
      new MobileCategorySwipe({ element: categoryEl });
    }

    // Initial setup for the first active section
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
    // --- START: CRITICAL FIX ---

    // 1. Destroy the existing PinSwapper instance to remove old ScrollTriggers
    if (this.pinSwapper) {
      this.pinSwapper.destroy();
    }

    // --- END: CRITICAL FIX ---

    this.elements.section.forEach(section => {
      const isActive = section.dataset.category === category;
      section.classList.toggle('--active', isActive);

      // Use autoAlpha for better performance as it also handles pointer-events
      GSAP.set(section, { autoAlpha: isActive ? 1 : 0 });
    });

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

    // --- START: CRITICAL FIX ---

    // 2. Find the newly activated section
    const activeSection = Array.from(this.elements.section).find(s => s.classList.contains('--active'));

    // 3. Re-initialize the PinSwapper on the new section
    if (activeSection) {
      this.pinSwapper.setupSection(activeSection);
    }

    // 4. Refresh ScrollTrigger AFTER the DOM has been updated.
    // This ensures GSAP recalculates positions correctly.
    ScrollTrigger.refresh();

    // --- END: CRITICAL FIX ---
  }
}