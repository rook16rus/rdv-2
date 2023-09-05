import Fancybox from '@fancyapps/ui'
import Vue from 'vue'
import calculator from '../vue/calculator/calculator.vue'

import newCalculator from './calculator'

import './old/cookie1.js'
import './old/cookie2.js'

import lazyIMages from "./lazyIMages";
import './lazyload';


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
import bonusButton from "./bonusButton";
import customSelects from "./customSelects";
import copyKey from "./copyKey";
import header from "%src%/js/header";
import resetButtons from "%src%/js/resetButtons";
import initModal from "%src%/js/initModal";
import validation2 from "%src%/js/validation-2";
import inputPlaceholder from "%src%/js/inputPlaceholder";
import simpleBar from "%src%/js/simpleBar";
import tabs2 from "%src%/js/tabs-2";
import noDigits from "%src%/js/noDigits";
import catalog from "%src%/js/catalog";
import catalogAdaptive from "%src%/js/catalogAdaptive";
import catalogModal from "%src%/js/catalogModal";
import moreButtonRow from "%src%/js/moreButtonRow";
import moreButton from "%src%/js/moreButton";
import customSelects2 from "%src%/js/customSelects2";
import contentSlider from "%src%/js/contentSlider";
import speakersSlider from "%src%/js/speakersSlider";
import copyLink from "%src%/js/copyLink";

document.addEventListener('DOMContentLoaded', function () {
  window.rdv = {
    info: 'Функции для вызова на беке',
    isAdmin: document.body.classList.contains('is-admin'),
    tabs: {},
    swipers: []
  }


  // В проекте сохранился легаси код, связанный со старым калькулятором на Vue.js
  // src/scss/old
  // src/js/old
  // src/vue
  legacy()

  lazyIMages();
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
  initServicesAccordions();
  bonusButton();
  header();
  resetButtons();
  initModal();
  validation2();
  inputPlaceholder();
  simpleBar();
  tabs2();
  noDigits();
  customSelects();
  customSelects2();
  catalog();
  catalogAdaptive();
  catalogModal();
  moreButtonRow();
  moreButton();
  contentSlider();
  speakersSlider();
  copyLink();

  initCalculator()
  newCalculator()

  setHeaderHeight()
  fixedHeader()
  copyKey();

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

function initServicesAccordions() {
  const containers = document.querySelectorAll('.additional-services');
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
