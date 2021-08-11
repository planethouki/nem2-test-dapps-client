<template>
  <div class="container">
    <transfer-component />
    <nft-component />
    <aggregate-complete-component />
  </div>
</template>

<script>
import TransferComponent from '~/components/TransferComponent.vue'
import NftComponent from '~/components/NftComponent.vue'
import AggregateCompleteComponent from '~/components/AggregateCompleteComponent.vue'

export default {
  name: "Debug",
  components: {
    TransferComponent,
    NftComponent,
    AggregateCompleteComponent
  }
}
</script>

<style scoped>

</style>
