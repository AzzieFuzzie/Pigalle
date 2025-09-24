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
        console.log(section);
        // Make section visible so ScrollTrigger can measure
        GSAP.set(section, { autoAlpha: 1, y: 0 });

        // Destroy old triggers before setting up the new one
        if (this.menuPin) this.menuPin.destroy();

        // Setup the pin/animations for the new section

        this.menuPin.setupSection(section);





        // Refresh ScrollTrigger after layout changes
        requestAnimationFrame(() => ScrollTrigger.refresh());
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
