import { ModalModern } from '../modal-modern/modal-modern';

const createTemplate = (header, text) => {
	return `
	<div id="modalConfirm" class="modal-confirm">
		<div class="modal-modern">
			<div class="modal-modern__wrapper">
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
				<div class="modal-form__btn modal-confirm__action-block">
					<button class="button-modern modal-confirm__close-button">Да</button>
					<button class="button-modern modal-confirm__return-button">Нет</button>
				</div>
			</div>
		</div>
	</div>
	`
}

const createConfirmPoup = (header, text, declineFunc, approveFunc) => {
	const template = createTemplate(header, text)
	const confirmModal = new ModalModern(null, '', {
		href: ".modal-confirm",
		legacyModal: true,
		shadowDOM: true,
		vue: false,
		template: template,
		tingle: {
			beforeClose: () => false
		}
	})
	confirmModal.openModal()
	const shadowRoot = confirmModal.modalShadowContainer.shadowRoot
	const confirmTingle = shadowRoot.querySelector('.tingle-modal')
	confirmTingle.classList.add('tingle-modal--visible')
	confirmTingle.style.display = ''
	const confirmCloseButton = shadowRoot.querySelector('.modal-confirm__close-button')
	const confirmReturnButton = shadowRoot.querySelector('.modal-confirm__return-button')
	confirmReturnButton.addEventListener('click', () => declineFunc())
	confirmCloseButton.addEventListener('click', () => approveFunc())
	return confirmModal
}

export { createConfirmPoup }
