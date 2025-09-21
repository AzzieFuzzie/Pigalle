import Page from '@classes/Page';
import MenuPin from '@animations/MenuPin';
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

    this.menuPin = new MenuPin();

    const categoryEl = document.querySelector(".menu__category");
    if (categoryEl) {
      new MobileCategorySwipe({ element: categoryEl });
    }

    const firstSection = document.querySelector(".menu__section.--active");
    if (firstSection) {
      this.menuPin.setupSection(firstSection);
    }
  }

  showCategory(category) {
    this.elements.section.forEach(section => {
      const isActive = section.dataset.category === category;

      if (isActive) {
        // Destroy any previous triggers
        this.menuPin.destroy();

        // Make section visible immediately so heights are correct
        section.classList.add('--active');
        GSAP.set(section, { autoAlpha: 1, y: 0 });

        // Setup pin AFTER section is visible
        this.menuPin.setupSection(section);

        // Refresh ScrollTrigger to recalc pin
        ScrollTrigger.refresh();
      } else {
        section.classList.remove('--active');
        GSAP.set(section, { autoAlpha: 0, y: 0 });
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
