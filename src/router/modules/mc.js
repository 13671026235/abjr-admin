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
      name: 'taskList',
      meta: {
        icon: 'arrow-graph-up-right',
        title: '消息任务管理'
      },
      component: () => import('@/modules/mc/task')
    }, {
      path: 'task/:id?',
      name: 'task',
      props: true,
      meta: {
        icon: 'arrow-graph-up-right',
        title: '消息任务',
        hideInMenu: true
      },
      component: () => import('@/modules/mc/task/card.vue')
    }, {
      path: 'task-running-info/:id?',
      name: 'taskRunningInfo',
      props: true,
      meta: {
        icon: 'arrow-graph-up-right',
        title: '消息发送详情',
        hideInMenu: true
      },
      component: () => import('@/modules/mc/task/task-running-info.vue')
    }, {
      path: 'sms-total-report',
      name: 'smsTotalReport',
      meta: {
        icon: 'arrow-graph-up-right',
        title: '短信发送情况汇总表'
      },
      component: () => import('@/modules/mc/report')
    }
  ]
}
