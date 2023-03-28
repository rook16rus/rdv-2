<template>
	<div class="modal-info">
		<div class="modal-info__close" @click="closeModal"> 
			<span class="link link--color--black-light">
				<svg class="icon-modern icon-modern--cross link__icon icon-modern--size--normal">
					<use :xlink:href="assetsPath + '/include/assets/img/sprite.svg#cross-usage'"></use>
				</svg>
			</span>
		</div>
		
		<div class="t-base t-base--size--small t-base--color--gray-dark v-indent v-indent--red">
			<slot></slot>
		</div>
		<span class="link link--color--blue">
			<span class="link__text">Подробнее</span>
		</span>
	</div>
</template>

<script>
export default {
	props: {},
	data: () => {
		return {
      assetsPath: document.body.dataset.assetsPath || 'assets/'
		};
	},
	computed: {
		
	},
	methods: {
		closeModal () {
			this.$emit("close-modal")
		}
	}
};
</script>
