<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    @close="handleClose"
    :append-to-body="true"
    :modal="true"
    :modal-append-to-body="false"
  >
    <!-- 主要内容插槽 -->
    <slot></slot>

    <!-- 底部按钮区域 -->
    <div slot="footer" class="dialog-footer" :style="{ justifyContent: btnsPosition }">
      <!-- 自定义按钮插槽 -->
      <slot name="buttons"></slot>

      <!-- 默认按钮 -->
      <el-button @click="handleCancel" size="small">取消</el-button>
      <el-button type="primary" @click="handleConfirm" size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CustomDialog',

  props: {
    // 控制弹窗显示隐藏
    value: {
      type: Boolean,
      default: false
    },
    // 弹窗标题
    title: {
      type: String,
      default: '提示'
    },
    // 弹窗宽度
    width: {
      type: [String, Number],
      default: '50%',
      validator: function(value) {
        // 检查是否为数字或带有单位的字符串
        if (typeof value === 'number') {
          return true;
        }
        return /^[0-9]+(px|%|vw|vh)$/.test(value);
      }
    },
    btnsPosition: {
      type: String,
      default: 'flex-end'
    }
  },

  computed: {
    dialogVisible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },

  methods: {
    handleClose() {
      this.dialogVisible = false
      this.$emit('close')
    },

    handleCancel() {
      this.$emit('close')
      this.handleClose()
    },

    handleConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
.dialog-footer .el-button {
  margin-left: 12px;
}
</style>
