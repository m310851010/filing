<template>

  <a-form ref="formRef" :model="formState.energy" :label-col="{ style: { width: '200px' } }">
    <a-row :gutter="24">
      <a-col :span="12" v-for="field in fields" :key="field.key">
        <a-form-item :label="field.label" :name="field.key" :required="field.required" :rules="field.rules">
          <div class="relative">
            <a-input-number
              v-model:value="formState.energy[field.key]"
              :precision="2"
              :min="0"
              class="w-100"
              :placeholder="`请输入${field.label}`"
            >
              <template #addonAfter>{{ field.unit }}</template>
            </a-input-number>
            <a-tooltip v-if="field.tooltip" placement="topRight">
              <template #title><span v-html="field.tooltip"></span></template>
              <span class="item-tip" ><info-circle-outlined /></span>
            </a-tooltip>
          </div>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, onUnmounted } from 'vue';
  import type { FormInstance } from 'ant-design-vue';
  import { InfoCircleOutlined } from '@ant-design/icons-vue';
  import { coalConsumptionChange$, deviceUsageChange$, deviceTotalInputChange$, currentStepRef } from './validation-subject';
import { floatSum } from '@/util';
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

  let coalConsumptionData = {
    raw_coal_consumption: 0,
    clean_coal_consumption: 0,
    other_coal_consumption: 0
  };

  let deviceUsageData = {
    hasRawMaterial: false
  };

  let deviceTotalInputData = {
    totalInputQuantity: 0
  };

  const validateCoalConsumptionSum = async (_rule: any, value: number) => {
    if (currentStepRef.value < 3) {
       return Promise.resolve();
    }
    const { raw_coal_consumption, clean_coal_consumption, other_coal_consumption } = coalConsumptionData;
    const sum = floatSum([raw_coal_consumption, clean_coal_consumption, other_coal_consumption]);
    if (value != null && value !== sum) {
      return Promise.reject(`年煤炭消费总量(实物量)应等于原煤消费量+洗精煤消费量+其他洗煤消费（${sum.toFixed(2)}万吨）`);
    }
    return Promise.resolve();
  };

  const validateDeviceTotalInput = async (_rule: any, value: number) => {
    if (currentStepRef.value < 4) {
       return Promise.resolve();
    }
    if (value != null && value !== deviceTotalInputData.totalInputQuantity) {
      return Promise.reject(`年煤炭消费总量(实物量)应等于主要用途情况，设备的"投入量"加和（${deviceTotalInputData.totalInputQuantity.toFixed(2)}万吨）`);
    }
    return Promise.resolve();
  };

  const validateRawCoal = async (_rule: any, value: number) => {
    if (currentStepRef.value < 4) {
       return Promise.resolve();
    }
    if (value && value > 0 && !deviceUsageData.hasRawMaterial) {
      return Promise.reject('年原料用煤消费量>0时，请在主要用途中列出"原料"数据');
    }
    return Promise.resolve();
  };

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
      tooltip: `当行业大类为"44_电力、热力生产和供应"时，年综合能耗当量值应大于年综合能耗等价值；否则年综合能耗当量值应小于年综合能耗等价值`,
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
      tooltip: '年原料用煤消费量>0时，请在主要用途中列出\"原料\"数据',
      rules: [{ required: true, message: '请输入年原料用煤消费量' }, maxRule, { validator: validateRawCoal, trigger: 'change' }]
    },
    {
      key: 'annual_total_coal_consumption',
      label: '年煤炭消费总量(实物量)',
      unit: '万吨',
      required: true,
      tooltip: '1、应等于原煤消费量+洗精煤消费量+其他洗煤消费<br>2、应等于主要用途情况，设备的\"投入量\"加和',
      rules: [{ required: true, message: '请输入年煤炭消费总量(实物量)' }, maxRule, { validator: validateCoalConsumptionSum, trigger: 'change' }, { validator: validateDeviceTotalInput, trigger: 'change' }]
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
    () => formState.energy.annual_raw_coal,
    () => {
      formRef.value?.validateFields(['annual_raw_coal']).catch(() => {});
    }
  );

  watch(
    () => props.filingData,
    (newVal) => {
      filingData = newVal || {};
    }
  );

  const subscription = coalConsumptionChange$.subscribe((data) => {
    coalConsumptionData = data;
    formRef.value?.validateFields(['annual_total_coal_consumption']).catch(() => {});
  });

  const deviceUsageSubscription = deviceUsageChange$.subscribe((data) => {
    deviceUsageData = data;
    formRef.value?.validateFields(['annual_raw_coal']).catch(() => {});
  });

  const deviceTotalInputSubscription = deviceTotalInputChange$.subscribe((data) => {
    deviceTotalInputData = data;
    formRef.value?.validateFields(['annual_total_coal_consumption']).catch(() => {});
  });

  onUnmounted(() => {
    subscription.unsubscribe();
    deviceUsageSubscription.unsubscribe();
    deviceTotalInputSubscription.unsubscribe();
  });

  defineExpose({
    validateForm,
    getFormData,
    clearValidate: () => formRef.value?.clearValidate(),
  });
</script>
