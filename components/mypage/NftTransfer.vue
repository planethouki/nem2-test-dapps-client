<template>
  <section>
    <b-button
      :class="visible ? null : 'collapsed'"
      :aria-expanded="visible ? 'true' : 'false'"
      aria-controls="collapse-4"
      @click="visible = !visible"
    >
      Transfer
    </b-button>
    <b-collapse v-model="visible" class="mt-2">
      <b-form-group
        label="To Address"
        :label-for="inputId"
        valid-feedback="Valid Address"
        :invalid-feedback="invalidFeedbackRecipient"
        :state="stateRecipient"
      >
        <b-form-input :id="inputId" v-model="recipientAddress" :state="stateRecipient"></b-form-input>
      </b-form-group>
      <div class="d-flex align-items-center">
        <b-button @click="send" :disabled="!stateRecipient || isTransfering">
          Confirm
          <b-spinner small type="grow" v-if="isTransfering"></b-spinner>
        </b-button>
        <span class="d-inline-block mr-3"></span>
        <span> {{ message }}</span>
      </div>
    </b-collapse>
  </section>
</template>

<script>
import {
  Account,
  Address,
  Deadline,
  Mosaic,
  MosaicId,
  NetworkType,
  PlainMessage, RepositoryFactoryHttp, SignedTransaction,
  TransferTransaction,
  UInt64
} from "symbol-sdk";
import { from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

export default {
  name: "NftTransfer",
  data () {
    return {
      recipientAddress: "",
      message: "",
      isTransfering: false,
      visible: false
    }
  },
  props: {
    mosaicId: {
      type: String,
      required: true
    }
  },
  computed: {
    stateRecipient() {
      return this.recipientAddress.replace(/-/gm, "").length === 39
    },
    invalidFeedbackRecipient() {
      if (this.recipientAddress.replace(/-/gm, "").length > 39) {
        return 'invalid address'
      }
      return 'Please enter.'
    },
    inputId () {
      return `input-${Math.random().toString(32).substring(2)}`
    }
  },
  methods: {
    async send () {
      if (!(this.stateRecipient)) {
        return
      }
      this.isTransfering = true
      const networkType = this.$store.state.account.networkType
      const generationHash = this.$store.state.account.generationHash
      const rawEpochAdjustment = this.$store.state.account.networkProperties.network.epochAdjustment
      const epochAdjustment = Number(rawEpochAdjustment.replace('s', ''))
      const tx = TransferTransaction.create(
        Deadline.create(epochAdjustment),
        Address.createFromRawAddress(this.recipientAddress),
        [new Mosaic(new MosaicId(this.mosaicId), UInt64.fromUint(1))],
        PlainMessage.create(''),
        networkType,
        UInt64.fromUint(20000)
      )
      const account = Account.generateNewAccount(networkType)
      const tempSignedTx = account.sign(tx, generationHash)
      const signPromise = window.nem2.sign(tempSignedTx.payload, `Send NFT ${this.mosaicId} to ${this.recipientAddress}`)
      from(signPromise)
        .pipe(
          mergeMap((signResult) => {
            const signedTx = new SignedTransaction(
              signResult.payload,
              signResult.hash,
              signResult.signerPublicKey,
              signResult.transactionType,
              signResult.networkType
            )
            const repo = new RepositoryFactoryHttp(this.$store.state.endPoint)
            const txHttp = repo.createTransactionRepository()
            return txHttp.announce(signedTx)
          })
        )
        .subscribe({
          next: (announceResponse) => {
            this.message = 'Transaction has been sent'
            this.isTransfering = false
          },
          error: (err) => {
            console.error(err)
            this.message = err.name === 'UserDeniedSignatureError' ? '' : 'Something Error'
            this.isTransfering = false
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
