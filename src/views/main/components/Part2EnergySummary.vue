<template>

  <a-form ref="formRef" :model="formState.energy" :label-col="{ style: { width: '200px' } }">
    <a-row :gutter="24">
      <a-col :span="12" v-for="field in fields" :key="field.key">
        <a-form-item :label="field.label" :name="field.key" :required="field.required" :rules="field.rules">
          <a-input-number
            v-model:value="formState.energy[field.key]"
            :precision="2"
            :min="0"
            class="w-100"
            :placeholder="`请输入${field.label}`"
          >
            <template #addonAfter>{{ field.unit }}</template>
          </a-input-number>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
  import { ref, reactive, watch } from 'vue';
  import type { FormInstance } from 'ant-design-vue';
  // 定义props，接收父组件传递的energy对象，并添加默认值
  const props = defineProps({
    energy: {
      type: Object,
      default: () => ({})
    },
    filingData: {
      type: Object,
      default: () => ({})
    }
  });

  // 从props中获取filingData，所有表单数据
  let filingData = props.filingData;

  const formRef = ref<FormInstance>();
  const formState = reactive({
    energy: props.energy
  });

  const maxRule = { type: 'number', max: 10000, message: '数值不能超过10000' };

  const validateRawMaterialEnergy = async (_rule: any, value: number) => {
    if (value && formState.energy.annual_energy_equivalent_value && value > formState.energy.annual_energy_equivalent_value) {
      return Promise.reject('年原料用能消费量不能大于年综合能耗当量值');
    }
    return Promise.resolve();
  };

  const validateEnergyValue = async (_rule: any, value: number) => {
    const tradeB = filingData.baseInfo?.trade_b || '';
    const equivalentValue = formState.energy.annual_energy_equivalent_value;
    const equivalentCost = formState.energy.annual_energy_equivalent_cost;

    if (equivalentValue !== undefined && equivalentCost !== undefined) {
      if (/^44/.test(tradeB)) {
        if (equivalentValue <= equivalentCost) {
          return Promise.reject('年综合能耗当量值应大于年综合能耗等价值');
        }
      } else {
        if (equivalentValue >= equivalentCost) {
          return Promise.reject('年综合能耗当量值应小于年综合能耗等价值');
        }
      }
    }
    return Promise.resolve();
  };

  const fields = [
    {
      key: 'annual_energy_equivalent_value',
      label: '年综合能耗当量值',
      unit: '万吨标准煤',
      required: true,
      rules: [{ required: true, message: '请输入年综合能耗当量值' }, maxRule, { validator: validateEnergyValue, trigger: 'change' }]
    },
    {
      key: 'annual_energy_equivalent_cost',
      label: '年综合能耗等价值',
      unit: '万吨标准煤',
      required: true,
      rules: [{ required: true, message: '请输入年综合能耗等价值' }, maxRule]
    },
    {
      key: 'annual_raw_material_energy',
      label: '年原料用能消费量',
      unit: '万吨标准煤',
      required: true,
      rules: [{ required: true, message: '请输入年原料用能消费量' }, maxRule, { validator: validateRawMaterialEnergy, trigger: 'change' }]
    },
    {
      key: 'annual_raw_coal',
      label: '年原料用煤消费量',
      unit: '万吨',
      required: true,
      rules: [{ required: true, message: '请输入年原料用煤消费量' }, maxRule]
    },
    {
      key: 'annual_total_coal_consumption',
      label: '年煤炭消费总量(实物量)',
      unit: '万吨',
      required: true,
      rules: [{ required: true, message: '请输入年煤炭消费总量(实物量)' }, maxRule]
    },
    {
      key: 'annual_total_coal_products',
      label: '年煤炭消费总量(标准量)',
      unit: '万吨标准煤',
      required: true,
      rules: [{ required: true, message: '请输入年煤炭消费总量(标准量)' }, maxRule]
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
    return JSON.parse(JSON.stringify(formState.energy));
  };

  watch(
    () => props.energy,
    (newVal) => {
      formState.energy = newVal || {}
    }
  );

  watch(
    () => formState.energy.annual_energy_equivalent_value,
    () => {
      formRef.value?.validateFields(['annual_raw_material_energy', 'annual_energy_equivalent_cost']);
    }
  );

  watch(
    () => formState.energy.annual_energy_equivalent_cost,
    () => {
      formRef.value?.validateFields(['annual_energy_equivalent_value']);
    }
  );

  watch(
    () => props.filingData,
    (newVal) => {
      filingData = newVal || {};
    }
  );

  defineExpose({
    validateForm,
    getFormData,
    clearValidate: () => formRef.value?.clearValidate(),
  });
</script>
