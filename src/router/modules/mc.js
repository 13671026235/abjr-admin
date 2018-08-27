import Main from '@/modules/common/main'

export default {
  path: '/mc',
  name: 'mc',
  meta: {
    icon: 'md-menu',
    title: '消息中心'
  },
  component: Main,
  children: [
    {
      path: 'task-list',
      name: 'task-list',
      meta: {
        icon: 'arrow-graph-up-right',
        title: '任务管理'
      },
      component: () => import('@/modules/mc/task')
    }, {
      path: 'sms-total-report',
      name: 'sms-total-report',
      meta: {
        icon: 'arrow-graph-up-right',
        title: '短信发送情况汇总表'
      },
      component: () => import('@/modules/mc/report')
    }
  ]
}
