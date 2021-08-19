<template>
  <div>
    <div class="d-flex align-items-center">
      <b-button @click="send" :disabled="isBuying">
        {{$t('index.buy.buyButton.text')}}
        <b-spinner small type="grow" v-if="isBuying"></b-spinner>
      </b-button>
      <span class="d-inline-block mr-3"></span>
      <span> {{ message }}</span>
    </div>
  </div>
</template>

<script>
import {
  AggregateTransactionCosignature,
  PublicAccount, RepositoryFactoryHttp, SignedTransaction,
} from "symbol-sdk";
import { mapState } from 'vuex'
import { from, of } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'
import { tap, map, mergeMap, switchMap, catchError } from 'rxjs/operators'

export default {
  name: "NftBuy",
  data () {
    return {
      message: "",
      isBuying: false
    }
  },
  props: {
    mosaicId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState({
      endPoint: 'endPoint'
    }),
    ...mapState('account', {
      publicKey: 'publicKey',
    })
  },
  methods: {
    async send () {
      this.message = ""
      this.isBuying = true
      const repo = new RepositoryFactoryHttp(this.endPoint)
      const txHttp = repo.createTransactionRepository()
      const headers = new Headers()
      headers.append('content-type', 'application/json')
      const request = new Request(
        'https://nem2-test-dapps-server.netlify.app/.netlify/functions/buy',
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ mosaicId: this.mosaicId, publicKey: this.publicKey }),
          mode: 'cors'
        }
      )

      fromFetch(request)
        .pipe(
          switchMap(response => {
            if (response.ok) {
              return response.json();
            } else {
              return of({ error: true, message: `Error ${response.status}` });
            }
          }),
          tap(signed => console.log("Buy API", signed)),
          mergeMap(signed => {
            const p = window.nem2
              .cosign(signed.payload, `Buy NFT ${this.mosaicId} for 500 xym`)
              .then((cosig) => {
                const aggregateCosignature = new AggregateTransactionCosignature(
                  cosig.signature,
                  PublicAccount.createFromPublicKey(cosig.signer.publicKey, cosig.signer.address.networkType)
                )
                const signedTransaction = new SignedTransaction(
                  signed.payload,
                  signed.hash,
                  signed.signerPublicKey,
                  signed.transactionType,
                  signed.networkType
                )
                return {
                  signedTransaction,
                  aggregateCosignature
                }
              })
            return from(p)
          }),
          mergeMap(({ signedTransaction, aggregateCosignature }) => {

            const cosignedWithoutSize = signedTransaction.payload
              + aggregateCosignature.version.toHex()
              + aggregateCosignature.signer.publicKey
              + aggregateCosignature.signature

            const size = (cosignedWithoutSize.length / 2).toString(16).padStart(8, '0').toUpperCase()
            const leSize = size.substr(-2, 2) + size.substr(-4, 2) + size.substr(-6, 2) + size.substr(-8, 2)
            const cosignedPayload = leSize + cosignedWithoutSize.substr(8)

            const cosignedTx = new SignedTransaction(
              cosignedPayload,
              signedTransaction.hash,
              signedTransaction.signerPublicKey,
              signedTransaction.type,
              signedTransaction.networkType
            )
            return from(txHttp.announce(cosignedTx))
          })
        )
        .subscribe({
          next: (announceResponse) => {
            this.message = 'success'
            this.isBuying = false
          },
          error: (err) => {
            console.error(err)
            this.message = err.name === 'UserDeniedCosignatureError' ? '' : 'Something Error'
            this.isBuying = false
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
