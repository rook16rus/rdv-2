import {EffectFade, Navigation, Pagination, Swiper} from "swiper";
import window from "inputmask/lib/global/window";

export default function gallery() {
  const containers = document.querySelectorAll('.js-gallery');
  containers.forEach(container => {
    if (!(container.classList.contains('js-disable-if-admin') && window.rdv.isAdmin)) {
      if ([...container.querySelectorAll('.swiper-slide')].length > 1) {
        if (container.classList.contains('js-gallery-only-desktop')) {
          if (window.matchMedia('screen and (min-width: 670px)').matches) {
            init(container)
          } else {
            reset(container)
          }
        } else {
          init(container)
        }
      } else {
        reset(container)
      }
    } else {
      reset(container)
    }
  })

  function reset(container) {
    container.classList.add('not-initialized')
    container.classList.remove('loading');
    container.querySelector('.navigation').remove();
    container.querySelector('.pagination').remove();
  }

  function init(container) {
    new Swiper(container, {
      loop: false,
      speed: 500,
      slidesPerView: 1,
      spaceBetween: 0,
      autoHeight: false,
      modules: [Navigation, Pagination, EffectFade],
      navigation: {
        nextEl: container.querySelector('.next'),
        prevEl: container.querySelector('.prev'),
        disabledClass: "disabled"
      },
      pagination: {
        el: container.querySelector('.pagination'),
        type: 'bullets',
        clickable: true,
        renderBullet: function (index, className) {
          return `<button class="${className}" type="button" title="Скриншот №${++index}"></button>`
        },
        bulletClass: "pagination__item",
        bulletActiveClass: "active"
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      on: {
        init: function (swiper) {
          swiper.el.classList.remove("loading")
        },
      },
    });
  }
}