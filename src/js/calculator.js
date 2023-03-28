import Sticky from 'sticky-js'
import tmpl from 'blueimp-tmpl'
import getCoords from '%src%/js/getCoords'

export default function calculator() {
  const container = document.querySelector('.js-calculator')
  if (!container) return

  let sticky

  fetch(container.dataset.url)
    .then((res) => res.json())
    .then((data) => {
      if (!(data.marketplaces && data.license && data.modules && data.days)) {
        console.error('Invalid JSON')
        return
      }

      // просто рендер статики
      render('.js-calculator-marketplaces', 'calculator-marketplaces', data)
      render('.js-calculator-license-cost', 'calculator-license-cost', data)
      render('.js-calculator-license-count', 'calculator-license-count', data)
      render('.js-calculator-modules', 'calculator-modules', data)
      render('.js-calculator-days', 'calculator-days', data)

      if (window.matchMedia('(min-width: 1099px)').matches) {
        sticky = new Sticky('.js-calculator-sticky', {
          stickyClass: 'active',
        })

        window.stickyCalc = sticky;
      }

      // инициализируем логику калькулятора
      init(data)

      // убираем скелетон
      show()
    })

  function render(wrapperSelector, templateName, data) {
    const wrapper = container.querySelector(wrapperSelector)
    wrapper.innerHTML = tmpl(templateName, data)
  }

  function init(data) {
    update(data)

    // Дальше пишем листенеры для элементов управления
    setEventListeners(data)
  }

  function update(data) {
    const state = simplifyState(data)

    if (!state.days) {
      // Если вдруг все false
      console.error('Days required')
      return
    }

    const list = [
      ...state.marketplaces.map((item) => ({
        name: item.name,
        price: item.cost * (1 - state.days.discount) * state.days.count,
        old: state.days.discount ? item.cost * state.days.count : 0,
      })),
      {
        name: `${state.license.name} ${state.license.cost}&nbsp;${state.currency}&nbsp;×&nbsp;${state.license.count}&nbsp;шт`,
        price: state.license.cost * state.license.count * (1 - state.days.discount) * state.days.count,
        old: state.days.discount ? state.license.cost * state.license.count * state.days.count : 0,
      },
      ...state.modules.map((item) => ({
        name: item.name,
        price: item.cost * (1 - state.days.discount) * state.days.count,
        old: state.days.discount ? item.cost * state.days.count : 0,
      })),
    ]
    const total = list.reduce((acc, item) => {
      acc += item.price
      return acc
    }, 0)
    const old = list.reduce((acc, item) => {
      acc += item.old
      return acc
    }, 0)

    render('.js-calculator-license-count', 'calculator-license-count', {
      license: {
        count: state.license.count,
      },
    })
    render('.js-calculator-license-cost', 'calculator-license-cost', {
      currency: state.currency,
      license: {
        cost: state.license.cost,
        old: data.license.cost,
        discount: state.license.discount,
        discounts: data.license.discounts.filter((item) => item.discount),
      },
    })
    render('.js-calculator-result', 'calculator-result', {
      currency: state.currency,
      discount: state.days.discount,
      old,
      list,
      total,
      cost: total / state.days.count,
    })
    render('.js-calculator-button', 'calculator-button', {
      json: JSON.stringify({
        currency: state.currency,
        list,
        total: total,
        cost: total / state.days.count,
        days: state.days.count,
      }),
      total,
      days: state.days.count,
      currency: state.currency,
    })

    if (sticky) {
      sticky.update()
    }
  }

  function simplifyState(data) {
    const days = data.days.find((item) => item.active)

    return {
      currency: data.currency,
      marketplaces: data.marketplaces.reduce((acc, item) => {
        item.options
          .filter((option) => option.active)
          .forEach((option) => {
            acc.push({
              name: `${item.name} (${option.name})`,
              cost: option.cost,
            })
          })
        return acc
      }, []),
      license: {
        name: data.license.name,
        cost: data.license.cost * (1 - data.license.discounts.findLast((item) => data.license.count >= item.count).discount),
        count: data.license.count,
        discount: data.license.discounts.findLast((item) => data.license.count >= item.count).discount,
      },
      modules: data.modules
        .filter((item) => item.active)
        .map((item) => ({
          name: item.name,
          cost: item.cost,
        })),
      days: {
        count: days.count,
        discount: days.discount,
      },
    }
  }

  function setEventListeners(data) {
    const marketplacesOptions = container.querySelectorAll('.calculator__marketplace-option')
    marketplacesOptions.forEach((button) => {
      button.addEventListener('click', () => {
        const optionsCount = data.marketplaces.reduce((acc, marketplace) => {
          marketplace.options
            .filter((option) => option.active)
            .forEach((option) => {
              acc++
            })
          return acc
        }, 0)

        if (optionsCount <= 1 && button.classList.contains('active')) {
          return
        }

        data.marketplaces.forEach((marketplace, i) => {
          marketplace.options.forEach((option, j) => {
            if (option.key == button.dataset.key) {
              button.classList.toggle('active')
              data.marketplaces[i].options[j].active = !data.marketplaces[i].options[j].active
            }
          })
        })

        update(data)
      })
    })

    const increaseButton = container.querySelector('.increase')
    increaseButton.addEventListener('click', () => {
      if (data.license.count >= 99) {
        return
      }

      data.license.count++
      update(data)
    })

    const decreaseButton = container.querySelector('.decrease')
    decreaseButton.addEventListener('click', () => {
      if (data.license.count <= 1) {
        return
      }

      data.license.count--
      update(data)
    })

    const modulesButtons = container.querySelectorAll('.calculator__module .button')
    modulesButtons.forEach((button) => {
      button.addEventListener('click', () => {
        button.closest('.calculator__module').classList.toggle('active')

        data.modules.forEach((module, i) => {
          if (module.key == button.dataset.key) {
            data.modules[i].active = !data.modules[i].active
          }
        })

        update(data)
      })
    })

    const daysButtons = container.querySelectorAll('.calculator__result-option')
    daysButtons.forEach((button) => {
      button.addEventListener('click', () => {
        daysButtons.forEach((b) => {
          b.classList.remove('active')
        })

        button.classList.toggle('active')

        data.days.forEach((day, i) => {
          if (day.key == button.dataset.key) {
            data.days[i].active = true
          } else {
            data.days[i].active = false
          }
        })

        update(data)
      })
    })

    // tooltip stop event propagation
    const tooltips = document.querySelectorAll('.calculator__tooltip')
    tooltips.forEach((tooltip) => {
      tooltip.addEventListener('click', (e) => {
        e.stopPropagation()
      })
    })

    // mobile fixed result
    if (window.matchMedia('(max-width: 1100px)').matches) {
      const resultBlock = container.querySelector('.js-calculator-sticky')
      const startY = getCoords(container).top
      const endY = getCoords(resultBlock).top

      window.addEventListener(
        'scroll',
        () => {
          console.log(window.scrollY)
          resultBlock.classList.toggle('fixed', window.scrollY > startY && window.scrollY + window.innerHeight < endY)
        },
        { passive: true }
      )
    }
  }

  function show() {
    container.classList.remove('loading')
  }
}
