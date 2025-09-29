import AutoBind from 'auto-bind';
import EventEmitter from 'events';
import GSAP from 'gsap';
import Prefix from 'prefix';

import PinLayer from "../Animations/PinLayer";
import HeightImage from "../Animations/HeightImage.js";
import TextReveal from "../Animations/TextReveal";
import FAQAccordion from "../Animations/FAQAccordion.js";
import Carousel from "../Animations/Carousel.js";
import Scale from "../Animations/Scale";
import Navigation from "../Animations/Navigation.js";
import Slider from "../Animations/Slider";
import Marquee from "../Animations/Marquee";
import Parallax from "../Animations/Parallax";
import Chat from "../Animations/Chat";

import AsyncLoad from '@classes/AsyncLoad';
import { Detection } from '@classes/Detection';

import each from 'lodash/each';
import map from 'lodash/map';

import { mapEach } from '@utils/dom';

import { ScrollTrigger } from "gsap/ScrollTrigger";

export default class Page extends EventEmitter {
  constructor({ classes, element, elements }) {
    super();
    AutoBind(this);

    this.class = classes;
    this.selector = element;
    this.selectorChildren = {
      ...elements,

      animationScale: '[data-animation="scale"]',
      animationNavigation: '[data-animation="navigation"]',
      animationSlider: '[data-animation="reviews_slider"]',
      animationCarousel: '[data-animation="carousel"]',
      animationFAQ: '[data-animation="faq"]',
      animationMarquee: '[data-animation="marquee"]',
      animationPinLayer: '[data-animation="pin"]',
      animationParallax: '[data-animation="parallax"]',
      animationChat: '[data-animation="chat"]',
      animationTextHighlight: '[data-animation="fill"]',
      animationTextReveal: '[data-animation="text"]',
      animationHeightImage: '[data-animation="height"]',
    };

    this.transformPrefix = Prefix('transform');
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry instanceof NodeList ? Array.from(entry) : entry;
      } else {
        const nodeList = document.querySelectorAll(entry);
        this.elements[key] = Array.from(nodeList);
      }
    });
    document.fonts.ready.then(() => {
      this.createAnimations();
    });

  }

  createAnimations() {
    this.animationScale = map(this.elements.animationScale, (element) => {
      return new Scale({ element });
    });

    this.animationsNavigation = map(this.elements.animationNavigation, (element) => {
      return new Navigation({ element });
    });

    this.animationsSlider = map(this.elements.animationSlider, (element) => {
      return new Slider({ element });
    });

    this.animationsTextReveal = map(this.elements.animationTextReveal, (element) => {
      return new TextReveal(element);
    });

    this.animationsHeightImage = map(this.elements.animationHeightImage, (element) => {
      return new HeightImage({ element });
    });

    this.animationsParallax = map(this.elements.animationParallax, (element) => {
      return new Parallax({ element });
    });

    this.animationsPinLayer = map(this.elements.animationPinLayer, (element) => {
      return new PinLayer({ element });
    });

    this.animationsFAQ = map(this.elements.animationFAQ, (element) => {
      return new FAQAccordion({ selector: element });
    });

    this.animationsMarquee = map(this.elements.animationMarquee, (element) => {
      return new Marquee({ element });
    });

    this.animationsChat = map(this.elements.animationChat, (element) => {
      return new Chat({ element });
    });

    this.animationsCarousel = map(this.elements.animationCarousel, (element) => {
      return new Carousel({
        buttons: {
          next: '.btn__next',
          prev: '.btn__prev'
        },
        slider: '.slider__image',
        counter: '.food__slider__counter  span'
      });
    });
  }

  show() {
    // return new Promise((resolve) => {
    //   // Start at opacity 0 before animating
    //   GSAP.set(this.element, { autoAlpha: 0 });

    //   // Animate fade in
    //   GSAP.to(this.element, {
    //     autoAlpha: 1,
    //     duration: 0.6,
    //     ease: "power2.out",
    //     onComplete: () => {
    //       this.addEventListeners();
    //       resolve();
    //     }
    //   });
    // });
  }

  hide() {
    // return new Promise((resolve) => {
    //   // Animate fade out
    //   GSAP.to(this.element, {
    //     autoAlpha: 0,
    //     duration: 0.6,
    //     ease: "power2.in",
    //     onComplete: () => {
    // if (this.animationScale) this.animationScale.forEach(anim => anim.destroy?.());
    // if (this.animationsParallax) this.animationsParallax.forEach(anim => anim.destroy?.());
    // if (this.animationsCarousel) this.animationsCarousel.forEach(anim => anim.destroy?.());
    // if (this.animationsFAQ) this.animationsFAQ.forEach(anim => anim.destroy?.());
    // // if (this.animationsMarquee) this.animationsMarquee.forEach(anim => anim.destroy?.());
    // if (this.animationsChat) this.animationsChat.forEach(anim => anim.destroy?.());

    //       this.removeEventListeners();
    //       resolve();
    //     }
    //   });
    // });

    ScrollTrigger.getAll().forEach(t => t.kill());
    ScrollTrigger.refresh();

    this.removeEventListeners();
  }


  addEventListeners() {
    window.addEventListener('resize', this.onResize);
  }

  removeEventListeners() {
    window.removeEventListener('resize', this.onResize);
  }
}
