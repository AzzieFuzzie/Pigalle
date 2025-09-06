import Animation from '../classes/Animation'
import GSAP from 'gsap'

export default class Chat extends Animation {
  constructor({ element }) {
    super({ element })

    this.element = element
    this.wrapper = this.element.querySelector('.whatsapp__wrapper')
    this.icon = this.wrapper.querySelector('.whatsapp__icon')
    this.text = this.wrapper.querySelector('.whatsaap__text')
    console.log(this.text);
    requestAnimationFrame(() => {
      this._setInitial()
      this._hover()
    })
  }

  _setInitial() {
    const iconWidth = this.icon.getBoundingClientRect().width
    console.log(iconWidth);
    const textWidth = this.text.getBoundingClientRect().width
    console.log(textWidth);
    this.collapsedWidth = iconWidth
    this.expandedWidth = textWidth
    console.log(this.collapsedWidth);
    console.log(this.expandedWidth);
    GSAP.set(this.text, {
      width: 0,
      borderRadius: 20,
      gap: 0
    })
    GSAP.set(this.wrapper, { gap: 0 })
  }

  _animateIn() {
    GSAP.to(this.text, {
      width: this.expandedWidth,
      gap: 20,
      duration: 0.4,
      ease: 'circ.Out'
    })
    GSAP.to(this.wrapper, { gap: 8, duration: 0.4, ease: 'circ.Out' }) // spacing appears
    console.log(this.element.getBoundingClientRect().width);
  }

  _animateOut() {
    GSAP.to(this.text, {
      width: 0,
      gap: 0,
      duration: 0.4,
      ease: 'circ.Out'
    })
    GSAP.to(this.wrapper, { gap: 0, duration: 0.4, ease: 'circ.Out' }) // remove spacing  }
  }

  _hover() {
    this.element.addEventListener('mouseenter', () => this._animateIn())
    this.element.addEventListener('mouseleave', () => this._animateOut())
  }
}
