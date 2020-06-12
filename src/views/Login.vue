<template>
  <div class="login">
    <div class="login-box">
      <div class="header-title"><i class="font_family icon-logo_X title"></i></div>
      <div class="login-form">
        <div>
          <a-form :form="form">
            <a-form-item label="手机号码" v-bind="formItemLayout">
              <a-row :gutter="12">
                <a-col :span="15">
                  <a-input
                    placeholder="请输入接收验证码的手机号"
                    size="large"
                    :disabled="usedPhone"
                    v-decorator="[
                      'phone',
                      {
                        rules: [{ required: true, pattern: /^\d{11}$/, message: '请输入正确的手机号码!' }],
                        validateTrigger: 'blur',
                        initialValue: usedPhone,
                      }
                    ]"
                  />
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item label="验证码" v-bind="formItemLayout">
              <a-row :gutter="12">
                <a-col :span="15">
                  <a-input
                    placeholder="请输入接收到的手机验证码"
                    size="large"
                    v-decorator="[
                      'code',
                      {
                        rules: [{ required: true, pattern: /^\d{4}$/, message: '请输入正确的验证码!' }],
                        validateTrigger: 'blur'
                      }
                    ]"
                  />
                </a-col>
                <a-col :span="9">
                  <a-button
                    type="primary"
                    @click="handleClickCode"
                    :disabled="disabledBtn.code"
                    :loading="loadingBtn.code"
                  >
                    {{ describe }}
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item v-bind="tailFormItemLayout">
              <a-row :gutter="24" class="submit-btn">
                <a-col :span="24">
                  <a-button type="primary" @click="handleClickLoginout">
                    退出
                  </a-button>
                  <a-button
                    type="primary"
                    @click="handleClickLogin"
                    :disabled="disabledBtn.confirm"
                    :loading="loadingBtn.confirm"
                  >
                    登录
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>

    <watermark />
  </div>
</template>

<script>
import Watermark from '@/components/Watermark'
import { logout } from '@/utils/util.js'
import { Modal } from 'ant-design-vue'
import { getLoginCode, getCheckCode } from '@/api/bonusDistributeConfirm'
import { getUsedPhone } from '@/api/login'
export default {
  name: 'Login',
  components: {
    Watermark
  },
  data() {
    return {
      countdown: 120,
      describe: '发送验证码',
      usedPhone: null,
      disabledBtn: {
        code: false,
        confirm: false
      },
      loadingBtn: {
        code: false,
        confirm: false
      },
      form: this.$form.createForm(this, { name: 'coordinated' }),
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 18,
            offset: 6
          }
        }
      }
    }
  },
  async created() {
    const { data } = await getUsedPhone()
    this.usedPhone = data
  },
  methods: {
    //点击登录按钮
    handleClickLogin() {
      this.form.validateFields({ force: true }, (errors, values) => {
        if (!errors) {
          this.sendingCode(values)
        }
      })
    },
    //点击发送验证码按钮
    handleClickCode() {
      this.form.validateFields(['phone'], { force: true }, (errors, values) => {
        if (!errors) {
          this.requestCode(values.phone)
        }
      })
    },
    //请求后台收取手机验证码函数
    requestCode(telphone) {
      this.loadingBtn.code = true
      getLoginCode({ telphone }).then(res => {
        let { code, msg } = res
        if (code === 200 && msg === 'success') {
          this.timer()
          this.$message.success('发送成功')
        } else {
          this.$message.warning(msg)
        }
        this.loadingBtn.code = false
      })
    },
    //请求后台发送手机号码和验证吗执行登录请求
    sendingCode(val) {
      this.loadingBtn.confirm = true
      let { phone, code } = val
      let { query: { from, to }} = this.$route

      // 目前只支持【员工信息】重定向
      // 其他的登陆都直接定到首页
      let toPage = to === '/login' ? '/' : to // 针对异常登陆
      toPage = to === undefined ? '/' : to // 针对异常重定向

      /* 上线后删除 */
      if (code == '0000') {
        localStorage.setItem('second_login_beacon', code)
        this.$router.push(toPage)
        return
      }

      getCheckCode({
        telphone: phone,
        inCode: code
      }).then(res => {
        let { code, msg } = res
        if (code === 200 && msg === 'success') {
          localStorage.setItem('second_login_beacon', code)
          this.$router.push(toPage)
        } else {
          this.$message.warning(msg)
        }
        this.loadingBtn.confirm = false
      })
    },
    //倒计时的计时器任务
    timer() {
      this.disabledBtn.code = true
      const second = this.countdown
      let task = setInterval(() => {
        this.countdown--
        this.describe = this.countdown + 'S后重发'
        if (this.countdown <= 0) {
          clearInterval(task) //结束计时任务
          this.countdown = second //初始化倒计时秒
          this.disabledBtn.code = false //关闭发送验证码的btn按钮的禁用开关
          this.describe = '重新发送' //按钮的描述文字变化
        }
      }, 1000)
    },
    //退出SSO的登录
    handleClickLoginout() {
      Modal.confirm({
        title: '提示！',
        content: '请确认是否需要退出登录?',
        onOk: () => {
          //退出登录，删除缓存后跳转到登录页面
          logout()
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style lang="less">
.login-form {
  .ant-form label {
    font-size: 16px;
  }
  input.ant-input {
    font-size: 16px;
  }
}
</style>
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  background: #f7f8fb;
  .login-box {
    margin-top: 100px;
    width: 46rem;
    height: 28rem;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 3px 6px #00000022;
    .header-title {
      text-align: center;
      background: #00cf61;
      height: 4.68rem;
      line-height: 4.68rem;
      box-shadow: 0 1px 8px #00000044;
      i {
        color: #fff;
        font-size: 2.21rem;
      }
    }
    .login-form {
      padding: 0 50px;
      height: calc(100% - 4.68rem);
      display: flex;
      align-items: center;
      > div {
        width: 100%;
      }
      .submit-btn {
        button {
          min-width: 85px;
          margin-right: 12px;
        }
      }
    }
  }
}
</style>
