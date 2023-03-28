import Axios from 'axios'
import tingle from 'tingle.js/src/tingle'
import { Form } from '../form/form'
import YoutubeVideo from '../youtube-video/youtube-video'

const getVue = () => import(/* webpackChunkName: "vue" */ 'vue')

function isSelectorValid(selector) {
  try {
    document.createDocumentFragment().querySelector(selector)
  } catch {
    return false
  }
  return true
}

class ModalModern {
  constructor(el, selector, params = {}) {
    this.root = el
    this.selector = selector
    const defaultParams = {
      tingle: {
        closeButton: false,
        onOpen: () => {
          if (this.root) this.root.dispatchEvent(new CustomEvent('modal:open'))
        },
        onClose: () => {
          if (this.root) this.root.dispatchEvent(new CustomEvent('modal:close'))
          if (this.modalShadowContainer) this.modalShadowContainer.remove()
          this._onCloseModal()
        },
        // beforeOpen: () => {},
        // beforeClose: () => {},
      },
      preloaderTimeout: 500,
      destroyOnClose: false,
    }

    let elementParams = {}

    if (this.root) elementParams = this.root.getAttribute(this.selector)

    if (!params.legacyModal) {
      if (elementParams) {
        elementParams = JSON.parse(elementParams)
      }
    }

    this.params = { ...defaultParams, ...params, ...elementParams }

    if (this.root) {
      this.template = this.params.href || this.root.getAttribute('href')
    } else {
      this.template = this.params.href
    }

    this.ajax = isSelectorValid(this.template) ? false : true
    this.url = this.ajax ? this.template : ''

    this.modal = null

    this.contentLoaded = false

    this._init()
  }

  _init() {
    if (this.root) {
      this.root.addEventListener('click', this._onOpenModalClick.bind(this))
    }
  }

  _setContent() {
    this.modal = new tingle.modal(this.params.tingle)
    window.modal = this.modal

    if (this.params.shadowDOM) {
      var { shadow, modalShadowContainer } = this._initShadowDOM()
      shadow.append(this.modal.modal)
      this.modalShadowContainer = modalShadowContainer
    }

    if (this.params.shadowDOM) {
      var { shadow, modalShadowContainer } = this._initShadowDOM()
      shadow.append(this.modal.modal)
      this.modalShadowContainer = modalShadowContainer
    }

    if (!this.ajax) {
      let modalContainer = document.querySelector(this.template)
      let template = this.params.template ? this.params.template : modalContainer.innerHTML

      if (this.params.vue) {
        getVue().then((data) => this._initVueModal(data.default, template))
      } else {
        this.modal.setContent(template)
        this.contentLoaded = true
        this._initContent()
      }
    } else {
      let timeout = setTimeout(() => {
        if (this.params.preloader) this.params.preloader()
      }, this.params.preloaderTimeout)

      Axios({
        method: 'GET',
        url: this.url,
      })
        .then((res) => {
          clearTimeout(timeout)

          let template = res.data.template || res.data

          if (this.params.vue) {
            getVue().then((data) => this._initVueModal(data.default, template))
          } else {
            this.modal.setContent(template)
            this.contentLoaded = true
            this._initContent()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  _initVueModal(Vue, template) {
    let modal = Vue.compile(template),
      components = this.params.vueComponents || {}

    let modalCtx = this
    let mountContainer = this.modal.getContent().appendChild(document.createElement('div'))

    new Vue({
      render: modal.render,
      staticRenderFns: modal.staticRenderFns,
      components: components,
      data() {
        return {
          modalData: modalCtx.params.vueData,
          window,
        }
      },
      methods: {
        closeModal() {
          modalCtx.modal.close()
        },
        scrollAnchors(hash) {
          setTimeout(window.scrollAnchors(hash), 0)
        },
      },
      mounted() {
        modalCtx.modal.open()
        modalCtx.contentLoaded = true
        this.$nextTick(() => modalCtx._initContent())
      },
    }).$mount(mountContainer)
  }

  _initContent() {
    let content = this.modal.getContent()
    let closeButtons = [...content.querySelectorAll(`[data-modal-modern-close]`)]
    closeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.modal.close()
      })
    })
    this._initForms()
    this._initInsideModals()
    this._initYoutube()
    if (this.params.onInit) this.params.onInit()
  }

  _initYoutube() {
    let modal = this.root
    let selector = 'data-youtube'
    let el = this.modal.getContent().querySelector(`[${selector}]`)
    if (el) {
      const youtubeUrl = modal.getAttribute(`${this.selector}-youtube`)
      if (youtubeUrl) el.setAttribute(selector, youtubeUrl)
      new YoutubeVideo(el, selector, modal)
    }
  }

  _initForms() {
    let modal = this.modal
    let selector = 'data-form-modern',
      forms = [...this.modal.getContent().querySelectorAll(`[${selector}]`)]

    if (forms.length) {
      forms.forEach((form) => {
        new Form(form, selector, {
          ...{ analyticsGoal: this.params.analyticsGoal },
          ...(this.params.formParams && JSON.parse(this.params.formParams)),
        })

        if (this.params.shadowDOM) {
          let inputs = form.querySelectorAll('[data-input]')
          inputs.forEach((input) => {
            input.addEventListener('change', (e) => {
              if (input.value.length) $(input).valid()
            })
          })
        }
      })
    }
  }

  _initInsideModals() {
    let selector = 'data-modal',
      btns = [...this.modal.getContent().querySelectorAll(`[${selector}]`)]

    if (btns.length) {
      btns.forEach((btn) => {
        new Modal(btn, selector)
      })
    }
  }

  _onOpenModalClick(e) {
    e.preventDefault()
    this.openModal()
  }

  openModal() {
    this.opened = true

    if (!this.contentLoaded) {
      this._setContent()
    }
    this.modal.open()

    if (this.params.useUrlHash && this.root) {
      if (window.location.hash !== this.root.dataset.form) history.pushState('', document.title, '#' + this.root.dataset.form)
    }
  }

  closeModal() {
    this.opened = false
    this.modal.close()
  }

  _onCloseModal(e) {
    this.opened = false

    if (this.params.destroyOnClose) {
      if (this.modal) this.modal.setContent('')
      this.contentLoaded = false
    }

    if (this.params.useUrlHash) {
      history.pushState('', document.title, window.location.pathname + window.location.search)
    }
  }

  _initShadowDOM() {
    const modalShadowContainer = document.createElement('div'),
      shadow = modalShadowContainer.attachShadow({ mode: 'open' }),
      linkElem = document.createElement('link')

    modalShadowContainer.classList.add('modal-shadow-container')
    linkElem.setAttribute('rel', 'stylesheet')
    const assetsPath = document.body.dataset.assetsPath || 'assets/'
    linkElem.setAttribute('href', `${assetsPath}include/assets/styles/main.css?v=${Date.now()}`)

    shadow.appendChild(linkElem)
    document.body.appendChild(modalShadowContainer)

    return {
      shadow,
      modalShadowContainer,
    }
  }
}

class ModalModernFactory {
  constructor(props) {
    this.modules = []
    ;[...document.querySelectorAll(`[${props.selector}]`)].forEach((el) => {
      this.modules.push(new ModalModern(el, props.selector, props.params))
    })

    if (props.params && props.params.setHash) {
      let firstModule = this.modules.find((module) => window.location.hash === '#' + module.root.dataset.form)
      if (firstModule) firstModule.openModal()
    }
  }
}

export { ModalModern, ModalModernFactory }
