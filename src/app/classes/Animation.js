import AutoBind from 'auto-bind';
// import Prefix from 'prefix';
// Make sure this extends Component again
import Component from '../classes/Component';

export default class Animation extends Component { // <-- Add 'extends Component'
  constructor({ element, elements }) {
    super({ element, elements }); // <-- Add super()
    AutoBind(this);

    const { animationDelay, animationTarget } = element.dataset;

    this.delay = animationDelay;
    this.element = element;
    this.elements = elements;

    this.target = animationTarget ? element.closest(animationTarget) : element;


    this.isVisible = false;

    this.createObserver();


  }

  createObserver() {
    const options = {
      rootMargin: '0px',
      threshold: 0.1,
    }

    // 1. Check for a valid target
    if (!this.target) {
      console.error('Animation target not found for element:', this.element);
      return;
    }

    this.observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        // 3. Use the simple, correct logic
        if (entry.isIntersecting) {
          this.animateIn();
          console.log('in view');
        } else {
          this.animateOut();
          console.log('not in view');
        }
      });
    }, options);


    this.observer.observe(this.target);
  }

  animateIn() {
    this.isVisible = true;
  }

  animateOut() {
    this.isVisible = false;
  }
}