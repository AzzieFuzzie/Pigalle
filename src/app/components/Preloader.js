
import GSAP from 'gsap';
import Component from '../classes/Component';
import each from 'lodash/each';

export default class Preloader extends Component {
  constructor() {
    super({
      element: '.preloader',
      elements: {

        number: '.preloader__number',
        images: document.querySelectorAll('img')
      },
    });


    this.length = 0;

    this.createLoader();
  }

  createLoader() {
    each(this.elements.images, image => {
      image.src = image.getAttribute('data-src');

      image.onload = (_) => {
        console.log(image);
        this.onAssetLoaded(image);
      };

    });
  }

  onAssetLoaded(image) {
    this.length++;

    const percent = this.length / this.elements.images.length;
    console.log(percent);
    this.elements.number.innerHTML = `${Math.round(percent * 100)}%`;

    if (percent === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.emit('completed');
      console.log('loaded');

      this.animateOut = GSAP.timeline({
        delay: 1,
      });

      this.animateOut.to(
        this.elements.number,
        {
          duration: 1.5,
          ease: 'expo.out',
          y: '100%',
        },
        '-=1.4'
      );

      this.animateOut.to(this.element, {
        // delay: 2,
        y: '-100%',
        duration: 1.2,      // adjust timing
        ease: 'power2.inOut',
        transformOrigin: '50% 50%', // optional if scaling/rotation is used
      });


      this.animateOut.call((_) => {
        this.destroy();
      });
    });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}