<template>
  <div>
    <h5>Buy NFT</h5>
    <template v-if="nftMosaics === null">
      <b-spinner type="grow" label="Spinning"></b-spinner>
    </template>
    <template v-else>
      <div
        v-for="nft in nftMosaics"
        :key="nft.id.toHex()"
        class="d-flex align-items-center py-1"
      >
        <shape :mosaicId="nft.id.toHex()" />
        <div class="px-1">
          <div>
            <span>ID</span>
            <span>&nbsp;</span>
            <span>
              {{ nft.id.toHex() }}
            </span>
          </div>
          <div>
            Price &nbsp; 500 XYM
          </div>
          <template v-if="nem2 === null">
            <b-button disabled>No Wallet</b-button>
          </template>
          <template v-else>
            <nft-buy :mosaicId="nft.id.toHex()" />
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import {Address, MosaicId, RepositoryFactoryHttp, UInt64} from 'symbol-sdk'
import { Observable, from, of } from 'rxjs'
import { mergeMap, map, tap } from 'rxjs/operators'
import Shape from '~/components/Shape.vue'
import NftBuy from '~/components/index/NftBuy.vue'
import { mapState } from 'vuex'

export default {
  name: "NftSellList",
  components: { Shape, NftBuy },
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
