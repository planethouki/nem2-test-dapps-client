<template>
  <div class="container">
    <transfer-component />
    <nft-component />
    <aggregate-complete-component />
  </div>
</template>

<script>
import TransferComponent from '~/components/debug/TransferComponent.vue'
import NftComponent from '~/components/debug/NftComponent.vue'
import AggregateCompleteComponent from '~/components/debug/AggregateCompleteComponent.vue'

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
