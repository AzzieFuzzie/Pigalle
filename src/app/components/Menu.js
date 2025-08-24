export default class Menu {
  constructor({ menuWrapperSelector, categoryButtonsSelector }) {
    this.menuWrapper = document.querySelector(menuWrapperSelector);
    this.categoryButtons = document.querySelectorAll(categoryButtonsSelector);
    this.sections = this.menuWrapper.querySelectorAll('.menu__section');

    if (!this.menuWrapper || this.sections.length === 0) return;

    this._init();
  }

  _init() {
    // Set the first category as visible
    this.sections.forEach((section, index) => {
      section.style.display = index === 0 ? 'block' : 'none';
    });

    this.categoryButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this._switchCategory(e));
    });
  }

  _switchCategory(e) {
    const targetCategory = e.currentTarget.dataset.category; // assign data-category="seafood" etc
    if (!targetCategory) return;

    // Hide all sections
    this.sections.forEach(section => {
      section.style.display = section.classList.contains(`menu__${targetCategory}`) ? 'block' : 'none';
    });

    // Update URL without reload
    history.pushState(null, '', `/${targetCategory}`);
  }
}
