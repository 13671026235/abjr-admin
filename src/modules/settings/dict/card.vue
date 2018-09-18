<template>
  <Card>
    <Form ref="form" :model="dictEntry" :rules="ruleValidate" label-position="left" :label-width="80">
        <FormItem label="类型" prop="category" :error="errors.category">
            {{dictCategory.name}}
        </FormItem>
        <FormItem label="编码" prop="code" :error="errors.code">
            <Input type="text" v-model="dictEntry.code" placeholder="编码" style="width: 600px"/>
        </FormItem>
        <FormItem label="名称" prop="name" :error="errors.name">
            <Input type="text" v-model="dictEntry.name" placeholder="名称" style="width: 600px"/>
        </FormItem>
        <FormItem>
            <div class="inline-space">
              <Button type="primary" @click="save('form')">保存</Button>
              <Button @click="back()">取消</Button>
            </div>
        </FormItem>
    </Form>
  </Card>
</template>

<script>
import axios from '@/libs/api.request'
export default {
  props: {
    id: String,
    category: String
  },
  data () {
    return {
      dictCategory: {},
      dictEntry: {},
      ruleValidate: {
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      errors: {}
    }
  },
  methods: {
    save: function (name) {
      this.$refs[name].validate(valid => {
        if (!valid) {
          this.$Message.error('请输入正确的信息！')
          return
        }

        let opt = {}
        opt.data = {
          category: this.category,
          code: this.dictEntry.code,
          name: this.dictEntry.name
        }

        if (this.id) {
          opt.url = `/settings/dict-entry/${this.id}`
          opt.method = 'put'
        } else {
          opt.url = '/settings/dict-entry'
          opt.method = 'post'
        }
        axios.request(opt).then(response => {
          this.$Message.success('成功保存！')
          this.back()
        }).catch(error => {
          if (error.data && error.data.code === '4000') {
            this.errors = error.data.data
          }
        })
      })
    },
    back () {
      this.$router.go(-1)
    },
    getDictEntry () {
      axios.request({
        method: 'get',
        url: `/settings/dict-entry/${this.id}`
      }).then(response => {
        this.dictEntry = response.data
      })
    },
    getDictCategory () {
      axios.request({
        method: 'get',
        url: '/settings/dict-category',
        params: {code: this.category}
      }).then((response) => {
        if (response.data) {
          this.dictCategory = response.data
        }
      })
    },
    init () {
      this.getDictCategory()
      if (this.id) {
        this.getDictEntry()
      } else {
        this.dictEntry = {}
      }
    }
  },
  created: function () {
    this.init()
  },
  watch: {
    $route: function (newValue, oldValue) {
      if (newValue.name === 'dictEntry') {
        this.init()
      }
    }
  }
}
</script>
