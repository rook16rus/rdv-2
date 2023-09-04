export default function moreButtonRow() {
  const containers = document.querySelectorAll('.js-more-button-row-container');

  containers.forEach(container => {
    if (!matchMedia('(max-width: 1024px)').matches && container.dataset.tablet) return;

    const button = container.querySelector('.js-more-button-row');
    const surplus = [];

    let items = container.querySelectorAll('.js-more-button-row-item');
    items = Array.from(items).filter(item => item.closest('.js-more-button-row-container').isEqualNode(container));

    items.forEach(item => item.classList.remove('visually-hidden'));
    let count = 1;

    const rowsCount = container.dataset.rowsCount || 2;

    while (container.clientHeight > items[0].clientHeight * rowsCount - items[0].clientHeight / 2) {
      const lastItem = items[items.length - count];

      surplus.push(lastItem);
      lastItem.classList.add('visually-hidden');
      count++;
    }

    if (button) button.classList.remove('visually-hidden');

    if (surplus.length === 0) {
      if (!button) return
      button.classList.add('visually-hidden');
      return;
    }

    if (!button) return

    const buttonSurplusCount = button.querySelector('.js-more-button-row-surplus');
    if (buttonSurplusCount) {
      buttonSurplusCount.textContent = surplus.length.toString();
    }

    button.addEventListener('click', () => {
      surplus.forEach(item => item.classList.remove('visually-hidden'))
      button.classList.add('visually-hidden');
    })

  })
}
