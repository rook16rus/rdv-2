import HystModal from './libs/hystmodal.min'
;('./libs/hystmodal.min.js')

export default function modals() {
  const instance = new HystModal({
    linkAttributeName: 'data-modal',
    beforeOpen: function (modal) {
      if (window.rdv.calcModals) {
        window.rdv.calcModals.close()
      }

      if (modal.starter.classList.contains('js-calculator-data')) {
        const resultInput = modal.openedWindow.querySelector('.js-result-input')
        if (resultInput) {
          resultInput.value = modal.starter.dataset.calculatorData
        }
      }
    },
    afterClose: function (modal) {
      if (window.rdv.calcModals) {
        window.rdv.calcModals.close()
      }
      const form = modal.openedWindow.querySelector('form')
      if (form) {
        form.reset()
        const inputs = form.querySelectorAll('.input')
        inputs.forEach((input) => {
          input.classList.remove('is-changed')
        })
      }

      if (modal.starter.classList.contains('js-calculator-data')) {
        const resultInput = modal.openedWindow.querySelector('.js-result-input')
        if (resultInput) {
          resultInput.value = ''
        }
      }
    },
  })

  window.rdv.modals = instance
}
