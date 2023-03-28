import $ from 'jquery'
import validate from 'jquery-validation'
import { Input } from '../input/input'
import { FileUploaderFactory } from '../file-uploader/file-uploader'
import '../preloader/preloader'
import tingle from 'tingle.js/src/tingle'
import { ModalModern } from '../modal-modern/modal-modern'
import { createConfirmPoup } from '../modal-confirm/modal-confirm'
import { createMessagePoup } from '../modal-message/modal-message'
import { createCustomError } from '../custom-error/custom-error'

class Form {
  constructor(el, selector, params) {
    if (!el) return false

    this.form = el
    this.selector = selector

    const defaultParams = {
      method: this.form.method,
      action: this.form.action,
      dataType: this.form.getAttribute('data-type') || 'json',
      inputSelector: 'data-input',
      // countInputSelector: 'data-count-control',
      errorsSelector: 'data-errors',
      errorsContainerSelector: 'data-errors-container',
    }

    this.params = { ...defaultParams, ...params }

    this.emailInputController = null
    this.emailInputPromise = null

    this._init()
  }

  _init() {
    this._matchHTML()
    this._initElements()
    this._initFormValidation()
  }

  _matchHTML() {
    this.inputs = [...this.form.querySelectorAll(`[${this.params.inputSelector}]`)]
    // this.countInputs = [...this.form.querySelectorAll(`[${this.params.countInputSelector}]`)];
    this.inputPhone = this.form.querySelector('[type="tel"]')
    this.errors = this.form.querySelector(`[${this.params.errorsSelector}]`)
    if (this.errors) this.errorsContainer = this.errors.querySelector(`[${this.params.errorsContainerSelector}]`)
  }

  _initFileUploaders() {
    this.fileUploaders = new FileUploaderFactory({ root: 'data-file', wrapper: this.form }).inputs
  }

  // _initCountControls() {
  // if (!this.countInputs.length) return false;

  // this.countInputs.forEach(el => {
  // 	new CountControl(el, this.params.countInputSelector);
  // });
  // }

  _initInputs() {
    if (!this.inputs.length) return false

    this.inputs.forEach((el) => {
      new Input(el, this.params.inputSelector)
    })
  }

  _initRegFormEmail() {
    let event = this.form.elements.eventId,
      userEmail = this.form.querySelector('[data-input-email]'),
      url = userEmail ? userEmail.dataset.inputEmail : false
    if (!event || !userEmail) return false

    userEmail.addEventListener('change', () => {
      let resolve
      let reject
      this.emailInputPromise = new Promise((success, error) => {
        resolve = success
        reject = error
      })
      this.emailInputController = { resolve, reject }
      userEmail.setAttribute('disabled', 'disabled')
      $.ajax({
        url,
        method: 'POST',
        dataType: 'json',
        data: {
          EventId: event.value,
          Email: userEmail.value,
        },
        success: (res) => {
          userEmail.removeAttribute('disabled')
          if (res.errors || res.errorMessages) {
            this._afterAjax(res)
            this.emailInputController.resolve(false)
          } else {
            this.emailInputController.resolve(true)
          }
        },
      })
    })
  }

  // Генерация названия базы из названия компании
  _initCompanyAndBase() {
    let companyName = this.form.querySelector('[data-input-company]')
    let baseName = this.form.querySelector('[data-input-base]')
    let BaseNameChange = false

    if (!companyName || !baseName) return false

    companyName.addEventListener('change', () => {
      if (!BaseNameChange) {
        let textData = companyName.value
        baseName.value = this.rus_to_latin(
          textData
            .toLowerCase()
            .replaceAll(' ', '-')
            .replace(/(-)\1{1,}/g, '$1')
            .replace(/[^a-zа-яё0-9-]/gi, '')
        )
        baseName.dispatchEvent(new Event('input'))
      }
    })

    baseName.addEventListener('change', () => {
      BaseNameChange = true
    })
  }

  rus_to_latin(str) {
    var ru = {
        а: 'a',
        б: 'b',
        в: 'v',
        г: 'g',
        д: 'd',
        е: 'e',
        ё: 'e',
        ж: 'j',
        з: 'z',
        и: 'i',
        к: 'k',
        л: 'l',
        м: 'm',
        н: 'n',
        о: 'o',
        п: 'p',
        р: 'r',
        с: 's',
        т: 't',
        у: 'u',
        ф: 'f',
        х: 'h',
        ц: 'c',
        ч: 'ch',
        ш: 'sh',
        щ: 'shch',
        ы: 'y',
        э: 'e',
        ю: 'u',
        я: 'ya',
      },
      n_str = []

    str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i')

    for (var i = 0; i < str.length; ++i) {
      n_str.push(ru[str[i]] || (ru[str[i].toLowerCase()] == undefined && str[i]) || ru[str[i].toLowerCase()].toUpperCase())
    }

    return n_str.join('')
  }

  _initElements() {
    if (this.errors && this.errorsContainer) {
      this.errors.classList.add('is-hidden')
      this.errorsContainer.innerHTML = ''
    }
    this._initInputs()
    this._initFileUploaders()
    //this._initRegFormEmail();
    this._initCompanyAndBase()

    // this._initCountControls();
  }

  _initFormValidation() {
    $.validator.messages = {
      required: 'Поле обязательно для заполнения',
      email: 'Введите корректный email',
      equalTo: 'Пароли не совпадают',
      accept: 'Некорректно заполнено поле',
    }

    jQuery.validator.addMethod('accept', function (value, element, param) {
      return this.optional(element) || value.match(new RegExp('^' + param /*+ "$"*/))
    })

    jQuery.validator.addMethod('email', function (value, element) {
      return this.optional(element) || /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,100}$/.test(value)
    })

    const rules = {
      company: {
        accept: '^[а-яА-ЯA-Za-z0-9-""«». ]+[^\\s]+',
      },
      name: {
        accept: '^[а-яА-ЯA-Za-z- ]+[^\\s]+',
      },
      email: {
        accept: '([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,100})+',
      },
      base: {
        accept: '(?=.*[a-z])(?!.*(-)+\\1{1})[a-z0-9-]+',
      },
    }

    const messages = {
      company: {
        minlength: 'Введите корректное название компании',
      },
      email: {
        accept: 'Введите корректный email',
      },
    }

    if (this.inputPhone) {
      $.validator.addMethod(
        'tel',
        function (value, element) {
          return this.optional(element) || element.masked?.isComplete
        },
        'Введите корректный номер телефона'
      )
    }

    $.validator.addClassRules('password_equal_to_2', {
      equalTo: '.password_equal_to_1',
    })

    if (this.form.getAttribute(this.selector) !== 'noAjax') {
      this.validator = $(this.form).validate({
        onfocusout: function (element) {
          this.element(element)
        },
        ignore: '.validate-ignore',
        submitHandler: () => {
          if (typeof grecaptcha !== 'undefined') {
            grecaptcha.ready(() => {
              grecaptcha.execute('6LcxTu8bAAAAALhd0aHLQbhX8sB5ZrzCNCz_atBP', { action: 'submit' }).then((token) => {
                this._onFormSubmit(token)
              })
            })
          } else {
            this._onFormSubmit()
          }
        },
        rules,
        messages,
        errorPlacement: function (error, element) {
          const parrentInput = element[0].closest('.input')
          const isEmailInput = element[0].hasAttribute('email-custom-error')
          const errorBlock = parrentInput.querySelector('label.error')
          const customErrorBlock = parrentInput.querySelector('.custom-error')
          errorBlock && errorBlock.remove()
          customErrorBlock && customErrorBlock.remove()

          !isEmailInput && error.insertAfter(element)

          if (isEmailInput) {
            const errorText = element[0].getAttribute('data-error-text')
            const emailError = createCustomError(
              errorText,
              `На данный email уже зарегистрирован активный
							экземпляр системы RDV Маркет. Проверьте ранее
							полученные письма от support@rdv-it.ru или
							напишите нам письмо для восстановления доступа.`
            )

            parrentInput.insertAdjacentHTML('beforeend', emailError)
            element[0].removeAttribute('data-error-text')
            element[0].removeAttribute('email-custom-error')
          }
        },
      })
    } else {
      this.validator = $(this.form).validate({
        onfocusout: function (element) {
          this.element(element)
        },
        ignore: '.validate-ignore',
        rules,
        messages,
      })
    }
  }

  _changeInputsDisabled = () => {
    const inputs = [...this.form.querySelectorAll('input'), ...this.form.querySelectorAll('textarea'), ...this.form.querySelectorAll('select')]
    inputs.forEach((input) => (input.disabled = !input.disabled))
  }

  async _onFormSubmit(token) {
    let emailInputPromiseResult = true
    if (this.emailInputPromise) {
      emailInputPromiseResult = await this.emailInputPromise
    }
    this.emailInputPromise = null
    this.emailInputController = null
    if (!emailInputPromiseResult) return false

    if (this.inputPhone) {
      let countryCode = '',
        countryCodeInput = this.form.querySelector('[name="CountryCode"]')
      if (countryCodeInput) {
        countryCode = window.intlTelInputGlobals?.getInstance(this.inputPhone)?.selectedCountryData.iso2
        countryCodeInput.value = countryCode
      }
    }

    let formData = this.params.method.toLowerCase() === 'get' ? $(this.form).serialize() : new FormData(this.form)

    if (this.params.method !== 'get') {
      if (token) formData.append('g-recaptcha-response', token)
      if (this.params.calculatorForm && window.calculatorApp?.$children[0]?.totalData)
        formData.set('commentary', window.calculatorApp?.$children[0]?.totalData)
    }

    this.fileUploaders.forEach((uploader) => {
      const input = uploader.getInput()
      const fieldName = `${input.name ? input.name : 'FILES[]'}`
      uploader.filesList.forEach((file) => {
        formData.append(fieldName, file)
      })
    })
    this._changeInputsDisabled()
    this.form.classList.add('is-loading')
    $.ajax({
      url: this.params.action,
      data: formData,
      method: this.params.method,
      dataType: this.params.dataType,
      processData: false,
      contentType: false,
      success: (res) => {
        this._afterAjax(res)
      },
      error: (error) => {
        $(this.form).preloader('stop')
        console.log(error)
      },
      complete: (data) => {
        this._changeInputsDisabled()
        this.form.classList.remove('is-loading')
      },
    })
  }

  _afterAjax(res) {
    if (!this.form.hasAttribute('data-unique')) {
      switch (this.params.dataType) {
        case 'json':
          if (res.questionnaire) {
            let isConfirmClose = false
            let actionURL = this.params.action
            const modal = new ModalModern(null, '', {
              href: '#questionnaire',
              legacyModal: true,
              shadowDOM: true,
              vue: true,
              vueData: {
                ...res,
                actionURL,
              },
              // vueComponents: {
              // 	'questionnaire': () => import(/* webpackChunkName: "questionnaire-vue-component" */ '../questionnaire/questionnaire.vue')
              // },
              tingle: {
                beforeClose: () => {
                  if (isConfirmClose) return true
                  const nextStepButton = modal.modalShadowContainer.shadowRoot.querySelector('.button-modern')
                  const isFinalStep = nextStepButton.classList.contains('final-step-button')
                  if (isFinalStep) return true
                  const confirmModal = createConfirmPoup(
                    'Вы уверены?',
                    'Вы уверены, что хотите отменить регистрацию на мероприятие?',
                    () => confirmModal.modalShadowContainer.remove(),
                    () => {
                      isConfirmClose = true
                      confirmModal.modalShadowContainer.remove()
                      modal.closeModal()
                    }
                  )
                  return false
                },
              },
            })
            modal.openModal()
            this.reset()
          }

          if (res.success && res.openModal && res.openModal === 'queueIsFull') {
            createMessagePoup(
              'Извините, у нас очень большая нагрузка на сервис',
              'Наш менеджер с вами свяжется и проконсультирует о дальнейших действиях.'
            )
            this.reset()
            return
          }

          if (res.success) {
            if (res.redirectURL) {
              location.href = res.redirectURL
            }
            let modalSuccess = this.form.querySelector('.modal-success'),
              containerSuccess = this.form.querySelector(`[${this.selector}-success-container]`)

            if (modalSuccess) {
              const modalShadowContainer = document.createElement('div'),
                shadow = modalShadowContainer.attachShadow({ mode: 'open' }),
                linkElem = document.createElement('link')

              modalShadowContainer.classList.add('modal-shadow-container')
              linkElem.setAttribute('rel', 'stylesheet')
              const assetsPath = document.body.dataset.assetsPath || 'assets/'
              linkElem.setAttribute('href', `${assetsPath}include/assets/styles/main.css?v=${Date.now()}`)

              shadow.appendChild(linkElem)
              document.body.appendChild(modalShadowContainer)

              let tingleModalSuccess = new tingle.modal({
                onClose: () => {
                  if (modalShadowContainer) modalShadowContainer.remove()
                },
              })

              shadow.append(tingleModalSuccess.modal)

              tingleModalSuccess.open()
              tingleModalSuccess.setContent(modalSuccess.innerHTML)

              let closeBtn = tingleModalSuccess.modal.querySelector('[data-modal-close]')

              if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                  e.preventDefault()
                  tingleModalSuccess.close()
                })
              }
            }

            if (containerSuccess) {
              let formWrapper = this.form.querySelector(`[${this.selector}-wrapper]`)
              containerSuccess.style.display = 'block'
              if (formWrapper) formWrapper.style.display = 'none'
            }

            this.reset()

            if (this.params.callback) this.params.callback(res)
            if (this.params.analyticsGoal && typeof sendToAnalytics !== 'undefined') sendToAnalytics(this.params.analyticsGoal)
          } else if (res.errors || res.errorMessages) {
            if (res.errorMessages) {
              this.errors.classList.remove('is-hidden')
              setTimeout(() => {
                this.errors.classList.add('is-hidden')
              }, 5000)
            }

            if (res.errors)
              if (res.errors.email) {
                const emailInput = this.form.querySelector('input[type="email"]')
                emailInput.setAttribute('data-error-text', res.errors.email)
                emailInput.setAttribute('email-custom-error', 'true')
              }
            this.validator.showErrors(res.errors)

            if (this.errorsContainer) {
              if (res.errorMessages)
                res.errorMessages.forEach((error) => {
                  let div = document.createElement('div')
                  div.innerHTML = error
                  this.errorsContainer.appendChild(div)
                })

              setTimeout(() => {
                this.errorsContainer.innerHTML = ''
              }, 5000)
            }
          }
          break
        case 'html':
          $(this.form).html(res)
          window.initModals()
          window.initForms()
          if (this.params.callback) this.params.callback(res)
          break
      }
    }
  }

  update() {
    this._init()
  }

  reset() {
    const customErrors = this.form.querySelectorAll('.custom-error')
    customErrors.length && customErrors.forEach((error) => error.remove())
    this.inputs.forEach((input) => {
      input.value = ''
      input.dispatchEvent(new Event('input'))
    })
    this.fileUploaders.forEach((el) => {
      el.clearFilesList()
    })
  }
}

class FormFactory {
  constructor(props) {
    ;[...document.querySelectorAll(`[${props.selector}]:not([${props.selector}-custom]`)].forEach((el) => {
      new Form(el, props.selector, props.params)
    })
  }
}

export { Form, FormFactory }
