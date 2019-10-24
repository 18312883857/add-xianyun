import {Message} from 'element-ui'
// 此页面是用来存储草稿箱数据的
export let state = ()=>({
    // 保存的历史记录
    youxiang : []
})
export let mutations = {
    // 添加数据的方法
    setYouXiang(state,data){
        console.log(data)
        if(data.city == '' || data.title == '' || data.content == '') {
            Message.error(`输入框内容不能为空`)
            return
        }
        state.youxiang.unshift(data)
        Message.success(`保存成功`)
    },
    // 删除数据的方法
    deleteYouXiang(state,index){
        state.youxiang.splice(index,1)
        Message.success(`删除成功`)
    },
    // 编辑数据的方法
    EditData(state,index){
        state.youxiang.splice(index,1)
    }
}