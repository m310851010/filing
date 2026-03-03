<template>

  <a-form ref="formRef" :model="formState.coal" :label-col="{ style: { width: '180px' } }">
    <a-row :gutter="24">
      <a-col :span="12">
        <a-card title="煤炭消费情况" size="small" style="padding-right: 20px;">
          <a-form-item
            v-for="field in leftFields"
            :key="field.key"
            :label="field.label"
            :name="field.key"
            :required="field.required"
            :rules="field.rules"
          >
            <div class="relative">
              <a-input-number v-model:value="formState.coal[field.key]" :precision="2" class="w-100" :placeholder="`请输入${field.label}`">
                <template #addonAfter>{{ field.unit }}</template>
              </a-input-number>
              <a-tooltip v-if="field.tooltip" :title="field.tooltip" placement="topRight">
                <span class="item-tip" ><info-circle-outlined /></span>
              </a-tooltip>
            </div>
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
            <div class="relative">
              <a-input-number v-model:value="formState.coal[field.key]" :precision="2" class="w-100" :placeholder="`请输入${field.label}`">
                <template #addonAfter>{{ field.unit }}</template>
              </a-input-number>
              <a-tooltip v-if="field.tooltip" :title="field.tooltip" placement="topRight">
                <span class="item-tip" ><info-circle-outlined /></span>
              </a-tooltip>
            </div>
          </a-form-item>
        </a-card>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
  import { ref, reactive, watch } from 'vue';
  import type { FormInstance } from 'ant-design-vue';
  import { InfoCircleOutlined } from '@ant-design/icons-vue';
  import { validateSum } from '@/util';
  import { coalConsumptionChange$ } from './validation-subject';

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

  // 自定义验证器：原煤消费量应等于其中各项之和
  const validateRawCoalConsumption = async (_rule: any, value: number) => {
    const { valid, sum } = validateSum(value, [
      formState.coal.annual_anthracite_consumption,
      formState.coal.annual_bituminous_coal_consumption,
      formState.coal.annual_lignite_consumption
    ]);
    if (!valid) {
      return Promise.reject(`原煤消费量应等于其中各项之和（无烟煤+烟煤+褐煤=${sum}）`);
    }
    return Promise.resolve();
  };

  // 自定义验证器：其中各项之和应等于原煤消费量
  const validateCoalComponent = async () => {
    const rawCoal = formState.coal.annual_raw_coal_consumption;
    if (rawCoal === undefined || rawCoal === null) {
      return Promise.resolve();
    }
    const { valid } = validateSum(rawCoal, [
      formState.coal.annual_anthracite_consumption,
      formState.coal.annual_bituminous_coal_consumption,
      formState.coal.annual_lignite_consumption
    ]);
    if (!valid) {
      return Promise.reject('其中各项之和应等于原煤消费量');
    }
    return Promise.resolve();
  };

  const leftFields: {key: string, label: string, unit: string, required: boolean, tooltip?: string, rules: any[]}[] = [
    {
      key: 'annual_raw_coal_consumption',
      label: '原煤消费量',
      unit: '万吨',
      required: true,
      tooltip: '原煤消费量应等于其中各项之和（无烟煤+烟煤+褐煤）',
      rules: [{ required: true, message: '请输入原煤消费量' }, maxRule, { validator: validateRawCoalConsumption }]
    },
    {
      key: 'annual_anthracite_consumption',
      label: '其中：无烟煤消费量',
      unit: '万吨',
      required: true,
      rules: [{ required: true, message: '请输入无烟煤消费量' }, maxRule, { validator: validateCoalComponent }]
    },
    {
      key: 'annual_bituminous_coal_consumption',
      label: '其中：烟煤消费量',
      unit: '万吨',
      required: true,
      rules: [{ required: true, message: '请输入烟煤消费量' }, maxRule, { validator: validateCoalComponent }]
    },
    {
      key: 'annual_lignite_consumption',
      label: '其中：褐煤消费量',
      unit: '万吨',
      required: true,
      rules: [{ required: true, message: '请输入褐煤消费量' }, maxRule, { validator: validateCoalComponent }]
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

  const rightFields: {key: string, label: string, unit: string, required: boolean, tooltip?: string, rules: any[]}[] = [
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

  // 监听原煤消费量变化，重新验证"其中"各字段
  watch(
    () => formState.coal.annual_raw_coal_consumption,
    () => {
      // 使用 setTimeout 确保在值更新后再验证
      setTimeout(() => {
        formRef.value?.validateFields([
          'annual_anthracite_consumption',
          'annual_bituminous_coal_consumption',
          'annual_lignite_consumption'
        ]).catch(() => {
          // 忽略验证错误，只触发验证更新状态
        });
      }, 0);
    }
  );

  // 监听"其中"各字段变化，重新验证原煤消费量和其他"其中"字段
  watch(
    () => [
      formState.coal.annual_anthracite_consumption,
      formState.coal.annual_bituminous_coal_consumption,
      formState.coal.annual_lignite_consumption
    ],
    () => {
      setTimeout(() => {
        formRef.value?.validateFields([
          'annual_raw_coal_consumption',
          'annual_anthracite_consumption',
          'annual_bituminous_coal_consumption',
          'annual_lignite_consumption'
        ]).catch(() => {
          // 忽略验证错误，只触发验证更新状态
        });
      }, 0);
    }
  );

  onMounted(() => {
    formState.coal = props.coal || {}
    emitCoalConsumptionChange();
  });

  watch(
    () => props.coal,
    (newVal) => {
      formState.coal = newVal || {}
      emitCoalConsumptionChange();
    }
  );

  watch(
    () => props.filingData,
    (newVal) => {
      filingData = newVal || {}
    }
  );

  const emitCoalConsumptionChange = () => {
    coalConsumptionChange$.next({
      raw_coal_consumption: formState.coal.annual_raw_coal_consumption || 0,
      clean_coal_consumption: formState.coal.annual_clean_coal_consumption || 0,
      other_coal_consumption: formState.coal.annual_other_coal_consumption || 0
    });
  };

  watch(
    () => [
      formState.coal.annual_raw_coal_consumption,
      formState.coal.annual_clean_coal_consumption,
      formState.coal.annual_other_coal_consumption
    ],
    () => {
      emitCoalConsumptionChange();
    }
  );

  defineExpose({
    emitCoalConsumptionChange,
    validateForm,
    getFormData,
    clearValidate: () => formRef.value?.clearValidate(),
  });
</script>
