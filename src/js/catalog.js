import moreButtonRow from "./moreButtonRow";

export default function catalog() {
  const catalog = document.querySelector('.catalog');
  if (!catalog) return

  const tags = catalog.querySelectorAll('.catalog__tag-radio');
  let inputsValues = [];

  tags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      if (tag.classList.contains('active')) {
        tag.checked = false;
        tag.classList.remove('active');
      } else {
        tags.forEach(tag => tag.classList.remove('active'));
        tag.checked = true;
        tag.classList.add('active');
      }

      showOrHideResetButton();
    })
  })

  const search = catalog.querySelector('.catalog__search');
  const searchInput = catalog.querySelector('.catalog__search-input');
  const searchReset = catalog.querySelector('.catalog__search-reset');

  document.addEventListener('mousedown', e => {
    if (e.target.closest(".catalog__search-button") || e.target.closest(".catalog__search-input-block")) {
      search.classList.add('active');
    } else {
      if (searchInput.value === '') search.classList.remove('active')
    }
  })

  searchReset.addEventListener('click', () => {
    searchInput.value = '';
  })

  const gridButtons = catalog.querySelector('.catalog__grid-buttons');
  gridButtons.addEventListener('click', e => {
    if (e.target.closest('.catalog__grid-button')) {
      const catalogList = catalog.querySelector('.catalog__list');
      const catalogCards = catalog.querySelectorAll('.catalog-card');
      const button = e.target.closest('.catalog__grid-button');
      const modification = button.dataset.modification;
      const cardModification = button.dataset.modificationCards;

      catalogList.className = `catalog__list ${modification}`;
      catalogCards.forEach(card => card.className = `catalog-card ${cardModification}`)

      catalog.querySelectorAll('.catalog__grid-button')
        .forEach(button => button.classList.remove('active'))
      button.classList.add('active');

      moreButtonRow();
    }
  })

  const countsDisplays = catalog.querySelectorAll('.catalog__tag-label');

  countsDisplays.forEach(countDisplay => {
    const subTagsContainer = catalog.querySelector(`*[data-id="${countDisplay.dataset.href}"]`);
    if (!subTagsContainer) return

    const subTags = subTagsContainer.querySelectorAll('.catalog__subtag-radio');
    const resetButton = subTagsContainer.querySelector('.catalog__filter-reset');

    let subtagsCount = countDisplay.dataset.count;

    checkCount(subtagsCount, countDisplay, resetButton);

    subTags.forEach(subtag => {
      subtag.addEventListener('change', () => {
        subtagsCount = [...subTags].filter(tag => tag.checked).length;
        countDisplay.dataset.count = subtagsCount;

        checkCount(subtagsCount, countDisplay, resetButton);
        showOrHideResetButton()
      })
    })
  })

  const dateButton = catalog.querySelector('.catalog__date-button');
  const monthCheckBoxes = catalog.querySelectorAll('.catalog__month-checkbox');

  let count = [...monthCheckBoxes].filter(checkbox => checkbox.checked).length;

  monthCheckBoxes.forEach(checkbox => {
    const container = checkbox.closest(".catalog__date-content");
    const resetButton = container.querySelector('.catalog__filter-reset');

    checkCount(count, dateButton, resetButton);

    checkbox.addEventListener('change', () => {
      count = [...monthCheckBoxes].filter(checkbox => checkbox.checked).length;

      checkCount(count, dateButton, resetButton);
      showOrHideResetButton();
    })
  })

  function checkCount(count, display, resetButton, buttonClicked) {
    if (count > 0) {
      //if (!buttonClicked) resetButton.classList.add('active');
      display.classList.add('count-active');
    } else {
      display.classList.remove('count-active')
      //resetButton.classList.remove('active');
    }
  }

  const resetButtons = catalog.querySelectorAll('.catalog__filter-reset');

  resetButtons.forEach(button => {
    const container = catalog.querySelector(`*[data-reset-id="${button.dataset.container}"]`);
    const countContainer = button.closest('.catalog__filter-bottom-content');
    const countButton = catalog.querySelector(`*[data-href="${countContainer.dataset.id}"]`);

    button.addEventListener('click', () => {
      const inputs = container.querySelectorAll('input[type="checkbox"]');
      inputs.forEach(input => input.checked = false);

      let count = 0;

      if (button.closest('.catalog__date')) {
        count = Array.from(catalog.querySelectorAll('.catalog__month-checkbox')).filter(checkbox => checkbox.checked).length;
      } else {
        count = [...inputs].filter(input => input.checked).length;
      }

      button.classList.remove('active');
      checkCount(count, countButton, button, true);

      showOrHideResetButton();
    })
  })

  const resetButton = catalog.querySelector(".catalog__reset-button");
  const catalogForm = catalog.querySelector('.catalog__filter');
  inputsValues = [...catalogForm.elements].map(el => el.checked)

  resetButton.addEventListener('click', () => {
    countsDisplays.forEach(tag => {
      tag.classList.remove('count-active');
      tag.classList.remove('tab-active');
    })

    tags.forEach(tag => {
      tag.checked = false;
      tag.classList.remove('active');
    })

    dateButton.classList.remove('tab-active');
    dateButton.classList.remove('count-active');

    resetButtons.forEach(button => button.classList.remove('active'));

    const filterBottoms = catalog.querySelectorAll('.catalog__filter-bottom-content');

    filterBottoms.forEach(container => container.classList.remove('active'));

    resetButton.classList.remove('active')
  })

  showOrHideResetButton();

  function showOrHideResetButton() {
    if (isFormChanged(catalogForm)) {
      resetButton.classList.add('active')
    } else {
      resetButton.classList.remove('active')
    }
  }

  function isFormChanged(form) {
    for (let i = 0; i < form.elements.length; i++) {
      if(form.elements[i].checked !== inputsValues[i]) {
        return true
      }
    }

    return false;
  }
}
