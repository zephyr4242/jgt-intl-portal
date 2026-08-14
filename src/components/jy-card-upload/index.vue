<template>
  <div>
    <el-upload
      v-if="!previewUrl"
      ref="upload"
      :disabled="disabled"
      drag
      action=""
      :auto-upload="false"
      list-type="picture-card"
      :on-change="onUploadChange"
      :on-remove="onRemove"
      :file-list="fileList"
      :before-upload="checkValid"
      class="jy-card-upload"
      :class="{ uploadDisabled: uploadDisabled }"
      :limit="1"
    >
      <i class="el-icon-plus"></i>
      <div class="el-upload__text">
        {{ isFront ? "证件正面" : "证件反面" }}
      </div>
    </el-upload>
    <div style="position: relative" v-else>
      <el-image
        style="width: 144px; height: 80px"
        :src="previewUrl"
        :preview-src-list="[previewUrl]"
      >
      </el-image>

      <el-button
        type="danger"
        icon="el-icon-delete"
        circle
        style="position: absolute; top: 0; right: 0; padding: 3px 6px"
        size="mini"
        class="upload-del-btn"
        v-if="showDelete"
        @click="removeImg"
      ></el-button>
    </div>
  </div>
</template>

<script>
// 接口
import { fapFileUpload, fapFileDownload } from '@/api/intl/legacy/fofund-fap'

// 10 Mb
export default {
  name: 'jy-card-upload',

  props: {
    show: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否禁止上传
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },

    isFront: {
      type: Boolean,
      required: false,
      default: true
    },

    // 默认id
    id: {
      type: String,
      required: false
    },

    showDelete: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  watch: {
    id () {
      this.downloadImg()
    },
    show (val) {
      if (val === true) {
        this.downloadImg()
      } else {
        this.removeImg()
      }
    }
  },

  data () {
    return {
      fileList: [],
      uploadDisabled: false,
      previewUrl: ''
    }
  },

  async mounted () {
    this.downloadImg()
  },

  methods: {
    checkValid (file) {
      const isPicutre = ['image/png', 'image/jpeg'].includes(file.raw.type)
      const isLt10M = file.size < this.util.FILE_SIZE_LIMIT

      if (!isPicutre) {
        this.$message.error('文件格式不支持,请重新上传')
        return false
      }
      if (!isLt10M) {
        this.$message.error('文件不能超过 10M')
        return false
      }
      return isPicutre && isLt10M
    },
    async onUploadChange (file, fileList) {
      if (this.checkValid(file)) {
        // 文件合法时,用新的文件覆盖
        this.fileList = fileList.slice(-1)

        let image = new Image()
        image.src = URL.createObjectURL(file.raw)
        image.onload = async () => {
          const formData = new FormData()
          if (file.size > this.util.FILE_SIZE_LIMIT / 10 && window.CONFIG.IS_COMPRESS) {
            // 大于等于1M时，通过canvas按照0.2倍率压缩到500KB左右
            let blobImgFile = this.util.compressUpload(image, file.raw)
            formData.append('file', blobImgFile.file, blobImgFile.name)
          } else {
            // 小于1M时不压缩
            formData.append('file', file.raw)
          }

          this.uploadDisabled = true // 隐藏后续加号

          // 发送请求
          const data = await fapFileUpload(formData, {
            'content-type': 'multipart/form-data',
            menuName: encodeURI('操作员信息管理')
          })

          this.$message.success('导入成功')
          this.$emit('fileChanged', data.fileId)
        }
      } else {
        // 文件非法时,清除fileList
        this.fileList = []
        this.$emit('fileChanged')
        this.uploadDisabled = false
      }
    },

    removeImg () {
      this.previewUrl = null
      this.onRemove()
    },

    onRemove () {
      this.fileList = []
      this.uploadDisabled = false
      this.$emit('fileChanged')
    },

    async downloadImg () {
      this.previewUrl = null

      if (this.util.isEmpty(this.id)) {
        // 无id显示上传组件
        this.previewUrl = null
        this.fileList = []
        this.uploadDisabled = false
      } else {
        const params = { fileId: this.id }

        const data = await fapFileDownload({
          params,
          responseType: 'blob'
        })

        // this.$emit('fileChanged', this.id)

        let reader = new window.FileReader()
        // 使用readAsArrayBuffer读取文件, result属性中将包含一个 ArrayBuffer 对象以表示所读取文件的数据
        reader.readAsArrayBuffer(data)
        reader.onload = (e) => {
          const result = e.target.result
          // const contentType = data.type
          // 生成blob图片,需要参数(字节数组, 文件类型) 目前强转jpeg
          const blob = new Blob([result], { type: 'image/jpeg' })
          // 使用 Blob 创建一个指向类型化数组的URL, URL.createObjectURL是new Blob文件的方法,可以生成一个普通的url,可以直接使用,比如用在img.src上
          const url = window.URL.createObjectURL(blob)
          this.previewUrl = url
        }
      }
    }
  }
}
</script>

<style lang="scss">
.jy-card-upload {
  width: 144px;
  height: 80px;

  // 上传附件框
  div.el-upload-dragger,
  div.el-upload--picture-card {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    @include backgroundColor(A11);
    i {
      font-size: 14px;
      color: #838383;
    }
  }

  div.el-upload--picture-card {
    border: none;
    @include backgroundColor(A11);
    .el-upload-dragger{
      @include borderColor(A16, 1);
      &:hover{
        @include borderColor(A10, 1);
      }
    }
  }
  .el-upload-list--picture-card li.el-upload-list__item {
    width: 100%;
    height: 100%;
    border: 1px dashed #c0c0c0;
  }
  .el-upload-list--picture-card li.el-upload-list__item:hover,
  div.el-upload--picture-card:hover {
    border-color: #a08d79;
  }

  .el-upload--picture-card:hover,
  .theme-web .el-upload:focus {
    border-color: #a08d79;
    color: #a08d79;
  }

  .el-upload-dragger div.el-upload__text {
    color: #838383;
    line-height: 30px;
  }

  div.el-upload__tip {
    font-size: 12px;
    color: #838383;
    line-height: 18px;
  }
  div.el-upload-dragger:hover {
    border-color: #a08d79;
  }
  .disabled div.el-upload--picture-card {
    display: none;
  }
}

// .el-upload--picture-card 控制加号部分
.uploadDisabled .el-upload--picture-card {
  display: none !important;
}
</style>
<style lang="scss" scoped>
.el-button--danger{
  color:#fff
}
</style>
