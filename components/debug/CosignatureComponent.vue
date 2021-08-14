<template>
  <div class="mb-5">
    <h1>Cosignature</h1>
    <div class="mb-3">
      <h5>create something</h5>
      <b-button @click="click">Button</b-button>
    </div>
    <div class="mb-3">
      <h5>log</h5>
      <textarea :value="cosignResult" class="w-100"></textarea>
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
  UInt64, AggregateTransactionCosignature
} from 'symbol-sdk'

export default {
  name: "CosignatureComponent",
  data () {
    return {
      cosignResult: '',
      signResult: '',
      announceResult: ''
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

      const account2 = Account.createFromPrivateKey(
        "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E",
        networkType
      )
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
          transfer2.toAggregate(account2.publicAccount),
        ],
        networkType,
        [],
        UInt64.fromUint(2000000),
      )

      const signedTx = account2.sign(tx, generationHash)

      const result = await window.nem2.cosign(signedTx.payload, 'cosignature')
      const cosignature = new AggregateTransactionCosignature(
        result.signature,
        PublicAccount.createFromPublicKey(result.signer.publicKey, result.signer.address.networkType)
      )
      this.cosignResult = JSON.stringify(cosignature)

      const cosignedWithoutSize = signedTx.payload
        + cosignature.version.toHex()
        + cosignature.signer.publicKey + cosignature.signature

      const size = (cosignedWithoutSize.length / 2).toString(16).padStart(8, '0').toUpperCase()
      const leSize = size.substr(-2, 2) + size.substr(-4, 2) + size.substr(-6, 2) + size.substr(-8, 2)
      const cosigned = leSize + cosignedWithoutSize.substr(8)

      const cosignedTx = new SignedTransaction(
        cosigned,
        signedTx.hash,
        signedTx.signerPublicKey,
        signedTx.type,
        signedTx.networkType
      )

      this.signResult = JSON.stringify(cosignedTx)

      console.log(cosignedTx)
      const txHttp = repo.createTransactionRepository()
      const res = await txHttp.announce(cosignedTx).toPromise()
      console.log(res)
      this.announceResult = JSON.stringify(res)
    }
  }
}
</script>

<style scoped>

</style>
