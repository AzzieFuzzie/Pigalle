import AutoBind from 'auto-bind';
import EventEmitter from 'events';
import GSAP from 'gsap';
import Prefix from 'prefix';
import Lenis from 'lenis';

// import NavigationAnimation from '@animations/NavigationAnimation';

import AsyncLoad from '@classes/AsyncLoad';
import { Detection } from '@classes/Detection';

import each from 'lodash/each';
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

    };

    this.transformPrefix = Prefix('transform');
    this.create();
    this.smoothScroll();
  }

  smoothScroll() {
    // Initialize Lenis
    this.lenis = new Lenis({
      autoRaf: true,
      lerp: 0.15,
      smoothWheel: true,
    });
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
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });

    this.createAnimations();

    // this.createPreloader();
  }
  createAnimations() {

    // Initialize only once
    // this.navigationAnimation = new NavigationAnimation();

    // Links and paragraphs animations as before
    this.animationsLinks = mapEach(this.elements.animationsLinks, (element) => {
      return new Link({
        element,
      });
    });


    this.animationsParagraphs = mapEach(this.elements.animationsParagraphs, (element) => {
      return new Paragraph({ element });
    });

  }

  show(_url) {
    if (this.lenis) {
      this.lenis.scrollTo(0, {
        offset: 0,
        immediate: true // or false for smooth transition
      });
    }


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
