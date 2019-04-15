const state = {
  peerId: '-'
}

const mutations = {
  SET_PEER_ID (state, name) {
    state.peerId = name
  }
}

const actions = {
  setPeerId (context, payload) {
    context.commit('SET_PEER_ID', payload)
  }
}

export default {
  state,
  mutations,
  actions
}
