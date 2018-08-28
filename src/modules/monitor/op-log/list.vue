<template>
  <Card>
    <Form ref="condition" :model="condition" label-position="right" :label-width="60" inline>
        <Row>
            <FormItem label="操作人">
                <Input type="text" v-model="condition.operatorName" placeholder="操作人" style="width: 100px"/>
            </FormItem>
            <FormItem label="操作行为">
                <Input type="text" v-model="condition.opAction" placeholder="操作行为" style="width: 100px"/>
            </FormItem>
            <FormItem label="操作资源">
                <Input type="text" v-model="condition.opResource" placeholder="操作类型" style="width: 100px"/>
            </FormItem>
            <FormItem label="操作实例">
                <Input type="text" v-model="condition.opInstance" placeholder="操作实例" style="width: 100px"/>
            </FormItem>
            <FormItem label="日期">
                <DatePicker type="daterange" v-model="temp.daterange" placement="bottom-end" placeholder="日期" style="width: 200px" @on-change="changeDate"></DatePicker>
            </FormItem>
            <FormItem style="float:right">
                <div class="inline-space">
                  <Button type="primary" icon="ios-search" @click="search(1,condition.pageSize)">查 询</Button>
                  <Button icon="ios-refresh-empty" @click="reset()">重置</Button>
                </div>
            </FormItem>
        </Row>
    </Form>

    <Table border stripe :columns="tableColumns" :data="opLogRecordList"></Table>
    <div class="clearfix">
        <Page :current="condition.pageNum" :total="opLogList.total" :page-size="condition.pageSize" show-sizer style="margin-top:5px;float:right" @on-page-size-change="changePageSize" @on-change="goPage"></Page>
    </div>
  </Card>
</template>

<script>

import moment from 'moment'
import axios from '@/libs/api.request'

export default {
  data () {
    return {
      condition: {
        pageNum: 1,
        pageSize: 10
      },
      temp: {daterange: null},
      opLogList: {},
      tableColumns: [{
        'title': '#',
        'width': 60,
        'render': (h, params) => {
          let rowNum = (this.condition.pageNum - 1) * this.condition.pageSize + params.index + 1
          return h('span', rowNum)
        }
      }, {
        'title': '操作人',
        'key': 'operatorName',
        'width': 90
      }, {
        'title': '操作时间',
        'width': 100,
        'render': function (h, params) {
          if (params.row.createdAt) {
            return moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss')
          }
        }
      }, {
        'title': '操作行为',
        'key': 'opAction',
        'width': 90
      }, {
        'title': '操作资源',
        'key': 'opResource',
        'width': 120
      }, {
        'title': '操作实例',
        'key': 'opInstance',
        'width': 120
      }, {
        'title': '操作描述',
        'key': 'description',
        'width': 240
      }, {
        'title': '详细信息',
        'key': 'detail'
      }]
    }
  },
  computed: {
    'opLogRecordList': function () {
      return this.opLogList.list
    }
  },
  methods: {
    changeDate: function (value) {
      this.condition.createdAtBegin = value[0]
      this.condition.createdAtEnd = value[1]
    },
    goPage: function (pageNum) {
      this.search(pageNum, this.condition.pageSize)
    },
    changePageSize: function (pageSize) {
      this.search(this.condition.pageNum, pageSize)
    },
    search: function (pageNum, pageSize) {
      let query = {...this.condition}
      query.pageNum = pageNum
      query.pageSize = pageSize

      this.$router.replace({name: 'opLog', query})
    },
    searchOpLog: function () {
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
        url: '/op-log',
        params: this.condition
      }).then(response => {
        this.opLogList = response.data
      })
    },
    reset: function (name) {
      this.condition = {
        'pageNum': this.condition.pageNum,
        'pageSize': this.condition.pageSize
      }
      this.temp.daterange = null
    }
  },
  created: function () {
    this.searchOpLog()
  },
  watch: {
    '$route': function (newValue, oldValue) {
      if (newValue.name === 'opLog') {
        this.searchOpLog()
      }
    }
  }
}
</script>
