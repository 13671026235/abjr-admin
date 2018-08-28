<template>
  <Modal v-model="visible" title="分配权限" width="600">
      <div slot="footer">
          <Button type="text" size="large" @click="close">取消</Button>
          <Button type="primary" size="large" @click="assignPermission">分配</Button>
      </div>
      <Transfer
          :data="permissionList"
          :target-keys="selectedPermissionIdList"
          :render-format="renderPermission"
          :list-style="{'width': '250px','height': '280px'}"
          :titles="['可分配权限','已分配权限']"
          @on-change="handleTransfer"></Transfer>
  </Modal>
</template>

<script>

import axios from '@/libs/api.request'

export default {
  name: 'assign-permission-dialog',
  props: {
    role: Object,
    visible: Boolean
  },
  data () {
    return {
      permissionList: [],
      selectedPermissionIdList: []
    }
  },
  methods: {
    initPermissionList: function () {
      axios.request({
        method: 'get',
        url: '/rbac/permission'
      }).then(response => {
        for (let permission of response.data.list) {
          permission.key = '' + permission.id
        }
        this.permissionList = response.data.list
      })
    },
    initSelectedPermissionIdList () {
      axios.request({
        method: 'get',
        url: `/rbac/role/${this.role.id}/permission`
      }).then(response => {
        var selectedIds = []
        for (var i in response.data) {
          selectedIds.push('' + response.data[i].permissionId)
        }
        this.selectedPermissionIdList = selectedIds
      })
    },
    assignPermission: function () {
      this.$Modal.confirm({title: '',
        content: '确定保存吗？',
        onOk: () => {
          axios.request({
            method: 'patch',
            url: `/rbac/role/${this.role.id}/permission`,
            data: this.selectedPermissionIdList
          }).then(response => {
            this.$Message.success('成功保存！')
            this.close()
          })
        }})
    },
    renderPermission: function (item) {
      return item.permissionCode + ' ' + item.permissionName
    },
    handleTransfer: function (newTargetKeys) {
      this.selectedPermissionIdList = newTargetKeys
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
        this.initPermissionList()
        this.initSelectedPermissionIdList()
      }
    }
  }

}
</script>
