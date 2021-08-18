<template>
  <div class="py-2">
    <div class="d-flex align-items-center">
      <h5>{{$t('index.buy.title')}}</h5>
      <div class="mb-2 ml-2" @click="get()">
        <b-button variant="outline-secondary">
          <b-icon-arrow-clockwise></b-icon-arrow-clockwise>
        </b-button>
      </div>
    </div>
    <template v-if="nftMosaics === null">
      <nft-item-skeleton />
    </template>
    <template v-else-if="nftMosaics.length === 0">
      <nft-item-empty />
    </template>
    <template v-else>
      <div
        v-for="nft in nftMosaics"
        :key="nft.id.toHex()"
        class="d-flex align-items-center py-1"
      >
        <nft-item :mosaicId="nft.id.toHex()">
          <div>
            Price &nbsp; 500 XYM
          </div>
          <template v-if="nem2 === null">
            <b-button disabled>No Wallet</b-button>
          </template>
          <template v-else>
            <nft-buy :mosaicId="nft.id.toHex()" />
          </template>
        </nft-item>
      </div>
    </template>
  </div>
</template>

<script>
import {Address, MosaicId, RepositoryFactoryHttp, UInt64} from 'symbol-sdk'
import { Observable, from, of } from 'rxjs'
import { mergeMap, map, tap } from 'rxjs/operators'
import NftItem from '~/components/NftItem.vue'
import NftItemEmpty from '~/components/NftItemEmpty.vue'
import NftItemSkeleton from '~/components/NftItemSkeleton.vue'
import NftBuy from '~/components/index/NftBuy.vue'
import { mapState } from 'vuex'
import { BIconArrowClockwise } from 'bootstrap-vue'

export default {
  name: "NftSellList",
  components: { NftItem, NftItemEmpty, NftItemSkeleton, NftBuy, BIconArrowClockwise },
  data () {
    return {
      nftMosaics: null,
      getSubscription: null,
      nem2: null
    }
  },
  computed: {
    rows () {
      return (this.pageNumber + 1) * this.pageSize
    },
    ...mapState({
      metadataAddress: 'metadataAddress',
      endPoint: 'endPoint',
      metadataKey: 'metadataKey'
    })
  },
  mounted () {
    if (window.nem2 !== undefined) {
      this.nem2 = window.nem2
      this.nem2
        .getAccountInfo()
        .then(({ networkType, generationHash, publicKey, addressPlain, networkProperties }) => {
          this.$store.commit('account/setAccount', {networkType, generationHash, publicKey, addressPlain, networkProperties})
        })
    }

    this.get()
  },
  methods: {
    get () {
      const repo = new RepositoryFactoryHttp(this.endPoint)
      const metadataHttp = repo.createMetadataRepository()
      const accountHttp = repo.createAccountRepository()
      const metadataAddress = Address.createFromRawAddress(this.metadataAddress)
      this.nftMosaics = null
      if (this.getSubscription !== null) this.getSubscription.unsubscribe()
      this.getSubscription = accountHttp
        .getAccountInfo(metadataAddress)
        .pipe(
          map(accountInfo => accountInfo.mosaics.filter(mosaic => {
            return UInt64.fromUint(1).equals(mosaic.amount)
          })),
          mergeMap((mosaics) => {
            const mosaicAndMetaPromises = mosaics.map((mosaic) => {
              return metadataHttp
                .search({
                  scopedMetadataKey: this.metadataKey,
                  targetAddress: metadataAddress,
                  metadataType: 1,
                  targetId: mosaic.id
                })
                .toPromise()
                .then((page) => {
                  return {
                    mosaic,
                    metadata: page.data.length > 0 ? page.data[0] : null
                  }
                })
            })
            return from(Promise.all(mosaicAndMetaPromises))
          }),
          tap((metaMosaics) => console.log("Minter Owned", metaMosaics)),
          map((metaMosaics) => {
            return metaMosaics.filter((metaMosaic) => {
              return metaMosaic.metadata !== null
            }).map((metaMosaic) => metaMosaic.mosaic)
          })
        )
        .subscribe((mosaics) => {
          this.nftMosaics = mosaics
        })
    }
  }
}
</script>

<style scoped>

</style>
