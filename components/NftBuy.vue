<template>
  <section>
    <h5 v-b-toggle.nft-buy-xfg234kd94af23>Buy</h5>
    <b-collapse id="nft-buy-xfg234kd94af23">
      <div>
        <b-form-group
          description="mosaic id to buy"
          label="NFT ID (Mosaic ID)"
          label-for="input-1"
          valid-feedback="Valid Mosaic ID"
          :invalid-feedback="invalidFeedbackMosaic"
          :state="stateMosaic"
        >
          <b-form-input id="input-1" v-model="mosaicId" :state="stateMosaic" trim></b-form-input>
        </b-form-group>
        <div class="d-flex align-items-center">
          <b-button @click="send">Confirm</b-button>
          <span class="d-inline-block mr-3"></span>
          <span> {{ announceMessage }}</span>
        </div>
      </div>
    </b-collapse>
  </section>
</template>

<script>
import {
  Account,
  Address, AggregateTransaction,
  Deadline,
  Mosaic,
  MosaicId,
  NetworkType,
  PlainMessage, RepositoryFactoryHttp, SignedTransaction,
  TransferTransaction,
  UInt64
} from "symbol-sdk";
import { mapState } from 'vuex'
import { from, of } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'
import { tap, map, mergeMap, switchMap, catchError } from 'rxjs/operators'

export default {
  name: "NftBuy",
  data () {
    return {
      mosaicId: "",
      announceMessage: ""
    }
  },
  computed: {
    stateMosaic() {
      return this.mosaicId.length >= 16
    },
    invalidFeedbackMosaic() {
      if (this.mosaicId.length > 16) {
        return 'invalid mosaic id'
      }
      return 'Please enter.'
    },
    ...mapState({
      endPoint: 'endPoint'
    }),
    ...mapState('account', {
      publicKey: 'publicKey',
    })
  },
  methods: {
    async send () {
      if (!(this.stateMosaic)) {
        return
      }

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
          tap(signed => console.log(signed)),
          mergeMap(signed => {
            const ag = AggregateTransaction.createFromPayload(signed.payload)
            // return from(window.nem2.sign(ag, `buy nft ${this.mosaicId} for 500 xym`))
            return from(Promise.resolve())
          }),
          mergeMap(cosigned => {
            // return from(txHttp.announce(cosigned))
            return from(Promise.resolve())
          })
        )
        .subscribe({
          next () {

          }
        })
    }
  }
}
</script>

<style scoped>

</style>
