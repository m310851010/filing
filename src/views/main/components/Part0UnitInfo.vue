<template>
  <a-form ref="formRef" :model="formState.unitInfo" :rules="rules" :label-col="{ style: { width: '150px' } }">
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item label="单位类型" name="enterprise_type">
          <a-select v-model:value="formState.unitInfo.enterprise_type" placeholder="请选择单位类型" allowClear>
            <a-select-option value="规上企业">规上企业</a-select-option>
            <a-select-option value="规下单位">规下单位</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import type { FormInstance } from 'ant-design-vue';

  // 定义props，接收父组件传递的unitInfo对象，并添加默认值
  const props = defineProps({
    filingData: {
      type: Object,
      default: () => ({})
    },
    unitInfo: {
      type: Object,
      default: () => ({})
    }
  });

  const rules = {
    enterprise_type: [{ required: true, message: '请选择单位类型' }]
  };

  let filingData = props.filingData;
  const formRef = ref<FormInstance>();
  const formState = reactive({unitInfo: props.unitInfo});

  const validateForm = async () => {
    try {
      await formRef.value?.validate();
      return true;
    } catch (error) {
      return false;
    }
  };

  const getFormData = () => {
    return JSON.parse(JSON.stringify(formState.unitInfo));
  };

  watch(
    () => props.unitInfo,
    (newVal) => {
      formState.unitInfo = newVal || {}
    }
  );

  watch(
    () => props.filingData,
    (newVal) => {
      filingData = newVal || {}
    }
  );

  defineExpose({
    validateForm,
    getFormData,
    clearValidate: () => formRef.value?.clearValidate(),
  });
</script>

<style scoped>

</style>
