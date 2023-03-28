import Fancybox from '@fancyapps/ui'
import Vue from 'vue'
import calculator from '../vue/calculator/calculator.vue'

import newCalculator from './calculator'

import './old/cookie1.js'
import './old/cookie2.js'

import forms from './forms'
import lockForm from './lockForm'
import masks from './masks'
import modals from './modals'
import phoneCodes from './phoneCodes'
import validation from './validation'
import showHide from './showHide'
import videoSlider from './videoSlider'
import tabs from './tabs'
import gallery from './gallery'
import sticky from './sticky'
import numberedListLine from './numberedListLine'
import Accordions from './Accordions'
import legacy from './old/legacy'

import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import slider from '%src%/js/slider'
import infinitySlider from '%src%/js/marquee-slider'
import smoothScroll from '%src%/js/smoothScroll'
import reviewsSlider from '%src%/js/reviewsSlider'

document.addEventListener('DOMContentLoaded', function () {
  window.rdv = {
    info: 'Функции для вызова на беке',
    isAdmin: document.body.classList.contains('is-admin'),
  }

  // В проекте сохранился легаси код, связанный со старым калькулятором на Vue.js
  // src/scss/old
  // src/js/old
  // src/vue
  legacy()

  masks()
  validation()

  forms()
  lockForm()
  phoneCodes()
  modals()
  showHide()
  videoSlider()
  tabs()
  gallery()
  sticky()
  numberedListLine()
  initFaqAccordions()

  initCalculator()
  newCalculator()

  setHeaderHeight()
  fixedHeader()

  slider()

  infinitySlider()
  smoothScroll()

  reviewsSlider()

  const btnTop = document.querySelector('.top_button')

  if (btnTop) {
    btnTop.addEventListener('click', () => {
      btnTop.style.display = 'none'
      gsap.to(window, {
        duration: 0.7,
        ease: 'power2.out',
        scrollTo: {
          y: document.body,
          autoKill: false,
          offsetY: 0,
        },
      })
    })
  }

  window.addEventListener('scroll', check, { passive: true })

  function check() {
    if (window.scrollY > 500) {
      btnTop.style.display = 'block'
    } else {
      btnTop.style.display = 'none'
    }
  }

  check()
})

function initCalculator() {
  let element = document.querySelector('[data-calculator]')
  if (element) {
    window.calculatorApp = new Vue({
      el: element,
      components: {
        calculator: calculator,
      },
    })
  }
}

function initFaqAccordions() {
  const containers = document.querySelectorAll('.faq')
  containers.forEach((container) => {
    new Accordions({
      selectors: {
        container: container,
        wrapper: '.js-accordion',
        button: '.js-accordion-btn',
        content: '.js-accordion-content',
      },
    })
  })
}

function setHeaderHeight() {
  const header = document.querySelector('.header')
  if (header) {
    document.documentElement.style.setProperty('--js-header-height', header.clientHeight + 'px')
  }
}

function fixedHeader() {
  const header = document.querySelector('.header')
  if (header) {
    const toggleY = header.dataset.toggle || 300
    let fixed = false

    window.addEventListener('scroll', check, { passive: true })

    function check() {
      if (!fixed && window.scrollY >= toggleY) {
        fixed = true
        header.classList.add('fixed')
      } else if (window.scrollY < toggleY) {
        fixed = false
        header.classList.remove('fixed')
      }
    }

    check()
  }
}
