import AutoBind from 'auto-bind';
import EventEmitter from 'events';
import GSAP from 'gsap';
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// GSAP.registerPlugin(ScrollTrigger);
import Prefix from 'prefix';
import Lenis from 'lenis';

import PinLayer from "../Animations/PinLayer";
// import TextHighlight from "@animations/TextHighlight";
import FAQAccordion from "../Animations/FAQAccordion.js";
import Carousel from "../Animations/Carousel.js";
import Scale from "../Animations/Scale.js";
import Navigation from "../Animations/Navigation.js";
import Slider from "../Animations/Slider.js";
import Marquee from "../Animations/Marquee.js";
import Parallax from "../Animations/Parallax.js";
import Chat from "../Animations/Chat.js";




import AsyncLoad from '@classes/AsyncLoad';
import { Detection } from '@classes/Detection';

import each from 'lodash/each';
import map from 'lodash/map';

import { mapEach } from '@utils/dom';

export default class Page extends EventEmitter {
  constructor({ classes, element, elements }) {
    super();
    // console.log('Page constructor called'); // ← Check this
    AutoBind(this);

    this.class = classes
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

    };



    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';


    this.transformPrefix = Prefix('transform');

    this._createLenis();
  }


  _createLenis() {
    // Initialize Lenis for smooth scrolling
    this.lenis = new Lenis({
      lerp: 0.1,       // smoothness

    });

    // Drive Lenis updates
    const raf = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Optional: prevent GSAP lag smoothing
    GSAP.ticker.lagSmoothing(0);
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
        // Already an element or array → convert NodeList to array if needed
        this.elements[key] = entry instanceof NodeList ? Array.from(entry) : entry;
      } else {
        // Query selector(s) → always convert to array
        const nodeList = document.querySelectorAll(entry);
        this.elements[key] = Array.from(nodeList); // empty array if nothing found
      }
    });

    document.addEventListener('DOMContentLoaded', (event) => {
      this.createAnimations();
    })

  }

  createAnimations() {

    // Scale animations
    this.animationScale = map(this.elements.animationScale, (element) => {
      return new Scale({ element });
    });


    // Navigation animations
    this.animationsNavigation = mapEach(this.elements.animationNavigation, (element) => {
      return new Navigation({ element });
    });

    // Reviews slider
    this.animationsSlider = mapEach(this.elements.animationSlider, (element) => {
      return new Slider({ element });

    });

    // Parallax
    this.animationsParallax = mapEach(this.elements.animationParallax, (element) => {
      return new Parallax({ element });

    });

    this.animationsPinLayer = mapEach(this.elements.animationPinLayer, (element) => {

      return new PinLayer({ element });
    });

    // Text highlight
    // this.animationsTextHighlight = mapEach(this.elements.animationTextHighlight, (element) => {
    //   return new TextHighlight({
    //     tagline: element
    //   });
    // });

    // FAQ accordion
    this.animationsFAQ = mapEach(this.elements.animationFAQ, (element) => {
      return new FAQAccordion({
        selector: element
      });
    });

    this.animationsMarquee = mapEach(this.elements.animationMarquee, (element) => {
      const marquee = new Marquee({ element });
      return marquee;
    });

    this.animationsChat = mapEach(this.elements.animationChat, (element) => {
      const chat = new Chat({ element });
      return chat;
    });


    // Carousel
    this.animationsCarousel = mapEach(this.elements.animationCarousel, (element) => {
      return new Carousel({
        buttons: {
          next: '.btn__next',
          prev: '.btn__prev'
        },
        slider: '.slider__image'
      });
    });
  }

  show(_url) {

    this.lenis.scrollTo(0, { offset: 0, immediate: true });


    this.addEventListeners();
    return Promise.resolve();
  }


  hide(_url) {
    this.isVisible = false;
    // console.log(this.isVisible);


    this.removeEventListeners();

    return Promise.resolve();
  }

  addEventListeners() { }

  removeEventListeners() { }
}
