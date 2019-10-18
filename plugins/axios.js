import {Message} from 'element-ui'
// nuxt插件的固定写法
// context包含nuxt下所有的方法，固定有的参数
export default (context)=>{
    // console.log(context)
    // main.js中拦截器: 拦截所有的请求响应
    // 当前的拦截只拦截错误,如果请求错误就会执行onError中的函数
    context.$axios.onError(res=>{
        // 这个res是错误的对象，Error的对象可以通过response获取详细信息
        console.log(res.response.data)
        let {message,statusCode} = res.response.data
        if(statusCode === 400){
            Message.error(message)
        }
        if([401,403].indexOf(statusCode) > -1){
            // 重定向跳转到登录页 redirect是context的方法，就要跳转页面的功能
            context.redirect("/user/login");
        }
    })
}