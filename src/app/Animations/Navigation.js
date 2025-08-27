
// import Animation from '../classes/Animation';
import GSAP from 'gsap';

export default class Navigation {
  constructor({ element, elements }) {
    this.element = element;
    this.elements = elements;

    this._events();
    this._initScroll();
  }

  animateIn = () => {

    this.element.classList.add('active');
  };

  animateOut = () => {
    this.element.classList.remove('active');
  };

  _events() {
    const openBTN = document.querySelector('.navigation__icon--open');
    const closeBTN = document.querySelector('.navigation__icon--close');
    // const closeBTN = document.querySelector('.navigation__links');

    if (openBTN) {
      openBTN.addEventListener('click', this.animateIn);
    }
    if (closeBTN) {
      closeBTN.addEventListener('click', this.animateOut);
    }
  }


  _initScroll() {
    // Only on desktop
    if (window.innerWidth <= 768) return;
    console.log('sa');
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this._handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
  }

  _handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > this.lastScrollY && currentScroll > 50) {
      // scrolling down → hide
      this.element.classList.add('hidden');
      this.element.classList.remove('visible');
    } else {
      // scrolling up → show
      this.element.classList.add('visible');
      this.element.classList.remove('hidden');
    }

    this.lastScrollY = currentScroll;
  }
}
