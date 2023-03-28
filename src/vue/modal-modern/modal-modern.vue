<template lang="pug">
    div
        slot(name="button")
        slot(name="modal")
</template>

<script>
import { ModalModern } from '%modules%/modal-modern/modal-modern';
export default {
    mounted(){
        new ModalModern(this.$slots.button[0].elm,'data-modal');
    }
}
</script>
