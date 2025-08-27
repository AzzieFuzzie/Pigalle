// import Animation from '../classes/Animation';
import GSAP from 'gsap';

export default class Slider {

  constructor({ element, elements }) {


    this.animateIn()
  }

  animateIn() {

    const slider = {
      $btns: document.querySelectorAll('.reviews__dot'),
      animating: false
    }
    const tl_slider = GSAP.timeline({ paused: true })
      // first_ interaction
      .addLabel("Slide1")
      .to('.reviews__slider .reviews__slide:nth-child(1)', { xPercent: -100, duration: 1.2, scale: .85, ease: 'linear' })
      .from('.reviews__slider .reviews__slide:nth-child(2)', { xPercent: 100, duration: 1.2, scale: .85, ease: 'linear' }, '<')
      .addLabel("Slide2")

      // second interaction
      .to('.reviews__slider .reviews__slide:nth-child(2)', { xPercent: -100, duration: 1.2, scale: .85, ease: 'linear' })
      .from('.reviews__slider .reviews__slide:nth-child(3)', { xPercent: 100, duration: 1.2, scale: .85, ease: 'linear' }, '<')
      .addLabel("Slide3")

      // third interaction
      .to('.reviews__slider .reviews__slide:nth-child(3)', { xPercent: -100, duration: 1.2, scale: .85, ease: 'linear' })
      .from('.reviews__slider .reviews__slide:nth-child(4)', { xPercent: 100, duration: 1.2, scale: .85, ease: 'linear' }, '<')
      .addLabel("Slide4")

      .to('.reviews__slider .reviews__slide:nth-child(4)', { xPercent: -100, duration: 1.2, scale: .85, ease: 'linear' })
      .from('.reviews__slider .reviews__slide:nth-child(5)', { xPercent: 100, duration: 1.2, scale: .85, ease: 'linear' }, '<')
      .addLabel("Slide5")

    slider.$btns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        if (slider.animating) return
        slider.animating = true
        btn.classList.add('active')
        tl_slider.tweenTo(`Slide${index + 1}`, { duration: 2, ease: 'expo.inOut', onComplete: () => slider.animating = false })
      })
    })
  }

  animateOut() {

  }

} 