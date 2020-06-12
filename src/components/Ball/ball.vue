<template>
    <div class="ball-wrap" @click="taggle">
        <div class="ball-wrap-text" :class="isTaggle?'text-left':'text-right'">
            <span>如有疑问请咨询{{name}}</span></br>
            <span>电话：{{tel}}</span>
        </div>
        <img src="./imgs/kefu.png" alt="" :class="isTaggle?'rotate-left':'rotate-right'">
    </div>
</template>

<script>
export default {
    data () {
        return {
            isTaggle: false,
            name: '--',
            tel: '--'
        }
    },
    methods: {
        getData () {
            this.$http.get('/lookup/lookList?LookupName=tel').then(res => {
                if (res.code === 200) {
                    const data = res.data[0] || {}
                    this.name = data.lookupDisplay
                    this.tel = data.lookupCode
                } else {
                    this.$error({
                        title: '出错了',
                        content: res.msg
                    })
                }
            })
        },
        taggle () {
            this.isTaggle = !this.isTaggle
        }
    },
    mounted () {
        this.getData()
    }
}
</script>

<style scoped lang="less">
.ball-wrap {
    position: fixed;
    right: 11px;
    bottom: 30px;
    z-index: 1000;
    cursor: pointer;
    &-text {
        position: absolute;
        top: 0;
        right: 28px;
        width: 220px;
        height: 56px;
        background: rgba(0, 0, 0, 0.65);
        border-radius: 28px 0 0 28px;
        z-index: 1;
        color: #fff;
        padding: 10px 0;
        padding-left: 28px;
        overflow: hidden;
        &.text-left {
            width: 0;
            animation: textleft 1s ease-in-out;
        };
        &.text-right {
            animation: textright 1s ease-in-out;
        };
        span {
            line-height: 20px;
        }
    };
    img {
        position: relative;
        z-index: 2;
        width: 56px;
        &.rotate-left {
            transform: scale(0.7);
            animation: rotateleft 1s linear;
        };
        &.rotate-right {
            animation: rotateright 1s linear;
        };
    };
    @keyframes rotateleft
    {
        from {
            transform: rotate(0deg) scale(1);
        };
        to {
            transform: rotate(720deg) scale(0.7);
        }
    };
    @keyframes rotateright
    {
        from {
            transform: rotate(720deg) scale(0.7);
        };
        to {
            transform: rotate(0deg) scale(1);
        }
    };
    @keyframes textleft
    {
        from {
            width: 220px;
        };
        to {
            width: 0;
        }
    };
    @keyframes textright
    {
        from {
            width: 0;
        };
        to {
            width: 220px;
        }
    };
}
</style>
