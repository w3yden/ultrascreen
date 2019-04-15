const state = {
  nickname: 'FooBar'
}

const mutations = {
  SET_NICKNAME (state, name) {
    state.nickname = name
  }
}

const actions = {
  selectNickname (context, payload) {
    context.commit('SET_NICKNAME', payload)
  }
}

export default {
  state,
  mutations,
  actions
}
