<template>
  <div class="py-2">
    <div class="d-flex align-items-center">
      <h5>All NFT List</h5>
      <div class="mb-2 ml-2" @click="get(pageNumber)">
        <b-button variant="outline-secondary">
          <b-icon-arrow-clockwise></b-icon-arrow-clockwise>
        </b-button>
      </div>
    </div>
    <template v-if="nftMetadataData === null">
      <b-spinner type="grow" label="Spinning"></b-spinner>
    </template>
    <template v-else-if="nftMetadataData.length === 0">
      <div class="my-2">
        No Item
      </div>
    </template>
    <template v-else>
      <div
        v-for="meta in nftMetadataData"
        :key="meta.id"
        class="d-flex align-items-center py-1"
      >
        <shape :mosaicId="meta.metadataEntry.targetId.toHex()" />
        <div class="px-1">
          <div>
            <span>ID</span>
            <span>&nbsp;</span>
            <span>
              {{ meta.metadataEntry.targetId.toHex() }}
            </span>
          </div>
          <div v-if="meta.accountInfo" style="word-break: break-all;">
            <span>Owner</span>
            <span>&nbsp;</span>
            <span>
              {{ meta.accountInfo.address.plain() }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <b-pagination
      v-model="pageNumber"
      :total-rows="rows"
      :per-page="pageSize"
    ></b-pagination>
  </div>
</template>

<script>
import { Address, MosaicId, RepositoryFactoryHttp } from 'symbol-sdk'
import { Observable, from, of } from 'rxjs'
import { mergeMap, map, tap } from 'rxjs/operators'
import Shape from '~/components/Shape.vue'
import { BIconArrowClockwise } from 'bootstrap-vue'

export default {
  name: "NftAllList",
  components: { Shape, BIconArrowClockwise },
  data () {
    return {
      nftMetadataData: null,
      pageNumber: 1,
      metadataHttpSubscription: null,
      pageSize: 10
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
      const accountHttp = repo.createAccountRepository()
      const metadataAddress = Address.createFromRawAddress(this.$store.state.metadataAddress)
      this.nftMetadataData = null
      if (this.metadataHttpSubscription !== null) this.metadataHttpSubscription.unsubscribe()
      this.metadataHttpSubscription = metadataHttp
        .search({
          scopedMetadataKey: this.$store.state.metadataKey,
          targetAddress: metadataAddress,
          metadataType: 1,
          pageSize: this.pageSize,
          pageNumber: pageNumber
        })
        .pipe(
          tap(page => console.log('metadata page', page)),
          map(page => page.data),
          mergeMap((data) => {
            const accountAndMetaPromises = data.map((meta) => {
              return accountHttp.search({
                mosaicId: meta.metadataEntry.targetId
              }).toPromise().then((accountInfoPage) => {
                if (accountInfoPage.data.length > 0) {
                  return {
                    ...meta,
                    accountInfo: accountInfoPage.data[0]
                  }
                }

                return meta
              })
            })
            return from(Promise.all(accountAndMetaPromises))
          })
        )
        .subscribe((data) => {
          this.nftMetadataData = data
        })
    }
  }
}
</script>

<style scoped>

</style>
