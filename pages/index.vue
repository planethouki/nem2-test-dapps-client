<template>
  <div class="container">
    <h1>NFT</h1>
    <nft-all-list />
    <nft-sell-list />
  </div>
</template>

<script>
import NftAllList from '~/components/index/NftAllList.vue'
import NftSellList from "../components/index/NftSellList";

export default {
  components: { NftAllList, NftSellList },
  data () {
    return {}
  },
  mounted () {
  }
}
</script>

<style>
</style>
