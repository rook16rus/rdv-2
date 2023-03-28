import { EffectFade, Navigation, Pagination, Scrollbar, Swiper } from 'swiper'
import window from 'inputmask/lib/global/window'

export default function slider() {
  const containers = document.querySelectorAll('.js-init-slider')

  containers.forEach((container) => {
    if (container.classList.contains('js-init-slider--mobile')) {
      if (container.classList.contains('--799') && window.matchMedia('screen and (max-width: 799px)').matches) {
        init()
      } else if (window.matchMedia('screen and (max-width: 669px)').matches) {
        init()
      } else {
        container.querySelector('.swiper').classList.remove('loading')
      }
    } else {
      init()
    }

    function init() {
      if (window.rdv.isAdmin) {
        container.querySelector('.swiper').classList.add('not-initialized')
        container.querySelector('.swiper').classList.remove('loading')
      } else {
        const slides = container.querySelectorAll('.swiper-slide')
        if (slides.length > 1) {
          new Swiper(container.querySelector('.swiper'), {
            modules: [Navigation, Pagination],
            speed: 400,
            slidesPerView: 1,
            spaceBetween: 20,
            on: {
              init: function (swiper) {
                swiper.el.classList.remove('loading')
              },
            },
            navigation: {
              nextEl: container.querySelector('.next'),
              prevEl: container.querySelector('.prev'),
              disabledClass: 'disabled',
            },
            pagination: {
              el: container.querySelector('.js-pagination'),
              bulletClass: 'bullet',
              bulletActiveClass: 'active',
              clickable: true,
            },
            breakpoints: {
              670: {
                slidesPerView: 2,
              },
              1100: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            },
          })
        } else {
          container.querySelector('.swiper').classList.remove('loading')
        }
      }
    }
  })
}
