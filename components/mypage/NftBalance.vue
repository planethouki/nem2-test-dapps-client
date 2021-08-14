<template>
  <div>
    <section>
      <h5>Your Balance</h5>
      <template v-if="metadatas === null">
        <b-spinner type="grow" label="Spinning"></b-spinner>
      </template>
      <template v-else>
        <p>{{ metadatas.length }}</p>
      </template>
    </section>
    <section>
      <h5>Your List</h5>
      <template v-if="metadatas === null">
        <b-spinner type="grow" label="Spinning"></b-spinner>
      </template>
      <template v-else>
        <div
          v-for="meta in metadatas"
          :key="meta.id"
          class="d-flex align-items-center py-1"
        >
          <shape :mosaicId="meta.metadataEntry.targetId.toHex()" />
          <div class="px-1">
            <span>{{ meta.metadataEntry.targetId.toHex() }}</span>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<script>
import { MosaicId, RepositoryFactoryHttp, Address, UInt64 } from 'symbol-sdk'
import { mergeMap, from,  } from 'rxjs'
import { mergeWith, map, mergeAll } from 'rxjs/operators'
import Shape from '~/components/Shape.vue'

export default {
  name: "NftBalance",
  components: { Shape },
  data () {
    return {
      metadatas: null,
      accountHttpSubscription: null
    }
  },
  mounted () {
    this.get()
  },
  methods: {
    get () {
      const repo = new RepositoryFactoryHttp(this.$store.state.endPoint)
      const accountHttp = repo.createAccountRepository()
      const metadataHttp = repo.createMetadataRepository()
      const mosaicRegex = new RegExp(/^[0-7]/)
      const scopedMetadataKey = UInt64.fromHex(this.$store.state.metadataKey)
      const address = Address.createFromRawAddress(this.$store.state.account.addressPlain)
      this.metadatas = null
      if (this.accountHttpSubscription !== null) this.accountHttpSubscription.unsubscribe()
      this.accountHttpSubscription = accountHttp
        .getAccountInfo(address)
        .pipe(
          mergeMap((accountInfo) => {
            const metadataPromises = accountInfo
              .mosaics
              .map(m => m.id)
              .map(unresolved => unresolved.id.toHex())
              .filter(hexId => mosaicRegex.test(hexId))
              .map(hexId => new MosaicId(hexId))
              .map(mosaicId => metadataHttp.search({
                targetId: mosaicId
              }))
              .map(observable => observable.toPromise())
            return from(Promise.all(metadataPromises))
          }),
          map(pages => {
            return pages
              .map(page => page.data)
              .flat()
              .filter(metadata => {
                return metadata.metadataEntry.scopedMetadataKey.equals(scopedMetadataKey)
              })
          })
        )
        .subscribe((metadatas) => {
          console.log('owned mosaics', metadatas)
          this.metadatas = metadatas
        })
    }
  }
}
</script>

<style scoped>

</style>
