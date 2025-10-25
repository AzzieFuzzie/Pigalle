import AutoBind from 'auto-bind';
import EventEmitter from 'events';
import GSAP from 'gsap';
import Prefix from 'prefix';

import PinLayer from "../animations/PinLayer";
import HeightImage from "../animations/HeightImage.js";
import TextReveal from "../animations/TextReveal";
import FAQAccordion from "../animations/FAQAccordion.js";
import Carousel from "../animations/Carousel.js";
import Scale from "../animations/Scale";
import Paragraph from "../animations/Paragraph";
import ImageReveal from "../animations/ImageReveal.js";
import Fade from "../animations/Fade.js";
import Line from "../animations/Line.js";

import Slider from "../animations/Slider";
import Marquee from "../animations/Marquee";
import Parallax from "../animations/Parallax";
import Chat from "../animations/Chat";

import each from 'lodash/each';
import map from 'lodash/map';

import { ScrollTrigger } from "gsap/ScrollTrigger";
GSAP.registerPlugin(ScrollTrigger);

export default class Page extends EventEmitter {
  constructor({ classes, element, elements }) {
    super();
    AutoBind(this);

    this.class = classes;
    this.selector = element;
    this.selectorChildren = {
      ...elements,

      animationScale: '[data-animation="scale"]',
      animationParagraph: '[data-animation="paragraph"]',
      animationSlider: '[data-animation="reviews_slider"]',
      animationCarousel: '[data-animation="carousel"]',
      animationFAQ: '[data-animation="faq"]',
      animationMarquee: '[data-animation="marquee"]',
      animationPinLayer: '[data-animation="pin"]',
      animationParallax: '[data-animation="parallax"]',
      animationChat: '[data-animation="chat"]',
      animationTextHighlight: '[data-animation="fill"]',
      animationTextReveal: '[data-animation="text"]',
      animationFade: '[data-animation="fade"]',
      animationImageReveal: '[data-animation="image_reveal"]',
      animationLine: '[data-animation="line"]',
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

    this.createAnimations(); // <-- DELETED FROM HERE
  }

  createAnimations() {
    this.animationScale = map(this.elements.animationScale, (element) => {
      return new Scale({ element });
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

    this.animationParagraph = map(this.elements.animationParagraph, (element) => {
      return new Paragraph({ element });
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

    this.animationsImageReveal = map(this.elements.animationImageReveal, (element) => {
      return new ImageReveal({ element });
    });

    this.animationsFade = map(this.elements.animationFade, (element) => {
      return new Fade({ element });
    });

    this.animationsLine = map(this.elements.animationLine, (element) => {
      return new Line({ element });
    });


    this.animationsCarousel = map(this.elements.animationCarousel, (element) => {
      return new Carousel({
        buttons: {
          next: '.btn__next',
          prev: '.btn__prev'
        },
        slider: '.carousel',
        counter: '.carousel__slider__counter  span'
      });
    });
  }


  show() {
    return new Promise((resolve) => {
      // <-- MOVED HERE: Create animations *after* page is visible


      this.addEventListeners();
      resolve();
    });
  }

  hide() {
    return new Promise((resolve) => {
      GSAP.delayedCall(1, () => {
        this.removeEventListeners();
        this.destroyAnimations();
      });

      resolve();
    });
  }

  destroyAnimations() {
    // A failsafe to kill any remaining ScrollTriggers attached to this page
    ScrollTrigger.getAll().forEach(t => t.kill());

    // Kill all animations to prevent memory leaks and conflicts
    if (this.animationScale) this.animationScale.forEach(anim => anim.destroy?.());
    if (this.animationsParallax) this.animationsParallax.forEach(anim => anim.destroy?.());
    if (this.animationsCarousel) this.animationsCarousel.forEach(anim => anim.destroy?.());
    if (this.animationsFAQ) this.animationsFAQ.forEach(anim => anim.destroy?.());
    if (this.animationsChat) this.animationsChat.forEach(anim => anim.destroy?.());

    if (this.animationsSlider) this.animationsSlider.forEach(anim => anim.destroy?.());
    if (this.animationsTextReveal) this.animationsTextReveal.forEach(anim => anim.destroy?.());
    if (this.animationsHeightImage) this.animationsHeightImage.forEach(anim => anim.destroy?.());
    if (this.animationsPinLayer) this.animationsPinLayer.forEach(anim => anim.destroy?.());
    if (this.animationsMarquee) this.animationsMarquee.forEach(anim => anim.destroy?.());
    if (this.animationParagraph) this.animationParagraph.forEach(anim => anim.destroy?.()); // <-- ADDED MISSING ANIMATION
  }

  onResize() {
    ScrollTrigger.refresh(); // <-- ADDED THIS to fix resize issues
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize);
  }

  removeEventListeners() {
    window.removeEventListener('resize', this.onResize);
  }
}