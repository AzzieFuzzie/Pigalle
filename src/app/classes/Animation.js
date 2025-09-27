import AutoBind from 'auto-bind';
import Prefix from 'prefix';
import Component from '../classes/Component';

export default class Animation extends Component {
  constructor({ element, elements }) {
    super({ element, elements })
    AutoBind(this);

    const { animationDelay, animationTarget } = element.dataset;

    this.delay = animationDelay;

    this.element = element;
    this.elements = elements;

    this.target = animationTarget ? element.closest(animationTarget) : element;
    this.transformPrefix = Prefix('transform');

    this.isVisible = false;
    this.hasAnimated = false;
    if ('IntersectionObserver' in window) {
      this.createObserver();
      console.log('animateOut');
      this.animateOut();
    } else {
      this.animateIn();
      console.log('animateIn');
    }
  }

  createObserver() {
    if (!this.target) return;
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated) {
            console.log('animateIn');
            this.animateIn();
            this.hasAnimated = true;
            this.observer.unobserve(this.target); // stop observing after first animation
          }
        });
      },
      { threshold: 0 } // trigger as soon as any pixel is visible
    );

    this.observer.observe(this.target);
  }



  animateIn() {
    console.log('animateIn');
    this.isVisible = true;
  }

  animateOut() {
    console.log('animateIn');
    this.isVisible = false;
  }
}