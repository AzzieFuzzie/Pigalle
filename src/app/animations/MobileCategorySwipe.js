import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

export default class MobileCategorySwipe {
  constructor({ element }) {
    if (!element) throw new Error("MobileCategorySwipe requires a DOM element.");

    this.el = element;
    this.wrapper = this.el.querySelector(".menu__category__wrapper");
    if (!this.wrapper) throw new Error("MobileCategorySwipe requires a wrapper inside .menu__category");

    this.items = Array.from(this.wrapper.children);
    this.mm = gsap.matchMedia();

    this.mm.add("(max-width: 768px)", () => {
      this._initDrag();
      this._initClickSnap();
      return () => this._destroyDrag();
    });
  }

  _initDrag() {
    if (this.draggable) return;

    const container = this.wrapper.parentNode;
    const containerWidth = container.offsetWidth;
    const totalWidth = this.wrapper.scrollWidth; // <-- correct full width including gaps

    gsap.set(this.wrapper, { x: 0 });

    this.draggable = Draggable.create(this.wrapper, {
      type: "x",
      edgeResistance: 0.7,    // Higher = feels “tighter” at edges
      inertia: true,
      bounds: { minX: Math.min(containerWidth - totalWidth, 0), maxX: 0 },
      dragResistance: .3,    // Lower = less resistance while dragging
    });

  }


  _initClickSnap() {
    this.items.forEach(item => {
      item.addEventListener("click", () => {
        const containerWidth = this.wrapper.parentNode.offsetWidth;
        const minX = containerWidth - this.wrapper.scrollWidth;
        let targetX = -item.offsetLeft;

        if (targetX > 0) targetX = 0;
        if (targetX < minX) targetX = minX;

        gsap.to(this.wrapper, { x: targetX, duration: 0.2, ease: "power3.inOut" });
      })
    });
  }

  _destroyDrag() {
    if (this.draggable) {
      this.draggable.forEach(d => d.kill());
      this.draggable = null;
      gsap.set(this.wrapper, { x: 0 });
    }
  }
}
