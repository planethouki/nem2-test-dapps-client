<template>
  <div class="mb-5">
    <h1>NFT Create</h1>
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
  name: "NftComponent",
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

      const repo = new RepositoryFactoryHttp('https://dg0nbr5d1ohfy.cloudfront.net:443')
      let signedTx

      window.nem2.getAccountInfo().then(({ networkType, generationHash, publicKey, addressPlain }) => {

        const address = Address.createFromRawAddress(addressPlain)
        const publicAccount = PublicAccount.createFromPublicKey(publicKey, networkType)

        const [isSupplyMutable, isTransferable, isRestrictable ] = [false, true, false]
        const nonce = MosaicNonce.createRandom()
        const mosaicDefinitionTx = MosaicDefinitionTransaction.create(
          Deadline.create(1616694977),
          nonce,
          MosaicId.createFromNonce(nonce, address),
          MosaicFlags.create(isSupplyMutable, isTransferable, isRestrictable),
          0,
          UInt64.fromUint(0),
          networkType
        )
        const mosaicSupplyChangeTx = MosaicSupplyChangeTransaction.create(
          Deadline.create(1616694977),
          mosaicDefinitionTx.mosaicId,
          MosaicSupplyChangeAction.Increase,
          UInt64.fromUint(1),
          networkType,
        )
        const tx = AggregateTransaction.createComplete(
          Deadline.create(1616694977),
          [
            mosaicDefinitionTx.toAggregate(publicAccount),
            mosaicSupplyChangeTx.toAggregate(publicAccount),
          ],
          networkType,
          [],
          UInt64.fromUint(20000000),
        )

        const dummyAccount = Account.generateNewAccount(networkType)
        const signedTx = dummyAccount.sign(tx, generationHash)

        return window.nem2.sign(signedTx.payload, 'nft creation')
      }).then((result) => {
        this.signResult = JSON.stringify(result)
        const signedTransaction = new SignedTransaction(
          result.payload,
          result.hash,
          result.signerPublicKey,
          result.transactionType,
          result.networkType
        )
        signedTx = signedTransaction
        const repo = new RepositoryFactoryHttp('https://dg0nbr5d1ohfy.cloudfront.net:443')
        const txHttp = repo.createTransactionRepository()
        return txHttp.announce(signedTransaction).toPromise()
      }).then((res) => {
        this.announceResult = JSON.stringify(res)
        return new Promise(resolve => setTimeout(resolve, 500))
      }).then(() => {
        const txStatusHttp = repo.createTransactionStatusRepository()
        return txStatusHttp.getTransactionStatus(signedTx.hash).toPromise()
      }).then((res) => {
        console.log(res)
      })


    }
  }
}
</script>

<style scoped>

</style>
