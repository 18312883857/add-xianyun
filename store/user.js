// 声明一个函数，会返回一个对象
export let state = ()=>({
    userInfo : {}
})
// 调用此方法可以修改上面的内容
export let mutations = {
    // mutation下的值必须是一个函数 有一个固定的参数是state，第二个参数是用户调用方法适合传过来的参数
    // data登录成功后返回的是一个对象
    setUserInfo(state,data){
        // 实际上state.userInfo是上面声明的函数
        state.userInfo = data
    }
}
