<template>
  <swiper :options="swiperOption" ref="mySwiper">
    <swiper-slide v-for="(item, index) in bannerList" :key="index">
      <img style="width:100%" :src="getURL(item.lookupDisplay)" alt="" @click="openToLink(item.lookupCode)"/>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'Banner',
  components: {
    swiper, swiperSlide
  },
  data() {
    return {
      bannerList: [],
      swiperOption: {
        autoplay: true,
        pagination: {
          el: '.swiper-pagination'
        },
        // some swiper options...
      }
    }
  },
  watch: {
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted() {
  },
  created() {
    this.$http.get('/lookup/lookList?LookupName=banner').then(res => {
      if (res.code === 200) {
        this.bannerList = res.data || []
        // this.bannerList = data.map((item) => {
        //   item.imgSrc = this.getURL(item.lookupDisplay)
        //   return item
        // })
        // data.forEach((item, index) => {
        //   const img = new Image()
        //   img.src = this.getURL(item.lookupDisplay)
        //   img.onload = () => {
        //     item.imgSrc = this.getBase64Image(img).dataURL
        //     this.bannerList.push(item)
        //   }
        // })
      }
    })
  },
  methods: {
    openToLink(url) {
      window.open(url)
    },
    getURL(url) {
      return process.env.VUE_APP_HOST_URL + url
    },
    getBase64Image(img) {
      const demoCanvas = this.$refs.demoCanvas
      demoCanvas.width = img.width
      demoCanvas.height = img.height
      const ctx = demoCanvas.getContext("2d")
      ctx.drawImage(img, 0, 0, img.width, img.height)
      const ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase()
      const dataURL = demoCanvas.toDataURL("image/" + ext)
      return {
        dataURL: dataURL,
        type: "image/" + ext
      }
  }
  }
}
</script>
<style lang="less" scoped>
</style>