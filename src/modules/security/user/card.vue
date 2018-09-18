<template>
  <Card>
    <div style="padding:10px;">
      <!--查询条件表单-->
          <Form ref="form" :model="user" :rules="ruleValidate" label-position="left" :label-width="80">
              <FormItem label="用户名" prop="username" :error="errors.username">
                  <Input type="text" v-model="user.username" placeholder="用户名" style="width: 400px"/>
              </FormItem>
              <FormItem label="密码" prop="password">
                  <Input type="password" v-model="user.password" :placeholder="passwordPlaceholder" style="width: 400px"/>
              </FormItem>
              <FormItem label="姓名" prop="realname">
                  <Input type="text" v-model="user.realname" placeholder="姓名" style="width: 400px"/>
              </FormItem>
              <FormItem label="手机号" prop="mobile">
                  <Input type="text" v-model="user.mobile" placeholder="手机号" style="width: 400px"/>
              </FormItem>
              <FormItem label="邮箱" prop="email">
                  <Input type="text" v-model="user.email" placeholder="邮箱" style="width: 400px"/>
              </FormItem>
              <FormItem label="状态" prop="status">
                  <i-switch v-model="user.status" :true-value="'Y'" :false-value="'N'"/>
              </FormItem>
              <FormItem>
                <div class="inline-space">
                  <Button type="primary" @click="save('form')">保存</Button>
                  <Button @click="cancel()">取消</Button>
                </div>
              </FormItem>
          </Form>
    </div>
  </Card>
</template>

<script type="text/javascript">

import axios from '@/libs/api.request'

export default {
  props: { id: String },
  data () {
    return {
      user: {
        status: 'Y'
      },
      ruleValidate: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        realname: [{ message: '请输入姓名', trigger: 'blur' }],
        email: [ { type: 'email', message: '无效邮箱地址', trigger: 'blur' } ],
        mobile: [ {
          type: 'string',
          pattern: '^1[0-9]{10}$',
          message: '无效手机号',
          trigger: 'blur'
        }
        ],
        status: [
          { required: true, message: '请选择用户状态', trigger: 'change' }
        ]
      },
      errors: {}
    }
  },
  computed: {
    passwordPlaceholder: function () {
      if (this.user.id) {
        return '空值将保持原密码'
      } else {
        return '密码'
      }
    }
  },
  methods: {
    save: function (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let opt = {}
          opt.data = {
            username: this.user.username,
            password: this.user.password,
            realname: this.user.realname,
            mobile: this.user.mobile,
            status: this.user.status
          }
          if (this.user.id) {
            opt.url = `/security/user/${this.user.id}`
            opt.method = 'put'
          } else {
            opt.url = `/security/user`
            opt.method = 'post'
          }
          axios
            .request(opt)
            .then(result => {
              this.$Message.success('成功保存！')
              this.back()
            })
        } else {
          this.$Message.error('请输入正确的用户信息！')
        }
      })
    },
    cancel: function () {
      this.back()
    },
    back: function () {
      this.$router.go(-1)
    },
    getUser (id) {
      axios.request({
        method: 'get',
        url: `/security/user/${id}`
      }).then(response => {
        this.user = response.data
      })
    }
  },
  created () {
    if (this.id) {
      this.getUser(this.id)
    } else {
      this.ruleValidate.password = [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    }
  },
  watch: {
    $route: function (newValue, oldValue) {
      if (newValue.name === 'user') {
        this.getUser(newValue.params.id)
      }
    }
  }
}
</script>
