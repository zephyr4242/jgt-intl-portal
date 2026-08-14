<template>
  <div class="page-404">
    <div class="page-404-block">
      <div class="page-404-doc">您想访问的页面找不到了</div>
      <div class="page-404-back" @click="goBack">返回上一页</div>
    </div>
    <img :src="imageUrl" class="page-404-img" alt="404">
  </div>
</template>

<script>
import themeImage from '@/mixins/themeImage'
export default {
  name: 'elogin',
  mixins: [themeImage],
  data () {
    return {
      imageUrl: ''
    }
  },
  mounted () {
    this.registerThemeImage('imageUrl', `/common/404.png`)
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-404 {
  height: 100%;
  // background: url('~@/../public/image/page/404.png') no-repeat center;
  // background-size:400px;
  position: relative;
  @include backgroundColor(A1);
  .page-404-block{
    text-align: center;
    font-size: 14px;
    position: absolute;
    bottom: 50%;
    right: 50%;
    transform: translate(50%, 180%);
    z-index: 1;
  }
  .page-404-img {
    width: 400px;
    position: absolute;
    bottom: 50%;
    right: 50%;
    transform: translate(50%, 50%);
  }
  .page-404-doc{
    @include color(A8);
  }
  .page-404-back{
    cursor: pointer;
    width: 70px;
    margin:20px auto;
    border-bottom: 1px solid;
    @include color(A3);
    @include borderColor(A3);
  }
}
</style>
