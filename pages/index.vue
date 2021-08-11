<template>
  <div class="container">
    <h1>NFT</h1>
    <nft-balance />
    <nft-all-list />
    <p>transfer</p>
    <p>buy</p>
  </div>
</template>

<script>
import NftBalance from '~/components/NftBalance.vue'
import NftAllList from '~/components/NftAllList.vue'

export default {
  components: { NftAllList, NftBalance }
}
</script>

<style>
</style>
