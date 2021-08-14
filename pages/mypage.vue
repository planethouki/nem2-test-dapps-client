<template>
  <div class="container">
    <template v-if="isLoading">
      <b-spinner type="grow" label="Spinning"></b-spinner>
    </template>
    <template v-else-if="nem2 === null">
      {{ message }}
    </template>
    <template v-else>
      <h1>MyPage</h1>
      <nft-balance />
    </template>
  </div>
</template>

<script>
import NftBalance from '~/components/mypage/NftBalance.vue'

export default {
  components: { NftBalance },
  data () {
    return {
      isLoading: true,
      message: '',
      nem2: null
    }
  },
  mounted () {
    if (window.nem2 === undefined) {
      this.isLoading = false
      this.message = `wallet not found`
      return
    }

    this.nem2 = window.nem2
    this.nem2
      .getAccountInfo()
      .then(({ networkType, generationHash, publicKey, addressPlain, networkProperties }) => {
        this.$store.commit('account/setAccount', {networkType, generationHash, publicKey, addressPlain, networkProperties})
        this.isLoading = false
      })
  }
}
</script>

<style>
</style>
