import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export default function showHide() {
  const containers = document.querySelectorAll('.js-show-hide');
  containers.forEach(container => {
    const visibleCount = container.dataset.count || 3;

    const button = container.querySelector('.js-show-hide-button');
    const items = [...container.querySelectorAll('.js-show-hide-item')];

    if (items.length <= visibleCount) {
      button && button.remove()
      return
    }

    if (container.classList.contains('js-show-hide--mobile')) {
      if (window.matchMedia('screen and (max-width: 669px)').matches) {
        init()
      }
    } else {
      init()
    }

    function init() {
      toggle()

      button.addEventListener('click', () => {
        toggle();

        if (button.classList.contains('active')) {
          gsap.to(window, {
            duration: 0.7,
            ease: 'power2.out',
            scrollTo: {
              y: container,
              autoKill: false,
              offsetY: 40
            }
          });
        }

        button.classList.toggle('active');

        if (window.stickyCalc) {
          window.stickyCalc.update();
        }
      })
    }

    function toggle() {
      container.classList.toggle('hidden');
      items[visibleCount - 1] && items[visibleCount - 1].classList.toggle('last')
      items.slice(visibleCount).forEach(item => {
        item.classList.toggle('hidden')
      })
    }
  })
}