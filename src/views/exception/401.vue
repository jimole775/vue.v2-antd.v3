<template>
  <exception-page type="401" :from="from"/>
</template>

<script>
import { ExceptionPage } from '@/components'

export default {
  components: {
    ExceptionPage
  },
  data: {
    from: '/'
  },
  created(){
    this.from = this.$route.query.from
  }
}
</script>

<style scoped>

</style>
