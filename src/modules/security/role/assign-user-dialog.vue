<template>
  <Modal v-model="visible" title="分配用户" width="600">
      <div slot="footer">
          <Button type="text" size="large" @click="close">取消</Button>
          <Button type="primary" size="large" @click="assignUser">分配</Button>
      </div>
      <Transfer
          :data="userList"
          :target-keys="selectedUserIdList"
          :render-format="renderUser"
          :list-style="{'width': '250px','height': '280px'}"
          :titles="['可分配用户','已分配用户']"
          @on-change="handleTransferUser"></Transfer>
  </Modal>
</template>

<script>

import axios from '@/libs/api.request'

export default {
  name: 'assign-user-dialog',
  props: {
    role: Object,
    visible: Boolean
  },
  data () {
    return {
      userList: [],
      selectedUserIdList: []
    }
  },
  methods: {
    initUserList: function () {
      axios.request({
        method: 'get',
        url: '/security/user'
      }).then(response => {
        for (let user of response.data.list) {
          user.key = '' + user.id
        }
        this.userList = response.data.list
      })
    },
    initSelectedUserIdList () {
      axios.request({
        method: 'get',
        url: `/security/role/${this.role.id}/user`
      }).then(response => {
        var selectedIds = []
        for (var i in response.data) {
          selectedIds.push('' + response.data[i].userId)
        }
        this.selectedUserIdList = selectedIds
      })
    },
    assignUser: function () {
      this.$Modal.confirm({title: '',
        content: '确定保存吗？',
        onOk: () => {
          axios.request({
            method: 'patch',
            url: `/security/role/${this.role.id}/user`,
            data: this.selectedUserIdList
          }).then(response => {
            this.$Message.success('成功保存！')
            this.close()
          })
        }})
    },
    renderUser: function (item) {
      if (item.realname) {
        return item.username + ' ' + item.realname
      } else {
        return item.username
      }
    },
    handleTransferUser: function (newTargetKeys) {
      this.selectedUserIdList = newTargetKeys
    },
    close: function () {
      this.$emit('close')
    }
  },
  watch: {
    role: function (val, oldVal) {
      if (val && oldVal && val.id === oldVal.id) {
        return
      }
      if (val) {
        this.initUserList()
        this.initSelectedUserIdList()
      }
    }
  }

}
</script>
