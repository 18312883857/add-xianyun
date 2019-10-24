<template>
  <div>
    <!-- 地图的容器 放置的位置 -->
    <div id="container"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    // 异步加载高德地图
    window.onLoad = function() {
      var map = new AMap.Map("container", {
        zoom: 10, //级别
        center: [113.3245904, 23.1066805], //中心点坐标
        // viewMode: "3D" //使用3D视图
      });
    };
    var url =
      "https://webapi.amap.com/maps?v=1.4.15&key=697816c18e8cbf3601f3e1d7aa4a829b&callback=onLoad";
    var jsapi = document.createElement("script");
    jsapi.charset = "utf-8";
    jsapi.src = url;
    document.head.appendChild(jsapi);
  }
};
</script>

<style lang="less" scoped>
#container {
  width: 500px;
  height: 500px;
  margin: 0 auto;
}
</style>