<template>
    <div class="watermark" id="pagewatermark"></div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import watermark from 'watermark-dom'
export default {
    name:'watermark',
    data() {
        return {
            
        }
    },
    computed: {
        ...mapState({
			user :  state => state.user
		}),
    },
    created(){
        this.$nextTick(() => {
			watermark.load({ 
				watermark_txt: `${this.user.nickName}${this.user.userId}` ,
				watermark_x:-80,                    //水印起始位置x轴坐标
				watermark_y:-50,                      //水印起始位置Y轴坐标
				watermark_color:'#A0A4AC',			//水印字体颜色
				watermark_fontsize:'14px',			//水印字体大小
				watermark_alpha:0.12,				//水印透明度，要求设置在大于等于0.005
				watermark_angle:30,					//水印倾斜度数
				watermark_width:150,                //水印宽度
				watermark_height:130,				//水印长度
				watermark_x_space:30,              //水印x轴间隔
				watermark_y_space:50,               //水印y轴间隔
				watermark_parent_node: 'pagewatermark'
			})
		})
    }
}
</script>

<style lang="less" scoped>
.watermark{
	position: fixed;
	height:120vh;
	width:120vw;
	top:0;
	left:0;
	z-index:99999;
	overflow: hidden;
	pointer-events: none;
}
</style>