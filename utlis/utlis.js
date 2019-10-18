// 此文件是封装计算出发城市与到达城市之间的时间差
export function computeTime(arr_time,dep_time) {
    // 判断是否有 值
    if(!arr_time || !dep_time) return
    // 切割成字符串数组
    let dep = dep_time.split(":"); //[12:40]
    let arr = arr_time.split(":"); //[23:00]
    //   console.log(this.data.dep_tiem)
    // 消失转换成分钟
    let depps = dep[0] * 60 + +dep[1];
    let arrs = arr[0] * 60 + +arr[1];
    // 将到达时间减去出发时间
    let dist = arrs - depps;
    if (dist < 0) {
        dist = arrs + 24 * 60 - depps;
    }
    // 得到相差时间，进行字符串拼接 将分钟转换成小时 取余

    return `${Math.floor(dist / 60)}时：${dist % 60}分`;
}