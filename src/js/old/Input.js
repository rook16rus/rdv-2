import intlTelInput from 'intl-tel-input'
import IMask from 'imask'

// {
// 	"code": "kz",
// 	"pattern": "+{code} (700) 000 00 00",
// 	"name": "Казахстан",
// 	"flag": "img/flags/kz.svg",
// 	"isInitial": false
// }

class Input {
  constructor(el, selector, data) {
    if (!el) return false

    this.root = el
    this.type = this.root.dataset.type || this.root.type
    if (this.root.classList.contains(`${selector}-inited`)) return false
    this.root.classList.add(`${selector}-inited`, true)
    this.data = data
    this.patterns = data.reduce((acc, item) => ({ ...acc, [item.code]: item.pattern }), {})
    this.initialItem = data.find((item) => item.isInitial)
    this.codes = data.map((item) => item.code)
    this.names = data.reduce((acc, item) => ({ ...acc, [item.code]: item.name }), {})

    this._matchHTML(selector)
    this.init()

    this.root.inputModule = this
  }

  _matchHTML(selector) {
    this.infoTooltip = this.root.parentNode.querySelector('.info')
  }

  init() {
    this._initMasks()
    // this._initTextAreaAutoheight();
    this._addListeners()
    this._initPlaceholder()
    this._checkChange()
    this._initInfoTooltip()
  }

  _addListeners() {
    this.root.addEventListener('focus', (e) => {
      this.root.parentNode.classList.add('is-focused')
    })

    this.root.addEventListener('blur', (e) => {
      this.root.parentNode.classList.remove('is-focused')
      this._checkChange()
    })

    this.root.addEventListener('input', (e) => {
      this._checkChange()
    })
  }

  _initPlaceholder() {
    if (this.type === 'radio' || this.type === 'checkbox' || this.type === 'tel') return false

    let placeholder = this.root.getAttribute('placeholder')

    if (!placeholder) {
      this.root.nextElementSibling.remove()
      return
    }

    this.root.nextElementSibling.innerHTML = placeholder

    this.root.parentNode.addEventListener('click', (e) => {
      this.root.focus()
    })
  }

  _checkChange() {
    let val = this.root.value

    if (val) {
      this.root.parentNode.classList.add('is-changed')
    } else {
      this.root.parentNode.classList.remove('is-changed')
    }
  }

  _initInfoTooltip() {
    if (this.infoTooltip) {
      this.infoTooltip.addEventListener('click', () => {
        this.infoTooltip.classList.add('is-active')
      })
      document.addEventListener('click', (e) => {
        if (e.target !== this.infoTooltip && !this.infoTooltip.contains(e.target)) {
          this.infoTooltip.classList.remove('is-active')
        }
      })
    }
  }

  _getPhonePattern = (intl = {}) => {
    const iso = intl.iso2
    const code = intl.dialCode.replace(/0/g, '\\0')
    const patterns = this.patterns

    return patterns[iso].replace('{code}', code)
  }

  _initMasks() {
    if (this.type === 'tel') {
      const assetsPath = document.body.dataset.assetsPath || 'assets/'

      const iti = intlTelInput(this.root, {
        dropdownContainer: this.root.closest('.input'),
        utilsScript: `${assetsPath}js/intl-tel-input/utils.js`,
        initialCountry: this.initialItem ? this.initialItem.code : 'ru',
        onlyCountries: this.codes,
        localizedCountries: this.names,
      })

      let countryCode = iti.getSelectedCountryData().dialCode,
        phoneWithoutCode = '',
        phoneMask

      phoneMask = IMask(this.root, {
        mask: this._getPhonePattern(iti.getSelectedCountryData()),
        lazy: false,
      })

      this.root.masked = phoneMask.masked

      this.root.addEventListener('countrychange', (e) => {
        countryCode = iti.getSelectedCountryData().dialCode || ''
        if (phoneMask) {
          this.root.value = ''
          phoneMask.destroy()
          phoneMask = IMask(this.root, {
            mask: this._getPhonePattern(iti.getSelectedCountryData()),
            lazy: false,
          })
          phoneMask.masked.reset()
          this.root.masked = phoneMask.masked
          this.root.dispatchEvent(new Event('input'))
        }
      })

      this.root.addEventListener('open:countrydropdown', () => {
        this.root.closest('.input').classList.add('input--iti-open')
      })

      this.root.addEventListener('close:countrydropdown', () => {
        this.root.closest('.input').classList.remove('input--iti-open')
      })
    }

    if (this.type === 'date') {
      import(/* webpackChunkName: "inputmask" */ 'inputmask').then((Inputmask) => {
        Inputmask.default.extendAliases({
          datetime: {
            inputFormat: 'dd.mm.yyyy',
            placeholder: '_',
            showMaskOnHover: false,
            min: this.root.min,
          },
        })

        Inputmask.default('datetime').mask(this.root)
      })
    }
  }

  // _initTextAreaAutoheight() {
  // 	if (this.type !== 'textarea') return false;
  // 	import(/* webpackChunkName: "autosize" */ 'autosize').then((autosize) => {
  // 		autosize.default(this.root);
  // 	});
  // }

  setValue(value) {
    if (this.type === 'textarea') {
      this.root.innerText = value
    } else if (this.type === 'radio') {
      this.root.checked = this.root.value === value
    } else {
      this.root.value = value
    }

    this.root.dispatchEvent(new Event('input'))
  }

  reset() {
    this.setValue('')
  }
}

class InputFactory {
  constructor(props, data) {
    this.inputs = []
    ;[...document.querySelectorAll(props.selector)].forEach((el) => {
      this.inputs.push(new Input(el, props.selector, data))
    })
  }
}

export { Input, InputFactory }
