import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

// Vue 应用中使用 Vuex 状态管理库
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  getters //通过 state 存储状态数据，mutation 修改状态数据，action 提交 mutation 来更新状态，getter 计算派生状态数据并返回给视图展示。
})

export default store
