import Main from '@/modules/common/main'

export default {
  path: '/monitor',
  name: 'monitor',
  meta: {
    icon: 'md-menu',
    title: '系统监控'
  },
  component: Main,
  children: [
    {
      path: 'op-log',
      name: 'opLog',
      meta: {
        icon: 'arrow-graph-up-right',
        title: '操作日志'
      },
      component: () => import('@/modules/monitor/op-log')
    }
  ]
}
