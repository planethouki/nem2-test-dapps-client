<template>
  <div class="d-flex align-items-center py-1">
    <shape :mosaicId="mosaicId" />
    <div class="px-1">
      <div>
        <span>ID</span>
        <span>&nbsp;</span>
        <span>
          {{ mosaicId }}
        </span>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Shape from '~/components/Shape.vue'

export default {
  name: "NftItem",
  components: { Shape },
  props: {
    mosaicId: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
