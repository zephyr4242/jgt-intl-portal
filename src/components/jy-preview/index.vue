<template>
  <div class="jy-preview">
    <!-- pdf预览 -->
    <jy-pdf :pdfOption="pdfOption" v-if="isPDF" />

    <!-- 图片预览 -->
    <el-image-viewer v-if="isImage"
      :on-close="imageClose"
      :url-list="images"
      :z-index="9999"
    />
  </div>
</template>

<script>
import { commonFileDownload, authorDownload } from '@/api/intl/legacy/bus-jgt-common'
import { accountFileDownload, minioFileDownload } from '@/api/intl/legacy/bus-jgt-account'
import { billDownload } from '@/api/intl/legacy/bus-jgt-trade'

import { etsDownload } from '@/api/intl/legacy/ets-portal'

import jyPdf from '@/components/jy-pdf'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

// https://n6ikj6ymiv.feishu.cn/docx/JD2mdaI9roR1uRxeMqycRgAyn5g
export default {
  name: 'jy-file-preview',
  components: { jyPdf, ElImageViewer },
  props: {
    option: {
      type: Object,
      required: true,
      loading: false
    }
  },
  data () {
    return {
      fileId: null,
      isPDF: false,
      pdfOption: {},

      isImage: false,
      images: []
    }
  },
  mounted () {
    this.getFile()
  },
  methods: {
    async getFile () {
      try {
        if (this.loading) return
        this.loading = true
        const type = this.option.type

        this.fileId = this.option.fileId
        if (this.util.isEmpty(this.fileId)) {
          this.notFound()
          return
        }
        //   判断请求类型
        if (type === 'url') {
          await this.getFileUrl()
        } else if (type === 'common') {
          await this.getFileCommon()
        } else if (type === 'commonAccount') {
          await this.getFileCommonAccount()
        } else if (type === 'minio') {
          await this.getFileMinio()
        } else if (type === 'commonAuthor') {
          await this.getFileCommonAuthor()
        } else if (type === 'ets') {
          await this.getFileEts()
        } else if (type === 'tradeBill') {
          await this.getFileTradeBill()
        }
        this.cb()
      } catch (error) {

      } finally {
        this.loading = false
      }
    },

    // 处理文件链接
    getFileUrl () {
      const url = this.fileId
      if (this.util.isEmpty(this.option?.fileName)) {
        let arr = url.split('/')
        let fileName = arr[arr.length - 1]
        this.option.fileName = decodeURIComponent(fileName)
      }

      this.$emit('fileNameReturned', this.option.fileName)

      if (url.toLowerCase().endsWith('.pdf')) {
        this.$emit('fileTypeReturned', 'pdf')
        this.isPDF = true
        // 标题不显示.pdf 下载时保留.pdf
        const pdfTitle = this.option.fileName.replace(/\.pdf$/, '')
        const fileName = pdfTitle + '.pdf'
        this.$emit('fileNameReturned', pdfTitle)
        this.pdfOption = { pdfUrl: encodeURI(`${url}&fileName=${fileName}`), pdfTitle: pdfTitle }
      } else if (['.png', '.jpeg', '.jpg', '.svg', '.webp'].find(i => url.toLowerCase().endsWith(i))) {
        this.$emit('fileTypeReturned', 'image')
        this.isImage = true
        this.images = [url]
      } else {
        // 下载文件
        this.$emit('fileTypeReturned', 'other')
        this.util.urlDownload(url, this.option.fileName)
      }

      this.cb()
    },

    cb () {
      if (this.option.cb && typeof this.option.cb === 'function') {
        this.option.cb()
      }
    },

    async getFileCommon () {
      try {
        const data = await commonFileDownload({
          params: { fileId: this.fileId },
          responseType: 'blob',
          useRemoteFileName: true
        })

        await this.handleBlob(data)
        this.cb()
      } catch (error) {
        this.notFound()
      }
    },

    async getFileCommonAccount () {
      try {
        const data = await accountFileDownload({
          params: { fileId: this.fileId },
          responseType: 'blob',
          useRemoteFileName: true
        })

        await this.handleBlob(data)
        this.cb()
      } catch (error) {
        this.notFound()
      }
    },

    async getFileMinio () {
      try {
        const data = await minioFileDownload({ fileId: this.fileId })
        await this.handleBlob(data)
        this.cb()
      } catch (error) {
        this.notFound()
      }
    },

    async getFileTradeBill () {
      try {
        const data = await billDownload({ fileId: this.fileId })
        await this.handleBlob(data)
        this.cb()
      } catch (error) {
        this.notFound()
      }
    },

    async getFileCommonAuthor () {
      try {
        const data = await authorDownload({
          // 必须使用params  只有fileId无法调用
          params: { ...this.option.params },
          responseType: 'blob',
          useRemoteFileName: true,
          onDownloadProgress: this.option.onDownloadProgress || null
        })

        await this.handleBlob(data)
        this.cb()
      } catch (error) {
        this.notFound()
      }
    },

    async getFileEts () {
      try {
        const data = await etsDownload({
          params: { fileId: this.fileId },
          responseType: 'blob',
          useRemoteFileName: true
        })

        await this.handleBlob(data)
        this.cb()
      } catch (error) {
        this.notFound()
      }
    },

    // 处理流
    handleBlob (blob) {
      console.log(blob)
      if (!blob || !blob.fileName) {
        this.notFound()
        return
      }

      let fileName
      try {
        // 如果能decode 则执行decode
        fileName = decodeURIComponent(blob.fileName)
      } catch (error) {
        // 否则使用原始文件名
        fileName = blob.fileName
      }
      let type = blob.blob.type

      this.$emit('fileNameReturned', fileName)

      if (fileName.toLowerCase().endsWith('.pdf') || type === 'application/pdf') {
        type = 'application/pdf'
        this.$emit('fileTypeReturned', 'pdf')
        this.$emit('fileNameReturned', fileName.replace('.pdf', ''))
      } else if (type.startsWith('image/')) {
        // 图片文件不处理
        this.$emit('fileTypeReturned', 'image')
      } else if (['.png', '.jpeg', '.jpg', '.svg', '.webp'].find(i => fileName.toLowerCase().endsWith(i))) {
        // 图片文件 未传type 补一个
        type = 'image/jpeg'
        this.$emit('fileTypeReturned', 'image')
      } else {
        this.$emit('fileTypeReturned', 'other')
      }

      // 生成文件链接
      const url = window.URL.createObjectURL(blob.blob, { type: type })

      if (type === 'application/pdf') {
        // 处理pdf
        this.isPDF = true
        this.pdfOption = { pdfUrl: encodeURI(`${url}&fileName=${fileName}`), pdfTitle: fileName }
      } else if (type.startsWith('image/')) {
        // 处理图片
        this.isImage = true
        this.images = [url]
      } else {
        // 下载流文件
        this.util.blobDownload(blob.blob, fileName)
      }
    },

    notFound () {
      this.$message.error('未找到该文件')
      this.$emit('hide')
    },

    imageClose () {
      this.isImage = false
      this.$emit('hide')
    }
  }

}
</script>

<style lang="scss" scope>
.jy-preview {
  height: 100%;
}
</style>
