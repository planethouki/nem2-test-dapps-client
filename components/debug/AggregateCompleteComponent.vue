<template>
  <div class="mb-5">
    <h1>Agregate Complete Create</h1>
    <div class="mb-3">
      <h5>create something</h5>
      <b-button @click="click">Button</b-button>
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
  AggregateTransaction,
  Deadline,
  Mosaic,
  MosaicDefinitionTransaction,
  MosaicFlags,
  MosaicId,
  MosaicNonce,
  MosaicSupplyChangeAction,
  MosaicSupplyChangeTransaction,
  Message,
  NetworkType,
  PlainMessage,
  PublicAccount,
  RepositoryFactoryHttp,
  SignedTransaction,
  TransferTransaction,
  UInt64
} from 'symbol-sdk'

export default {
  name: "AggregateCompleteComponent",
  data () {
    return {
      signResult: 'fuga',
      announceResult: 'hoge'
    }
  },
  methods: {
    async click () {
      if (window.nem2 === undefined) {
        this.signResult = `nem2 not found`
        return
      }

      const repo = new RepositoryFactoryHttp('https://dg0nbr5d1ohfy.cloudfront.net:443')

      const {
        networkType,
        generationHash,
        publicKey,
        addressPlain
      } = await window.nem2.getAccountInfo()

      const publicAccount = PublicAccount.createFromPublicKey(publicKey, networkType)
      const transfer1 = TransferTransaction.create(
        Deadline.create(1616694977),
        Account.generateNewAccount(networkType).address,
        [new Mosaic(new MosaicId('091F837E059AE13C'), UInt64.fromUint(1))],
        PlainMessage.create(''),
        networkType
      )
      const transfer2 = TransferTransaction.create(
        Deadline.create(1616694977),
        Account.generateNewAccount(networkType).address,
        [new Mosaic(new MosaicId('091F837E059AE13C'), UInt64.fromUint(1))],
        PlainMessage.create(''),
        networkType
      )
      const tx = AggregateTransaction.createComplete(
        Deadline.create(1616694977),
        [
          transfer1.toAggregate(publicAccount),
          transfer2.toAggregate(publicAccount),
        ],
        networkType,
        [],
        UInt64.fromUint(2000000),
      )

      const dummyAccount = Account.generateNewAccount(networkType)
      const signedTx = dummyAccount.sign(tx, generationHash)

      const result = await window.nem2.sign(signedTx.payload, 'aggregate complete')
      this.signResult = JSON.stringify(result)
      const signedTransaction = new SignedTransaction(
        result.payload,
        result.hash,
        result.signerPublicKey,
        result.transactionType,
        result.networkType
      )
      // console.log(signedTx)
      // console.log(signedTransaction)
      const txHttp = repo.createTransactionRepository()
      const res = await txHttp.announce(signedTransaction).toPromise()
      console.log(res)
    }
  }
}
</script>

<style scoped>

</style>
