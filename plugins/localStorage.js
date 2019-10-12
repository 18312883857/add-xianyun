// 这是一个能帮助我们将数据存储到本地的框架
import createPersistedState from 'vuex-persistedstate'
export default ({store}) => {
  window.onNuxtReady(() => {
    createPersistedState({
    })(store)
  })
}