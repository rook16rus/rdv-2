<template>
  <div class="page-bg page-bg--grey legacy-calculator">
    <section class="section mt-5">
      <div class="section__container">
        <div class="section__row">
          <div class="col">
            <div class="v-indent v-indent--green">
              <div class="t-base t-base--size--h2 t-base--color--blue-dark">{{ header }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--m-blue">
      <div class="section__container">
        <div class="row">
          <div class="col-12 col-md-12 col-lg-7 col-xl-7">
            <div class="row v-indent v-indent--green">
              <div class="col">
                <div class="v-indent v-indent--green t-base t-base--size--h4 t-base--color--blue-dark">Рассчитайте
                  стоимость интеграции 1С с маркетплейсами<br/>
                  Выберите одну или несколько схем работы
                </div>
              </div>
            </div>
            <div class="row section__block d-flex flex-wrap calculator__tarif-list" :class="priorityItem">
              <div
                  class="col-12 col-sm-auto col-xl-4 d-flex justify-content-center col--gap--20 v-indent v-indent--yellow-last calculator__product-item"
                  :class="item.product" v-for="item in marketplaces">
                <div class="card">
                  <div class="card__img v-indent v-indent--green d-flex justify-content-center"><img :src="item.logo">
                  </div>
                  <hr class="v-indent v-indent--green">
                  <div
                      class="v-indent v-indent--red t-base t-base--size--small t-base--weight--bold t-base--color--dark-light">
                    выберите схему
                  </div>
                  <ul>
                    <li class="v-indent v-indent--red" v-for="tarif in item.tarifs">
                      <div class="schem-item" @click="activateTarif(tarif)"
                           :class="{ 'is-active': tarif.isActive, 'is-ozon': tarif.isOzonFBO }">
                        <div
                            class="t-base t-base--size--small t-base--weight--bold text-uppercase t-base--color--dark-light">
                          {{ tarif.code }}
                          <div class="scheme-tip-content">
                            <img :src="assetsPath + 'include/assets/img/svg/info_circle.svg'" alt="information">
                            <div class="schem-tip">Данная схема доступна к покупке при одновременном приобретении тарифа
                              Ozon FBS или Wildberries FBM
                            </div>
                          </div>
                        </div>
                        <div class="t-base t-base--size--small t-base--color--gray-dark">
                          <span>{{ tarif.price | localStr }}</span>&nbsp;<span>₽/день</span></div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="row section__block">
              <div class="v-indent v-indent--green t-base t-base--size--h4 t-base--color--blue-dark">Выберите количество
                лицензий 1С
              </div>
              <div class="col-12">
                <div class="card card--full card--p20" :class="{ 'is-active': licenseCounter&gt;0 }">
                  <div class="d-sm-flex d-block justify-content-between">
                    <div class="v-indent v-indent--red t-base t-base--weight--bold t-base--color--dark-light">
                      Пользовательские лицензии 1С
                    </div>
                    <div class="v-indent v-indent--red-last t-base t-base--size--small t-base--color--gray-dark"><span>{{ licensePrice | localStr }}</span>&nbsp;<span>₽/день за одну лицензию</span>
                    </div>
                  </div>
                  <div class="row v-indent v-indent--orange">
                    <div class="col-12 col-sm-8">
                      <div class="t-base t-base--size--small t-base--color--dark-light">Количество лицензий
                        соответствует количеству сотрудников, которые будут работать в системе
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <div class="input count-control count-control--small">
                        <count-control :editable="true" :quantity="licenseCounter" :min="1"
                                       @update:quantity="licenseCounter = $event"></count-control>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row d-flex flex-wrap section__block">
              <div class="v-indent v-indent--green t-base t-base--size--h4 t-base--color--blue-dark">Добавьте
                дополнительные модули
              </div>
              <div
                  class="col-12 col-sm-6 col-xl-6 d-flex justify-content-center col--gap--20 v-indent v-indent--yellow-last"
                  v-for="item in modules">
                <div class="card card--full card--p20 d-flex flex-column justify-content-between"
                     :class="{ 'is-active': item.isActive }">
                  <div class="d-sm-flex d-block justify-content-between v-indent v-indent--orange">
                    <div class="card__subtitle t-base t-base--weight--bold t-base--color--dark-light">{{ item.title }}
                    </div>
                    <div class="t-base t-base--size--small t-base--color--gray-dark"><span>{{ item.price }}</span>&nbsp;<span>₽/день</span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <button class="button-modern button-modern--small button-modern--type--bordered"
                            v-if="!item.isActive" @click="activateModule(item)">добавить
                    </button>
                    <button class="button-modern button-modern--small" v-else="item.isActive"
                            @click="activateModule(item)">убрать
                    </button>
                    <div class="info" @click="showModal" :id="item.id"><img :src="assetsPath + 'include/assets/img/information.svg'" alt="information">
                      <div class="info__content">
                        <div class="t-base t-base--size--small t-base--color--gray-dark v-indent v-indent--red">
                          {{ item.infoText }}
                        </div>
                        <!--<span class="link link--color--blue"><span class="link__text">Подробнее</span></span>-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="mobilePriceCalc"
               class="col-12 col-md-12 col-lg-5 col-xl-5 col--mobile-no-padding col--styky-block sidebar">
            <div class="row main-content">
              <div class="col col--gap--20 col--mobile-no-padding d-block d-lg-flex justify-content-end sidebar__inner">
                <div class="card card--lr-40 card--medium card--bg-blue-light sidebar__content">
                  <div class="t-base t-base--weight--bold t-base--color--white-main v-indent v-indent--green">Стоимость
                    тарифа
                  </div>
                  <div class="d-flex flex-wrap v-indent v-indent--green">
                    <button class="button-modern button-modern--xs button-modern--tab mb-2" v-for="item in daysDiscount"
                            @click="activateOneItem(daysDiscount,item)" :class="{ 'is-active': item.isActive }">
                      {{ item.days }} дней
                    </button>
                  </div>
                  <div class="v-indent v-indent--green">
                    <div class="d-flex justify-content-center align-items-center" v-if="activeDays.discount > 0">
                      <div
                          class="t-base t-base--line--through t-base--align--center t-base--weight--bold t-base--color--white-main">
                        {{ allPrice | localStr }} ₽
                      </div>
                      <div class="label-sale">
                        <div class="t-base t-base--size--small t-base--weight--bold t-base--color--blue-light">
                          -{{ activeDays.discount }}%
                        </div>
                      </div>
                    </div>
                    <div class="t-base--align--center t-base t-base--size--h2 t-base--color--yellow-main">
                      {{ allPriceDiscount | localStr }} ₽
                    </div>
                    <div class="t-base t-base--size--small t-base--color--white-main t-base--align--center">
                      {{ priceInDayDiscount | localStr }} ₽/день
                    </div>
                  </div>
                  <hr class="v-indent v-indent--green card__hr-color-blue">
                  <div class="t-base t-base--weight--bold t-base--color--white-main v-indent v-indent--green">В тариф
                    включено:
                  </div>
                  <ul class="v-indent v-indent--green">
                    <li class="v-indent v-indent--red" v-for="item in activeTarifs">
                      <div class="price-item d-flex justify-content-between">
                        <div class="price-item__descr">
                          <div class="t-base t-base--color--white-main">{{ item.name }} ({{ item.code }})</div>
                        </div>
                        <div class="price-item__cost">
                          <div class="price-item__cost-new t-base t-base--color--white-main">
                            {{ item.totalTarifPriceDiscount | localStr }} ₽
                          </div>
                          <div
                              class="price-item__cost-old t-base t-base--size--small t-base--line--through t-base--color--white-main"
                              v-if="activeDays.discount > 0">{{ item.totalTarifPrice | localStr }} ₽
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="v-indent v-indent--red">
                      <div class="price-item d-flex justify-content-between">
                        <div class="price-item__descr">
                          <div class="t-base t-base--color--white-main">Пользовательские лицензии</div>
                          <div class="d-flex align-items-center t-base t-base--size--small t-base--color--white-main">
                            <div class="t-base t-base--size--xs t-base--color--white-main">{{ licensePrice | localStr }}
                              ₽
                            </div>&nbsp;
                            &times;
                            &nbsp;
                            <div class="t-base t-base--size--xs t-base--color--white-main">{{ licenseCounter }} шт</div>
                          </div>
                        </div>
                        <div class="price-item__cost">
                          <div class="price-item__cost-new t-base t-base--color--white-main">
                            {{ licensePriceDiscountCalc | localStr }} ₽
                          </div>
                          <div
                              class="price-item__cost-old t-base t-base--size--small t-base--line--through t-base--color--white-main"
                              v-if="activeDays.discount > 0">{{ licensePriceCalc | localStr }} ₽
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="v-indent v-indent--red" v-for="item in activeModules">
                      <div class="price-item d-flex justify-content-between">
                        <div class="price-item__descr">
                          <div class="t-base t-base--color--white-main">{{ item.title }}</div>
                        </div>
                        <div class="price-item__cost">
                          <div class="price-item__cost-new t-base t-base--color--white-main">
                            {{ item.totalTarifPriceDiscount | localStr }} ₽
                          </div>
                          <div
                              class="price-item__cost-old t-base t-base--size--small t-base--line--through t-base--color--white-main"
                              v-if="activeDays.discount > 0">{{ item.totalTarifPrice | localStr }} ₽
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="v-indent v-indent--red" v-if="diskSpaceCounter">
                      <div class="price-item d-flex justify-content-between">
                        <div class="price-item__descr">
                          <div class="t-base t-base--color--white-main">Дисковое пространство</div>
                          <div class="d-flex align-items-center t-base t-base--size--small t-base--color--white-main">
                            <div class="t-base t-base--size--xs t-base--color--white-main">{{ storagePrice | localStr }}
                              ₽
                            </div>&nbsp;
                            &times;
                            &nbsp;
                            <div class="t-base t-base--size--xs t-base--color--white-main">{{ diskSpaceCounter }} Гб
                            </div>
                          </div>
                        </div>
                        <div class="price-item__cost">
                          <div class="price-item__cost-new t-base t-base--color--white-main">
                            {{ diskSpacePriceDiscountCalc | localStr }} ₽
                          </div>
                          <div
                              class="price-item__cost-old t-base t-base--size--small t-base--line--through t-base--color--white-main"
                              v-if="activeDays.discount > 0">{{ diskSpacePriceCalc | localStr }} ₽
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <button class="button-modern button-modern--w100p v-indent v-indent--yellow js-open-modal"
                          :class="{'button-modern--theme--yellow': !integration}" type="button"
                          data-commentary="Заявка с калькулятора RDV Маркет."
                          data-request-type="3dd16968-1c80-4f63-9c59-635da55bb2d6" data-form="#form1"
                          data-form-params='{"calculatorForm": true}'>Отправить заявку
                  </button>
                  <div class="t-base t-base--weight--bold t-base--color--white-main t-base--align--center">
                    Тестовый период 14 дней
                    <br>
                    и подключение 1 кабинета бесплатно!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <modal-info v-if="openModal" @close-modal="closeInfoModal">{{ chooceModuleText[0]['infoText'] }}</modal-info>
    <div v-if="mobilePrice" class="modal-price d-xs-none d-block">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <div class="t-base t-base--size--h3 t-base--color--yellow-main">{{ allPrice | localStr }} ₽</div>
          <div class="t-base t-base--size--xs t-base--color--white-main">за {{ activeDays.days }} дней</div>
        </div>
        <button class="button-modern button-modern--lg button-modern--theme--yellow js-open-modal" type="button"
                data-form="#form1" data-commentary="Заявка с калькулятора RDV Маркет."
                data-request-type="3dd16968-1c80-4f63-9c59-635da55bb2d6" data-form-params='{"calculatorForm": true}'>
          Отправить заявку
        </button>
      </div>
    </div>
    <div class="overlay" v-if="openModal" @click="closeInfoModal"></div>
  </div>
</template>

<script>
import StickySidebar from 'sticky-sidebar-v2';
import CountControl from '../count-control/count-control.vue';
import ModalInfo from '../modal-info/modal-info.vue';
import {lockScroll, unlockScroll} from '../../js/libs/scroll-lock';
import HystModal from "../../js/libs/hystmodal.min";

export default {
  components: {
    "count-control": CountControl,
    "modal-info": ModalInfo
  },
  props: {
    header: {
      type: String,
      default: 'Калькулятор тарифов RDV Маркет',
    },
    priorityItem: {
      type: String,
      default: 'ozone',
    },
    integration: {
      type: Boolean,
      default: false,
    },
    defaultFbsWildberries: {
      type: Boolean,
      default: false,
    },
    defaultFbsOzone: {
      type: Boolean,
      default: false,
    },
    defaultFbsYandexMarket: {
      type: Boolean,
      default: false,
    },
    defaultFbsSbermegamarket: {
      type: Boolean,
      default: false,
    },
    defaultFbsAliexpress: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    const assetsPath = document.body.dataset.assetsPath || 'assets/';
    return {
      assetsPath,
      marketplaces: [
        {
          logo: `${assetsPath}include/assets/img/marketplaces/logo-ozon-big.svg`,
          product: "ozone",
          tarifs: [
            {
              name: "Ozon",
              code: "FBS",
              price: 150,
              isActive: this.defaultFbsOzone,
            },
            {
              name: "Ozon",
              code: "FBO",
              price: 25,
              isActive: false,
              isOzonFBO: true,
            },
          ],
        },
        {
          logo: `${assetsPath}include/assets/img/marketplaces/logo-wildberries-big.svg`,
          product: "wildberries",
          tarifs: [
            {
              name: "Wildberries",
              code: "FBS",
              price: 150,
              isActive: this.defaultFbsWildberries,
            },
            {
              name: "Wildberries",
              code: "FBМ",
              price: 100,
              isActive: false,
            },
          ],
        },
        {
          logo: `${assetsPath}include/assets/img/marketplaces/logo-sber-megamarket-big.svg`,
          product: "sbermegamarket",
          tarifs: [
            {
              name: "Sbermegamarket",
              code: "FBS",
              price: 100,
              isActive: this.defaultFbsSbermegamarket,
            },
          ],
        },
        {
          logo: `${assetsPath}include/assets/img/marketplaces/aliexpress-big.svg`,
          product: "aliexpress",
          tarifs: [
            {
              name: "Aliexpress",
              code: "FBS",
              price: 100,
              isActive: this.defaultFbsAliexpress,
            },
          ],
        },
        {
          logo: `${assetsPath}include/assets/img/marketplaces/logo-ya-market-big.svg`,
          product: "yandex-market",
          tarifs: [
            {
              name: "Yandex market",
              code: "FBS",
              price: 100,
              isActive: this.defaultFbsYandexMarket,
            },
          ],
        },
      ],
      licensePrice: 70,
      modules: [
        {
          id: 1,
          title: "Создание карточек товаров на Wildberries",
          price: 100,
          isActive: false,
          infoText:
              "Можно массово создавать и актуализировать карточки товаров в онлайн-режиме единого окна вашей системы 1С для быстрой трансляции новых карточек на Wildberries.",
        },
        {
          id: 3,
          title: "Внешний мониторинг цен",
          price: 150,
          isActive: false,
          infoText:
              "Модуль, позволяющий в автоматическом режиме получать рекомендованные цены на маркетплейсах для последующего сравнения, определения актуальной рыночной цены и оценки рентабельности продаж.",
        },
        {
          id: 4,
          title: "Коннектор",
          price: 400,
          isActive: false,
          infoText:
              "Отдельный модуль, состоящий из набора подсистем, которые встраиваются в вашу ERP или WMS систему. Модуль позволяет оперативно передавать остатки и цены в облачную систему RDV Маркет и собирать из нее новые заказы с маркетплейсов.",
        },
        {
          id: 5,
          title: "Доступ к среде разработки",
          price: 160,
          isActive: false,
          infoText:
              "Доступ к среде разработки дает возможность получить выделенную тестовую среду (копию рабочей базы клиента) с доступом в конфигуратор. Клиент может самостоятельно проводить доработки конфигурации в соответствии со стандартами разработки продукта RDV Маркет. После реализации доработок клиентом мы осуществляем code-review и переносим изменения на рабочую базу клиента.",
        },
      ],
      storagePrice: 9,
      daysDiscount: [
        {
          days: 30,
          discount: 0,
          isActive: true,
        },
        {
          days: 90,
          discount: 5,
          isActive: false,
        },
        {
          days: 180,
          discount: 15,
          isActive: false,
        },
        {
          days: 360,
          discount: 25,
          isActive: false,
        },
      ],
      diskSpaceCounter: 0,
      licenseCounter: 1,
      modueleId: 1,
      openModal: false,
      mobilePrice: false
    }
  },
  filters: {
    localStr: function (value) {
      return value.toLocaleString();
    }
  },
  methods: {
    activateModule(item) {
      item.isActive = !item.isActive
    },
    activateTarif(tarif) {
      if (this.activeTarifs.length == 1 && tarif.isActive) {
        return
      } else {
        tarif.isActive = !tarif.isActive
      }
    },
    activateOneItem(items, item) {
      items.forEach(el => {
        el.isActive = false
      });
      item.isActive = true
    },
    showModal(event) {
      this.moduleId = event.currentTarget.id
      if (window.innerWidth < 670) {
        this.openModal = true
        lockScroll()
      }

    },
    closeInfoModal() {
      this.openModal = false
      unlockScroll()
    },
    priceWatch() {
      let callback = (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            return this.mobilePrice = true
          } else {
            return this.mobilePrice = false
          }
        });
      };
      let observer = new IntersectionObserver(callback);

      let target = document.querySelector("#mobilePriceCalc");

      observer.observe(target);
    }

  },
  computed: {
    chooceModuleText() {
      return this.modules.filter(module => module.id == this.modueleId)
    },
    activeDays() {
      return this.daysDiscount.find(day => day.isActive)
    },
    activeModules() {
      let models = this.modules.filter(module => module.isActive)
      models.forEach(el => el['totalTarifPrice'] = el.price * this.activeDays.days)
      models.forEach(el => el['totalTarifPriceDiscount'] = el.price * this.activeDays.days * (100 - this.activeDays.discount) / 100)
      return models
    },
    activeTarifs() {
      let res = []
      this.marketplaces.forEach(el => {
        res = [...res, ...el.tarifs.filter(tarif => tarif.isActive)]
      })
      res.forEach(el => el['totalTarifPrice'] = el.price * this.activeDays.days)
      res.forEach(el => el['totalTarifPriceDiscount'] = el.price * this.activeDays.days * (100 - this.activeDays.discount) / 100)
      return res
    },
    licensePriceCalc() {
      return this.licenseCounter * this.licensePrice * this.activeDays.days
    },
    licensePriceDiscountCalc() {
      return this.licenseCounter * this.licensePrice * this.activeDays.days * (100 - this.activeDays.discount) / 100
    },
    diskSpacePriceCalc() {
      return this.diskSpaceCounter * this.storagePrice * this.activeDays.days
    },
    diskSpacePriceDiscountCalc() {
      return this.diskSpaceCounter * this.storagePrice * this.activeDays.days * (100 - this.activeDays.discount) / 100
    },
    allPrice() {
      let price = 0;
      this.activeTarifs.forEach(el => price += el.totalTarifPrice)
      this.activeModules.forEach(el => price += el.totalTarifPrice)
      price += this.licensePriceCalc
      price += this.diskSpacePriceCalc
      return price
    },
    allPriceDiscount() {
      return this.allPrice * (100 - this.activeDays.discount) / 100
    },
    priceInDay() {
      return this.allPrice / this.activeDays.days
    },
    priceInDayDiscount() {
      return this.allPriceDiscount / this.activeDays.days
    },
    totalData() {
      let str = '';
      // строку не форматировать!
      str = `
              Заявка с калькулятора RDV Маркет. Конфигурация:
              Кол-во дней: ${this.activeDays.days};
              -----
              В тариф включено:
              ${this.activeTarifs.map(tarif => {
        return `— ${tarif.name} (${tarif.code}) — ${tarif.totalTarifPriceDiscount.toLocaleString()} ₽`
      }).toString().replace(/,/g, "\n")}
              Пользовательские лицензии:
              ${this.licenseCounter} шт — ${this.licensePriceDiscountCalc.toLocaleString()} ₽
              Дополнительные модули:
              ${this.activeModules.map(module => {
        return `— ${module.title} — ${module.totalTarifPriceDiscount.toLocaleString()} ₽`
      }).toString().replace(/,/g, "\n")}
              Дисковое пространство:
              ${this.diskSpaceCounter} гб — ${this.diskSpacePriceDiscountCalc.toLocaleString()} ₽
              -----
              Стоимость тарифа: ${this.allPriceDiscount.toLocaleString()} ₽`
      return str;
    }
  },
  mounted() {
    const that = this;
    const modal = new HystModal({
      linkAttributeName: "data-form",
      beforeOpen: (modal) => {
        const resultInput = modal.openedWindow.querySelector('.js-result-input');
        if (resultInput) {
          resultInput.value = that.totalData;
        }
      },
      afterClose: function (modal) {
        const resultInput = modal.openedWindow.querySelector('.js-result-input');
        if (resultInput) {
          resultInput.value = "";
        }
      }
    });
    window.rdv.calcModals = modal;
    const buttons = document.querySelectorAll('.js-open-modal');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        modal.open(button.dataset.form);
      })
    })

    this.priceWatch();
    var sidebar = new StickySidebar('.sidebar', {
      topSpacing: 75,
      bottomSpacing: 20,
      containerSelector: '.main-content',
      innerWrapperSelector: '.sidebar__inner',
      minWidth: 1100
    });
    window.initLegacyModals();
    window.blockInShadow('data-calculator');
  }
}
</script>