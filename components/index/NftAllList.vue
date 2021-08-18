<template>
  <div class="py-2">
    <div class="d-flex align-items-center">
      <h5>{{$t('index.list.title')}}</h5>
      <div class="mb-2 ml-2" @click="get(pageNumber)">
        <b-button variant="outline-secondary">
          <b-icon-arrow-clockwise></b-icon-arrow-clockwise>
        </b-button>
      </div>
    </div>
    <template v-if="nftMetadataData === null">
      <div
        v-for="num in [...Array(10).map((_, i) => i)]"
        :key="num"
      >
        <nft-item-skeleton />
      </div>
    </template>
    <template v-else>
      <div
        v-for="meta in nftMetadataData"
        :key="meta.metadataInfo.id"
      >
        <nft-item :mosaicId="meta.mosaicId">
          <div style="word-break: break-all;">
            <span>Owner</span>
            <span>&nbsp;</span>
            <span>
              {{ meta.owner }}
            </span>
          </div>
        </nft-item>
      </div>
      <div
        v-for="num in [...new Array(Math.max(10 - nftMetadataData.length, 0)).map((_, i) => i)]"
        :key="num"
      >
        {{ num }}
        <nft-item-empty />
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
import NftItem from '~/components/NftItem.vue'
import NftItemEmpty from '~/components/NftItemEmpty.vue'
import NftItemSkeleton from '~/components/NftItemSkeleton.vue'
import { BIconArrowClockwise } from 'bootstrap-vue'

export default {
  name: "NftAllList",
  components: { Shape, BIconArrowClockwise, NftItem, NftItemEmpty, NftItemSkeleton },
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
                    metadataInfo: meta,
                    accountInfo: accountInfoPage.data[0],
                    owner: accountInfoPage.data[0].address.plain(),
                    mosaicId: meta.metadataEntry.targetId.toHex()
                  }
                }

                return {
                  metadataInfo: meta,
                  mosaicId: meta.metadataEntry.targetId.toHex()
                }
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
