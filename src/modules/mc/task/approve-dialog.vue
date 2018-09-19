<template>
  <Modal v-model="visible" title="拒绝原因" width="600">
      <div slot="footer">
          <Button type="text" size="large" @click="close">取消</Button>
          <Button type="primary" size="large" @click="pass('form')">通过</Button>
          <Button type="primary" size="large" @click="reject('form')">拒绝</Button>
      </div>
      <Form ref="form" :model="rejectDialog" :rules="ruleValidate" >
          <FormItem prop="auditDesc">
              <Input  type="textarea" :rows="4" v-model="rejectDialog.auditDesc"/>
          </FormItem>
      </Form>
  </Modal>
</template>

<script>

import axios from '../api'

export default {
  name: 'approve-dialog',
  props: {
    task: Object,
    visible: Boolean
  },
  data () {
    return {
      rejectDialog: {
        auditDesc: ''
      },
      ruleValidate: {
        auditDesc: [
          { required: true, message: '请输入拒绝原因', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    close: function () {
      this.$emit('close')
    },
    reject: function (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let opt = {
            method: 'post',
            url: `/task/${this.task.id}/approval`,
            data: {
              agreement: false,
              auditDesc: this.rejectDialog.auditDesc
            }
          }

          axios
            .request(opt)
            .then(response => {
              this.$Message.success('任务已被拒绝！')
              var result = response.data
              this.$emit('on-status-change', result.id, result.taskStatus, result.auditDesc)
              this.close()
            })
        }
      })
    },
    pass: function () {
      this.$Modal.confirm({
        title: '',
        content: '通过审核吗？',
        onOk: () => {
          let opt = {
            method: 'post',
            url: `/task/${this.task.id}/approval`,
            data: {
              agreement: true,
              auditDesc: this.rejectDialog.auditDesc
            }
          }

          axios
            .request(opt)
            .then(response => {
              this.$Message.success('任务已审核通过！')
              var result = response.data
              this.$emit('on-status-change', result.id, result.taskStatus, result.auditDesc)
              this.close()
            })
        }
      })
    }
  }
}
</script>
