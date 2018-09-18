<template>
  <card>
    <Form :model="condition" :label-width="90" inline>
        <Row>
            <FormItem label="字典类型">
                <Select v-model="condition.category" style="width:200px" @on-change="search(1)">
                    <Option :value="category.code" :key="category.code" v-for="category in dictCategory">{{category.name}}</Option>
                </Select>
            </FormItem>
        </Row>
        <Row style="padding:10px 0"  class="inline-space">
            <Button type="primary" icon="ios-plus-outline" @click="addDictItem()">新增</Button>
            <Button type="primary" icon="ios-minus-outline" @click="deleteDictItem()">删除</Button>
        </Row>
    </Form>

    <Table highlight-row border stripe :columns="tableColumns" :data="dictItemRecordList" @on-current-change="changeCurrentRow"></Table>
    <div class="clearfix">
        <Page :current="condition.pageNum" :total="dictItemList.total" :page-size="condition.pageSize" show-sizer style="margin-top:5px;float:right" @on-page-size-change="changePageSize" @on-change="goPage"></Page>
    </div>
  </card>
</template>

<script>

import moment from 'moment'
import axios from '@/libs/api.request'

export default {
  data () {
    return {
      'condition': {
        'pageNum': 1,
        'pageSize': 10
      },
      'currentItem': null,
      'dictCategory': [],
      'dictItemList': {},
      'tableColumns': [
        {
          'title': '#',
          'width': 60,
          'render': (h, params) => {
            let rowNum = (this.condition.pageNum - 1) * this.condition.pageSize + params.index + 1
            return h('span', rowNum)
          }
        }, {
          'title': 'ID',
          'key': 'id',
          'width': 100
        }, {
          'title': '编码',
          'key': 'code',
          'width': 200,
          'render': (h, params) => {
            return h('a',
              {
                on: {
                  click: () => {
                    this.editDictItem(params.row)
                  }
                }
              }
              , params.row.code)
          }
        }, {
          'title': '名称',
          'key': 'name',
          'width': 200,
          'render': (h, params) => {
            return h('a',
              {
                on: {
                  click: () => {
                    this.editDictItem(params.row)
                  }
                }
              }
              , params.row.name)
          }
        }, {
          'title': '创建日期',
          'width': 200,
          'render': function (h, params) {
            if (params.row.createdAt) {
              return moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss')
            }
          }
        }]
    }
  },
  computed: {
    dictItemRecordList: function () {
      return this.dictItemList.list
    }
  },
  methods: {
    'goPage': function (pageNum) {
      this.search(pageNum)
    },
    'findDictCategory': function () {
      axios.request({
        method: 'get',
        url: '/settings/dict-category'
      }).then((response) => {
        this.dictCategory = response.data
      })
    },
    changePageSize: function (pageSize) {
      this.search(this.condition.pageNum, pageSize)
    },
    changeCurrentRow: function (currentRow) {
      this.currentItem = currentRow
    },
    search: function (pageNum, pageSize) {
      let query = {}
      query.category = this.condition.category
      query.pageNum = pageNum
      query.pageSize = pageSize

      this.$router.replace({name: 'dict', query})
    },
    searchEntry: function () {
      let query = {...this.$route.query}
      if (query.pageNum) {
        query.pageNum = parseInt(query.pageNum)
      } else {
        query.pageNum = 1
      }
      if (query.pageSize) {
        query.pageSize = parseInt(query.pageSize)
      } else {
        query.pageSize = 10
      }

      this.condition = query

      axios.request({
        method: 'get',
        url: '/settings/dict-entry/',
        params: query
      }).then((response) => {
        this.dictItemList = response.data
        this.currentItem = null
      })
    },
    reset: function (name) {
      var c = {'pageNum': this.condition.pageNum, 'pageSize': this.condition.pageSize}
      this.condition = c
    },
    addDictItem: function () {
      if (!this.condition.category) {
        this.$Message.warning('请在列表中选择一个字典类型')
        return
      }
      this.$router.push({
        name: 'dictEntry',
        params: {category: this.condition.category}
      })
    },
    deleteDictItem: function () {
      if (!this.currentItem) {
        this.$Message.warning('请在列表中选择一个条目')
        return
      }
      this.$Modal.confirm({title: '',
        content: '确定删除' + this.currentItem.name + '吗？',
        onOk: () => {
          axios.request({
            method: 'delete',
            url: `/settings/dict-entry/${this.currentItem.id}`
          }).then(response => {
            this.$Message.success(this.currentItem.name + '条目已删除！')
            this.searchEntry()
          })
        }})
    },
    editDictItem: function (item) {
      this.$router.push({
        name: 'dictEntry',
        params: {category: this.condition.category, id: '' + item.id}
      })
    }
  },
  created: function () {
    this.findDictCategory()
  },
  watch: {
    '$route': function (newValue, oldValue) {
      if (newValue.name === 'dict') {
        this.searchEntry()
      }
    }
  }
}
</script>
