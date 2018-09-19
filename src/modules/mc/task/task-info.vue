<template>
    <div>
        <Row v-if="task.auditAt"  style="margin-bottom: 16px;">
            <Col span="6">
                <span class="expand-key">审核时间：</span>
                <span class="expand-value">{{task.auditAt?moment(task.auditAt).format("YYYY-MM-DD HH:mm:ss"):''}}</span>
            </Col>
            <Col span="18">
                <span class="expand-key">审核说明：</span>
                <span class="expand-value">{{task.auditDesc}}</span>
            </Col>
        </Row>
         <div v-for="subTask in task.subTasks" v-bind:key="subTask.id">
            <Row style="margin-bottom: 16px;">
                <Col span="6">
                    <span class="expand-key">发送通道：</span>
                    <span class="expand-value" v-if="subTask.sendChannel=='inner'">应用内消息</span>
                    <span class="expand-value" v-if="subTask.sendChannel=='push'">APP推送消息</span>
                    <span class="expand-value" v-if="subTask.sendChannel=='sms'">短信</span>
                    <span class="expand-value" v-if="subTask.sendChannel=='email'">邮件</span>
                </Col>
                <Col span="6">
                    <span class="expand-key">执行状态：</span>
                    <span class="expand-value" v-if="subTask.subTaskStatus=='waiting'">等待中</span>
                    <span class="expand-value" v-if="subTask.subTaskStatus=='running'">执行中</span>
                    <span class="expand-value" v-if="subTask.subTaskStatus=='finish'">执行完成</span>
                </Col>
            </Row>
            <Row style="margin-bottom: 16px;">
                <Col span="24">
                    <span class="expand-key">标题：</span>
                    <span class="expand-value">{{subTask.content.title}}</span>
                </Col>
            </Row>
            <Row style="margin-bottom: 16px;">
                <Col span="24">
                    <span class="expand-key">内容：</span>
                    <span class="expand-value">{{subTask.content.content}}</span>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
export default {
  name: 'task-info',
  props: {
    task: Object
  }
}
</script>
