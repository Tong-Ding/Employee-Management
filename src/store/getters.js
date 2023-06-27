// 这些 getter 函数都接受一个 state 参数，用于访问 Store 中的状态数据。
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name
}
export default getters
