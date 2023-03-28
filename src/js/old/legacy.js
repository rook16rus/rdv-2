import { ModalModern } from '../../vue/modal-modern/modal-modern'

export default function legacy() {
  window.initLegacyModals = function () {
    let selector = 'data-form',
      btns = [...document.querySelectorAll(`[${selector}]`)]

    if (btns.length) {
      btns.forEach((btn) => {
        let modalName = btn.dataset.form,
          params = {
            modalTitle: btn.dataset.name,
            formName: btn.dataset.option,
            rdvRequest: btn.dataset.rdvRequest,
          }

        switch (modalName) {
          case 'modal-form-2':
            new ModalModern(btn, 'data-form', {
              legacyModal: true,
              href: `/include/modals/modal-form-2.php?${$.param(params)}`,
              shadowDOM: true,
              destroyOnClose: true,
              useUrlHash: true,
              analyticsGoal: 'modal-form-2-sended',
              ...(btn.dataset.formParams && { formParams: btn.dataset.formParams }),
            })
            break

          case 'modal-form-3':
            new ModalModern(btn, 'data-form', {
              legacyModal: true,
              href: `/include/modals/modal-form-3.php?${$.param(params)}`,
              shadowDOM: true,
              destroyOnClose: true,
              useUrlHash: true,
              analyticsGoal: 'modal-form-3-sended',
              ...(btn.dataset.formParams && { formParams: btn.dataset.formParams }),
            })
            break

          case 'modal-form-4':
            new ModalModern(btn, 'data-form', {
              legacyModal: true,
              href: `/include/modals/modal-form-4.php?${$.param(params)}`,
              shadowDOM: true,
              destroyOnClose: true,
              useUrlHash: true,
              analyticsGoal: 'modal-form-4-sended',
              ...(btn.dataset.formParams && { formParams: btn.dataset.formParams }),
            })
            break

          default:
            break
        }
      })
    }
  }

  window.blockInShadow = function (selector = 'data-inshadow') {
    let blocks = [...document.querySelectorAll(`[${selector}]`)],
      initForms = (shadow) => {
        let formsSelector = 'data-form-modern',
          forms = [...shadow.querySelectorAll(`[${formsSelector}]`)]

        if (forms.length) {
          forms.forEach((form) => {
            getForm().then(({ Form }) => {
              new Form(form, formsSelector)
            })

            let inputs = form.querySelectorAll('[data-input]')

            inputs.forEach((input) => {
              input.addEventListener('change', (e) => {
                if (input.value.length) $(input).valid()
              })
            })
          })
        }
      }

    blocks.forEach((el) => {
      let linkElem = document.createElement('link'),
        shadow = el.attachShadow({ mode: 'open' })

      linkElem.setAttribute('rel', 'stylesheet')
      const assetsPath = document.body.dataset.assetsPath || 'assets/'
      linkElem.setAttribute('href', `${assetsPath}include/assets/styles/main.css?v=${Date.now()}`)
      shadow.appendChild(linkElem)
      while (el.firstChild) {
        shadow.appendChild(el.firstChild)
      }
      initForms(shadow)
      setTimeout(() => {
        el.style.display = 'block'
      }, 500)
    })
  }
}
