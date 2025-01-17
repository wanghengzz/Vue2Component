<!--
 * @Author:
 * @Date: 2025-01-03 14:46:07
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-15 17:21:51
 * @Description:
 * @FilePath: \vue2-project\src\views\IframeView.vue
-->
<template>
  <div class="iframe-container">
    <h1>Iframe 通信示例Vue2</h1>
    <!-- 添加发送消息的按钮 -->
    <button @click="sendMessageToParent">发送消息给父页面</button>
    <!-- 添加消息显示区域 -->
    <div class="message-box">
      <h3>收到的消息：</h3>
      <p>{{ receivedMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IframeView',

  data() {
    return {
      receivedMessage: '暂无消息'
    };
  },

  mounted() {
    // 监听来自父页面的消息
    window.addEventListener('message', this.handleMessage);
  },

  beforeDestroy() {
    // 组件销毁前移除事件监听
    window.removeEventListener('message', this.handleMessage);
  },

  methods: {
    // 处理来自父页面的消息
    handleMessage(event) {
      if (event.data.type === 'FROM_PARENT') {
        this.receivedMessage = event.data.data;
        console.log('收到父页面消息:', event.data.data);
      }
    },
    // 发送消息给父页面
    sendMessageToParent() {
      console.log(window);

      window.parent.postMessage({
        type: 'FROM_IFRAME',
        data: '这是来自iframe的消息Vue2'
      }, '*');
    },
  },
};
</script>

<style lang="scss" scoped>
.iframe-container {
  padding: 20px;

  .message-box {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
  }
}
</style>
