<template>
  <Card>
    <div style="padding:10px;">
      <Form ref="form" :model="permission" :rules="ruleValidate" :label-width="80">
          <FormItem label="权限编码" prop="permissionCode" :error="errors.permissionCode">
              {{permissionCode}}
          </FormItem>
          <FormItem label="权限名称" prop="permissionName">
              <Input type="text" v-model="permission.permissionName" placeholder="权限名称" style="width: 400px"/>
          </FormItem>
          <FormItem label="资源编码" prop="resourceCode">
              <Input type="text" v-model="permission.resourceCode" placeholder="资源编码" style="width: 400px"/>
          </FormItem>
          <FormItem label="动作编码" prop="actionCode">
              <Input type="text" v-model="permission.actionCode" placeholder="动作编码" style="width: 400px"/>
          </FormItem>
          <FormItem label="描述" prop="description">
              <Input type="text" v-model="permission.description" placeholder="描述" style="width: 400px"/>
          </FormItem>
          <FormItem label="状态" prop="status">
              <i-switch v-model="permission.status" :true-value="'Y'" :false-value="'N'"></i-switch>
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
      permission: {
        status: 'Y'
      },
      ruleValidate: {
        resourceCode: [
          { required: true, message: '请输入资源编码', trigger: 'blur' }
        ],
        permissionName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      errors: {}
    }
  },
  'computed': {
    'permissionCode': function () {
      if (this.permission.resourceCode && this.permission.actionCode) {
        return this.permission.resourceCode + ':' + this.permission.actionCode
      } else if (this.permission.resourceCode) {
        return this.permission.resourceCode
      }
    }
  },
  methods: {
    save: function (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let opt = {}
          opt.data = {
            permissionName: this.permission.permissionName,
            resourceCode: this.permission.resourceCode,
            actionCode: this.permission.actionCode,
            description: this.permission.description,
            status: this.permission.status
          }

          if (this.permission.id) {
            opt.url = `/security/permission/${this.permission.id}`
            opt.method = 'put'
          } else {
            opt.url = '/security/permission'
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
          this.$Message.error('请输入正确的权限信息！')
        }
      })
    },
    cancel: function () {
      this.back()
    },
    back: function () {
      this.$router.go(-1)
    },
    getPermission (id) {
      axios
        .request({
          method: 'get',
          url: `/security/permission/${id}`
        }).then(response => {
          this.permission = response.data
        })
    }
  },
  created () {
    if (this.id) {
      this.getPermission(this.id)
    }
  },
  watch: {
    $route: function (newValue, oldValue) {
      if (newValue.name === 'permission') {
        this.getPermission(newValue.params.id)
      }
    }
  }
}
</script>
