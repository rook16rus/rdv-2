import { ModalModern } from '../modal-modern/modal-modern'

const createTemplate = (header, text) => {
  const assetsPath = document.body.dataset.assetsPath || 'assets/'

  return `
	<div id="modalConfirm" class="modal-confirm">
		<div class="modal-modern">
			<div class="modal-modern__wrapper">
				<div class="modal-modern__close" data-modal-close="">
					<span class="link link--color--dark-55">
						<svg class="icon-modern icon-modern--cross link__icon icon-modern--size--xl">
							<use xlink:href="${assetsPath}include/assets/img/sprite.svg#cross-usage"></use>
						</svg>
					</span>
				</div>
				<div class="modal-modern__header">
					<div class="modal-modern__title t-base t-base--size--h4 v-indent v-indent--yellow">
						${header}
					</div>
				</div>
				<div class="modal-modern__body">
					<div class="t-base t-base--size--medium">
						${text}
					</div>
				</div>
			</div>
		</div>
	</div>
	`
}

const createMessagePoup = (header, text) => {
  const template = createTemplate(header, text)
  const messageModal = new ModalModern(null, '', {
    href: '.modal-confirm',
    legacyModal: true,
    shadowDOM: true,
    vue: false,
    template: template,
  })
  messageModal.openModal()
  const shadowRoot = messageModal.modalShadowContainer.shadowRoot
  const messageTingle = shadowRoot.querySelector('.tingle-modal')
  messageTingle.classList.add('tingle-modal--visible')
  messageTingle.style.display = ''
  const closeButton = shadowRoot.querySelector('.modal-modern__close')
  closeButton.addEventListener('click', () => messageModal.closeModal())
  return messageModal
}

export { createMessagePoup }
