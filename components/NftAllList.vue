<template>
  <div>
    <h5>All NFT List</h5>
    <template v-if="nftMetadataPage === null">
      <b-spinner type="grow" label="Spinning"></b-spinner>
    </template>
    <template v-else>
      <p v-for="meta in nftMetadataPage.data" :key="meta.id">
        {{ meta.metadataEntry.targetId.toHex() }}
      </p>
    </template>
    <b-pagination
      v-model="pageNumber"
      :total-rows="rows"
      :per-page="pageSize"
    ></b-pagination>
  </div>
</template>

<script>
import {Address, RepositoryFactoryHttp} from 'symbol-sdk'

export default {
  name: "NftAllList",
  data () {
    return {
      nftMetadataPage: null,
      pageNumber: 1,
      metadataHttpSubscription: null,
      pageSize: 20
    }
  },
  computed: {
    rows () {
      return (this.pageNumber + 1) * this.pageSize
    }
  },
  watch: {
    pageNumber (newValue) {
      this.get(newValue)
    }
  },
  mounted () {
    this.get(1)
  },
  methods: {
    get (pageNumber) {
      const repo = new RepositoryFactoryHttp(this.$store.state.endPoint)
      const metadataHttp = repo.createMetadataRepository()
      const metadataAddress = Address.createFromRawAddress(this.$store.state.metadataAddress)
      this.nftMetadataPage = null
      if (this.metadataHttpSubscription !== null) this.metadataHttpSubscription.unsubscribe()
      this.metadataHttpSubscription = metadataHttp
        .search({
          scopedMetadataKey: this.$store.state.metadataKey,
          targetAddress: metadataAddress,
          metadataType: 1,
          pageSize: this.pageSize,
          pageNumber: pageNumber
        })
        .subscribe((page) => {
          console.log(page)
          this.nftMetadataPage = page
        })
    }
  }
}
</script>

<style scoped>

</style>
