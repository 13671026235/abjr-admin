<template>
  <Card>
    <div style="padding:10px;">
      <Form ref="form" :model="role" :rules="ruleValidate" :label-width="80">
          <FormItem label="角色编码" prop="roleCode" :error="errors.roleCode">
              <Input type="text" v-model="role.roleCode" placeholder="角色编码" style="width: 400px"/>
          </FormItem>
          <FormItem label="角色名称" prop="roleName">
              <Input type="text" v-model="role.roleName" placeholder="角色名称" style="width: 400px"/>
          </FormItem>
          <FormItem label="描述" prop="description">
              <Input type="text" v-model="role.description" placeholder="描述" style="width: 400px"/>
          </FormItem>
          <FormItem label="状态" prop="status">
              <i-switch v-model="role.status" :true-value="'Y'" :false-value="'N'"></i-switch>
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
      role: {
        status: 'Y'
      },
      ruleValidate: {
        roleCode: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      errors: {}
    }
  },
  methods: {
    save: function (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let opt = {}
          opt.data = {
            roleCode: this.role.roleCode,
            roleName: this.role.roleName,
            description: this.role.description,
            status: this.role.status
          }

          if (this.role.id) {
            opt.url = `/security/role/${this.role.id}`
            opt.method = 'put'
          } else {
            opt.url = '/security/role'
            opt.method = 'post'
          }
          axios
            .request(opt)
            .then(result => {
              this.$Message.success('成功保存！')
              this.back()
            })
            .catch(error => {
              if (error.data && error.data.code === '4000') {
                this.errors = error.data.data
              }
            })
        } else {
          this.$Message.error('请输入正确的角色信息！')
        }
      })
    },
    cancel: function () {
      this.back()
    },
    back: function () {
      this.$router.go(-1)
    },
    getRole (id) {
      axios
        .request({
          method: 'get',
          url: `/security/role/${id}`
        }).then(response => {
          this.role = response.data
        })
    }
  },
  created () {
    if (this.id) {
      this.getRole(this.id)
    }
  },
  watch: {
    $route: function (newValue, oldValue) {
      if (newValue.name === 'role') {
        if (newValue.params.id) {
          this.getRole(newValue.params.id)
        }
      }
    }
  }

}
</script>
