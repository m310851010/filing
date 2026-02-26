<template>
  <div class="checkbox-radio-container" @blur="handleBlur">
    <a-space :direction="direction" wrap>
      <a-checkbox
        v-for="option in options"
        :key="option.value"
        :checked="modelValue === option.value"
        :disabled="disabled"
        @change="handleClick(option.value)"
      >
        {{ option.label }}
      </a-checkbox>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { Form } from 'ant-design-vue';

// 1. 定义组件名
defineOptions({
  name: 'CheckboxRadio'
});

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  modelValue: string | number | null | undefined;
  options: Option[];
  allowClear?: boolean;
  direction?: 'horizontal' | 'vertical';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  allowClear: false,
  direction: 'horizontal',
  disabled: false
});

const emit = defineEmits(['update:modelValue', 'change', 'blur']);

// 2. 注入 Ant Design 的表单上下文
// 这允许自定义组件直接告诉 a-form-item：“我的值变了，请重新校验”
const formItemContext = Form.useInjectFormItemContext();

const handleClick = (clickedValue: string | number) => {
  if (props.disabled) return;

  let newValue: string | number | null = clickedValue;

  if (props.modelValue === clickedValue) {
    if (props.allowClear) {
      newValue = null;
    } else {
      return; // 不允许取消，则不做操作
    }
  }

  // 更新值
  emit('update:modelValue', newValue);
  emit('change', newValue);
  
  // 3. 核心：通知 Ant Design Form 进行校验
  // 必须在 emit 之后执行，或者使用 nextTick
  formItemContext.onFieldChange();
};

const handleBlur = () => {
  emit('blur');
  formItemContext.onFieldBlur();
};
</script>

<style scoped>

</style>