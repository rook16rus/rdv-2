<template>
	<div class="input count-control count-control--small">
		<div
			class="count-control__btn count-control__btn--dec"
			:class="{'is-disabled': quantity === min}"
			@click.prevent="decrement"
		>
		</div>
		<input
			autocomplete="off"
			type="text"
			class="input__control count-control__input"
			:value="`${placeholderBefore} ${quantity} ${placeholderAfterVisibility}`.trim()"
			:readonly="!editable"
			@focus="focused = true"
			@blur="focused = false"
			@input="$emit('update:quantity', $event.target.value>=min?+$event.target.value:min)"
			ref="input"
		/>
		<div
			class="count-control__btn count-control__btn--inc"
			@click.prevent="increment"
		>
		</div>
	</div>
</template>

<script>
import Inputmask from 'inputmask';

export default {
	props: {
		quantity: {
			type: Number,
			required: true
		},
		placeholderAfter: {
			type: String,
			default: ''
		},
		placeholderBefore: {
			type: String,
			default: ''
		},
		editable: {
			type: Boolean,
			default: false
		},
		min: {
			type: Number,
			default: 0
		}
	},
	data: () => {
		return {
			focused: false
		};
	},
	computed: {
		placeholderAfterVisibility() {
			return this.editable && this.focused ? '' : this.placeholderAfter
		}
	},
	methods: {
		increment() {
			if (this.quantity < 9999) {
				this.$emit("update:quantity", this.quantity + 1);
			}
		},
		decrement() {
			if (this.quantity > this.min) {
				this.$emit("update:quantity", this.quantity - 1);
			}
		},
		initMask() {
			const self = this;
			Inputmask('numeric', {
                min: this.min,
                max: 9999,
				showMaskOnHover: false,
				showMaskOnFocus: false,
				unmaskAsNumber: true,
				rightAlign: false
			}).mask(self.$refs.input);
		}
	},
	mounted() {
		this.initMask();
	}
};
</script>

