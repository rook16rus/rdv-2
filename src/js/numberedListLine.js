export default function numberedListLine() {
  const containers = [...document.querySelectorAll('.js-numbered-list-line')];
  containers.forEach(container => {
    const line = container.querySelector('.simple-numbered-list__line');
    const list = container.querySelector('.simple-numbered-list__list');
    const items = container.querySelectorAll('.simple-numbered-list__item');

    const lineHeight = `${list.offsetHeight - items[items.length - 1].offsetHeight}px`;
    line.style.height = lineHeight;
  })
}