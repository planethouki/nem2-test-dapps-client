export const state = () => ({
  networkType: 0,
  generationHash: '',
  publicKey: '',
  addressPlain: '',
  networkProperties: null
})

export const mutations = {
  setAccount(state, {networkType, generationHash, publicKey, addressPlain, networkProperties}) {
    state.networkType = networkType
    state.generationHash = generationHash
    state.publicKey = publicKey
    state.addressPlain = addressPlain
    state.networkProperties = networkProperties
  }
}
