
// 声明一个函数，会返回一个对象
export let state = () => ({
    userInfo: {}
})
// 调用此方法可以修改上面的内容
// // 存放的是同步修改state的方法
export let mutations = {
    // mutation下的值必须是一个函数 有一个固定的参数是state，第二个参数是用户调用方法适合传过来的参数
    // data登录成功后返回的是一个对象
    setUserInfo(state, data) {
        // 实际上state.userInfo是上面声明的函数
        state.userInfo = data
    }
}
// 存放的是异步修改state的方法
export let actions = {
    // 封装登录的方法 store相当于this.$store data是传进来的参数
    // 关于this.$store为何能在普通js文件中使用，是因为在组件中通过dispatch调用了cations方法，所以不会报错
    async login(store, data) {
        let res = await this.$axios({
            url: '/accounts/login',
            method: 'Post',
            data
        })
        // console.log(res)
        // 通过调用mutation下的方法掉修改state的值,commit方法调用mutations的方法
        // 第一个参数是文件名，第二个参数是要登录成功后要传的参数
        if (res.status === 200) {
            // store相当于this.$store
            store.commit("setUserInfo", res.data);
        }
        // 返回整个fromise对象
        return res
    },
    // 验证码
    async register(store, tel) {
        let res = await this.$axios({
            url: '/captchas',
            method: 'Post',
            data: { tel }
        })
        return res
    },
    // 注册
    async enroll(store, data) {
        let res = await this.$axios({
            url: "/accounts/register",
            method: "Post",
            data
        });
        // console.log(res)
        return res
    }
}
