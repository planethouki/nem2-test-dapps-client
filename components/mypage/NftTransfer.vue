<template>
  <section>
      <h5 v-b-toggle.nft-transfer-x5sijiyb6bg5u5sim5>Transfer</h5>
    <b-collapse id="nft-transfer-x5sijiyb6bg5u5sim5">
      <div>
        <b-form-group
          description="mosaic id to send"
          label="NFT ID (Mosaic ID)"
          label-for="input-1"
          valid-feedback="Valid Mosaic ID"
          :invalid-feedback="invalidFeedbackMosaic"
          :state="stateMosaic"
        >
          <b-form-input id="input-1" v-model="mosaicId" :state="stateMosaic" trim></b-form-input>
        </b-form-group>
        <b-form-group
          description="address to send"
          label="Address"
          label-for="input-2"
          valid-feedback="Valid Address"
          :invalid-feedback="invalidFeedbackRecipient"
          :state="stateRecipient"
        >
          <b-form-input id="input-2" v-model="recipientAddress" :state="stateRecipient" trim></b-form-input>
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
  Address,
  Deadline,
  Mosaic,
  MosaicId,
  NetworkType,
  PlainMessage, RepositoryFactoryHttp, SignedTransaction,
  TransferTransaction,
  UInt64
} from "symbol-sdk";

export default {
  name: "NftTransfer",
  data () {
    return {
      recipientAddress: "",
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
    stateRecipient() {
      return this.recipientAddress.replace(/-/gm, "").length === 39
    },
    invalidFeedbackRecipient() {
      if (this.recipientAddress.replace(/-/gm, "").length > 39) {
        return 'invalid address'
      }
      return 'Please enter.'
    }
  },
  methods: {
    async send () {
      if (!(this.stateMosaic && this.stateRecipient)) {
        return
      }
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
      const signResult = await window.nem2.sign(tempSignedTx.payload, `send nft ${this.mosaicId} to ${this.recipientAddress}`)

      const signedTx = new SignedTransaction(
        signResult.payload,
        signResult.hash,
        signResult.signerPublicKey,
        signResult.transactionType,
        signResult.networkType
      )
      const repo = new RepositoryFactoryHttp(this.$store.state.endPoint)
      const txHttp = repo.createTransactionRepository()
      this.announceMessage = ""
      txHttp.announce(signedTx).subscribe({
        next: (announceResponse) => {
          this.announceMessage = JSON.stringify(announceResponse)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
