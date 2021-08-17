<template>
  <div class="container">
    <transfer-component />
    <nft-component />
    <aggregate-complete-component />
    <cosignature-component />
    <three-getting-started />
  </div>
</template>

<script>
import TransferComponent from '~/components/debug/TransferComponent.vue'
import NftComponent from '~/components/debug/NftComponent.vue'
import AggregateCompleteComponent from '~/components/debug/AggregateCompleteComponent.vue'
import CosignatureComponent from '~/components/debug/CosignatureComponent.vue'
import ThreeGettingStarted from '~/components/debug/ThreeGettingStarted.vue'

export default {
  name: "Debug",
  components: {
    TransferComponent,
    NftComponent,
    AggregateCompleteComponent,
    CosignatureComponent,
    ThreeGettingStarted
  }
}
</script>

<style scoped>

</style>
