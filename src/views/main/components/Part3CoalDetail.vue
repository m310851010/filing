<template>

  <a-form ref="formRef" :model="formState.coal" :label-col="{ style: { width: '180px' } }">
    <a-row :gutter="24">
      <a-col :span="12">
        <a-card title="煤炭消费情况" size="small">
          <a-form-item
            v-for="field in leftFields"
            :key="field.key"
            :label="field.label"
            :name="field.key"
            :required="field.required"
            :rules="field.rules"
          >
            <a-input-number v-model:value="formState.coal[field.key]" :precision="2" class="w-100" :placeholder="`请输入${field.label}`">
              <template #addonAfter>{{ field.unit }}</template>
            </a-input-number>
          </a-form-item>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card title="焦炭消费情况" size="small" class="h-100">
          <a-form-item
            v-for="field in rightFields"
            :key="field.key"
            :label="field.label"
            :name="field.key"
            :required="field.required"
            :rules="field.rules"
          >
            <a-input-number v-model:value="formState.coal[field.key]" :precision="2" class="w-100" :placeholder="`请输入${field.label}`">
              <template #addonAfter>{{ field.unit }}</template>
            </a-input-number>
          </a-form-item>
        </a-card>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
  import { ref, reactive, watch } from 'vue';
  import type { FormInstance } from 'ant-design-vue';

  const props = defineProps({
    filingData: {
      type: Object,
      default: () => ({})
    },
    coal: {
      type: Object,
      default: () => ({})
    }
  });

  // 从props中获取filingData，所有表单数据
  let filingData = props.filingData;
  const formRef = ref<FormInstance>();
  const formState = reactive({
    coal: props.coal
  });

   const maxRule = { type: 'number', max: 10000, message: '数值不能超过10000' };
  const leftFields = [
    {
      key: 'annual_raw_coal_consumption',
      label: '原煤消费量',
      unit: '万吨',
      required: true,
      rules: [{ required: true, message: '请输入原煤消费量' }, maxRule]
    },
    {
      key: 'annual_anthracite_consumption',
      label: '其中：无烟煤消费量',
      unit: '万吨',
      required: true,
      rules: [{ required: true, message: '请输入无烟煤消费量' }, maxRule]
    },
    {
      key: 'annual_bituminous_coal_consumption',
      label: '其中：烟煤消费量',
      unit: '万吨',
      required: true,
      rules: [{ required: true, message: '请输入烟煤消费量' }, maxRule]
    },
    {
      key: 'annual_lignite_consumption',
      label: '其中：褐煤消费量',
      unit: '万吨',
      required: true,
      rules: [{ required: true, message: '请输入褐煤消费量' }, maxRule]
    },
    {
      key: 'annual_clean_coal_consumption',
      label: '洗精煤消费量',
      unit: '万吨',
      required: true,
      rules: [{ required: true, message: '请输入洗精煤消费量' }, maxRule]
    },
    {
      key: 'annual_other_coal_consumption',
      label: '其他煤炭消费',
      unit: '万吨',
      required: true,
      rules: [{ required: true, message: '请输入其他煤炭消费' }, maxRule]
    },
    {
      key: 'annual_coal_products_consumption',
      label: '煤制品消费总量',
      unit: '万吨',
      required: true,
      rules: [{ required: true, message: '请输入煤制品消费总量' }, maxRule]
    }
  ];

  const rightFields = [
    {
      key: 'annual_coke_consumption',
      label: '焦炭消费量',
      required: true,
      unit: '万吨',
      rules: [{ required: true, message: '请输入焦炭消费量' }, maxRule]
    },
    {
      key: 'annual_blue_coke_consumption',  
      label: '兰炭消费量',
      required: true,
      unit: '万吨',
      rules: [{ required: true, message: '请输入兰炭消费量' }, maxRule]
    },
    {
      key: 'annual_blast_furnace_gas_consumption',
      label: '高炉煤气消费量',
      required: true,
      unit: '万立方米',
      rules: [{ required: true, message: '请输入高炉煤气消费量' }, maxRule]
    },
    {
      key: 'annual_coke_oven_gas_consumption',
      label: '焦炉煤气消费量',
      required: true,
      unit: '万立方米',
      rules: [{ required: true, message: '请输入焦炉煤气消费量' }, maxRule]
    }
  ];

  const validateForm = async () => {
    try {
      await formRef.value?.validate();
      return true;
    } catch (error) {
      return false;
    }
  };

  const getFormData = () => {
    return JSON.parse(JSON.stringify(formState.coal));
  };

  watch(
    () => props.coal,
    (newVal) => {
      formState.coal = newVal || {}
    }
  );

  watch(
    () => props.filingData,
    (newVal) => {
      console.log('3 filingData', newVal);
      filingData = newVal || {}
    }
  );

  defineExpose({
    validateForm,
    getFormData,
    clearValidate: () => formRef.value?.clearValidate(),
  });
</script>
