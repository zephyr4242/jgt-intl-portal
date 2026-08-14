<template>
  <div class="jy-preview-mask-container" @click="hide" v-show="visible">
    <div class="jy-preview-mask-viewer" @click.prevent>
      <JyPreview v-if="option" :option="option" @fileNameReturned="fileNameReturned"
        @fileTypeReturned="fileTypeReturned" @hide="hide"/>
    </div>
    <div class="jy-preview-mask-close" @click="hide" v-show="!isImage">
      <i class="el-icon-close"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'jy-preview-mask',
  data () {
    return {
      visible: false,
      option: null,
      isImage: false,
      isCurrent: false

    }
  },
  methods: {
    show () {
      this.setVisible(true)
    },
    hide () {
      this.setVisible(false)
      this.isImage = false
    },
    setVisible (visible) {
      this.visible = visible
    },

    fileNameReturned (name) {},

    fileTypeReturned (type) {
      if (type === 'image') {
        this.isImage = true
      } else if (type === 'pdf') {
        this.isImage = false
        this.hide()
        // 使用新页面预览pdf
        if (this.isCurrent) {
          this.visible = true
        } else {
          this.util.filePreview(this.option)
        }
      } else {
        this.hide()
      }
    }

  }

}
</script>

<style lang="scss" scoped>
.jy-preview-mask-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba($color: #000000, $alpha: 0.5);
  z-index: 3000;
  display: flex;

  align-items: center;

  .jy-preview-mask-viewer {
    width: 80%;
    height: 88%;
    margin: 0 auto;
    padding-top: 60px;
  }

  .jy-preview-mask-close {
    font-size: 32px;
    position: fixed;
    top: 12px;
    right: 12px;
    color: #fff;
    width: 48px;
    height: 48px;
    text-align: center;
    border-radius: 24px;
    cursor: pointer;
    i.el-icon-close {
      vertical-align: sub;
    }
    &:hover {
      background: #838383;
    }
  }
}
</style>
