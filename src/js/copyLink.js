export default function copyLink() {
  const containers = document.querySelectorAll('.js-copy-link')

  containers.forEach(container => {
    const input = container.querySelector('.js-copy-link-input');
    const button = container.querySelector('.js-copy-link-button');

    input.value = location.protocol + '//' + location.host + location.pathname;

    button.addEventListener('click', () => {
      navigator.clipboard.writeText(input.value);
    })
  })
}
