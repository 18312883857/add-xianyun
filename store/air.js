
// 此页面是用来存储机票搜索的数据
export let state = ()=>({
    // 搜索的历史记录
    history: []
})
export let mutations = {
    setHistory(state,data){
        state.history.unshift(data)
    }
}