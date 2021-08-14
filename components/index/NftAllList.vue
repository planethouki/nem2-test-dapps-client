<template>
  <div>
    <h5>All NFT List</h5>
    <template v-if="nftMetadataData === null">
      <b-spinner type="grow" label="Spinning"></b-spinner>
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

export default {
  name: "NftAllList",
  components: { Shape },
  data () {
    return {
      nftMetadataData: null,
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
