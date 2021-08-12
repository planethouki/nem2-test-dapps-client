export const state = () => ({
  list: [],
  metadataKey: 'AB66A77390046840',
  metadataAddress: 'TCZ5KXKSAJA74A5ECZCXMHOHKFVQ36YSONW4RSA',
  endPoint: 'https://dg0nbr5d1ohfy.cloudfront.net:443'
})

export const mutations = {
  add(state, text) {
    state.list.push({
      text,
      done: false
    })
  },
  remove(state, { todo }) {
    state.list.splice(state.list.indexOf(todo), 1)
  },
  toggle(state, todo) {
    todo.done = !todo.done
  }
}
