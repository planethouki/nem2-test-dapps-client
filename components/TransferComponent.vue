<template>
  <div class="mb-5">
    <h1>TransferTransaction</h1>
    <div class="mb-3">
      <h5>send something</h5>
      <b-button @click="click">Send</b-button>
    </div>
    <div class="mb-3">
      <h5>log</h5>
      <textarea :value="signResult" class="w-100"></textarea>
      <textarea :value="announceResult" class="w-100"></textarea>
    </div>
</div>
</template>

<script>
import {
  Account,
  Address,
  Deadline,
  Mosaic,
  MosaicId,
  Message,
  NetworkType,
  PlainMessage,
  RepositoryFactoryHttp,
  SignedTransaction,
  TransferTransaction,
  UInt64
} from 'symbol-sdk'

export default {
  name: "TransferComponent",
  data () {
    return {
      signResult: 'fuga',
      announceResult: 'hoge'
    }
  },
  methods: {
    click () {
      if (window.nem2 === undefined) {
        this.signResult = `nem2 not found`
        return
      }

      window.nem2.getAccountInfo().then(({ networkType, generationHash, publicKey, addressPlain }) => {
        const tx = TransferTransaction.create(
          Deadline.create(1616694977),
          Address.createFromRawAddress(addressPlain),
          [new Mosaic(new MosaicId('091F837E059AE13C'), UInt64.fromUint(1))],
          PlainMessage.create(''),
          NetworkType.TEST_NET,
          UInt64.fromUint(20000)
        )
        const account = Account.generateNewAccount(networkType)
        const signedTx = account.sign(tx, generationHash)
        return window.nem2.sign(signedTx.payload, 'hoge-fuga-message')
      }).then((result) => {
        this.signResult = JSON.stringify(result)
        const signedTx = new SignedTransaction(
          result.payload,
          result.hash,
          result.signerPublicKey,
          result.transactionType,
          result.networkType
        )
        const repo = new RepositoryFactoryHttp('https://dg0nbr5d1ohfy.cloudfront.net:443')
        const txHttp = repo.createTransactionRepository()
        return txHttp.announce(signedTx).toPromise()
      }).then((res) => {
        this.announceResult = JSON.stringify(res)
      })
    }
  }
}
</script>

<style scoped>

</style>
