<template>
  <a-form ref="formRef" :model="formState.baseInfo" :rules="rules" :label-col="{ style: { width: '150px' } }">
    <a-row :gutter="24">
      <a-col :span="24">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="年份" name="stat_date">
              <a-input :value="formState.baseInfo.stat_date" readonly />
            </a-form-item>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-form-item label="单位名称" name="unit_name">
          <a-input v-model:value="formState.baseInfo.unit_name" placeholder="请输入单位名称" />
            
          <!-- <a-input-group compact class="relative">
            <a-select
            class="abs w-100"
            v-model:value="formState.baseInfo.unit_name"
            placeholder="请输入单位名称"
            show-search
            allow-clear
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :options="unitNameOptions"
            @search="handleSearch"
            @change="handleUnitNameChange">
            </a-select>
            <span class="item-tip" style="color: rgba(0, 0, 0, 0.45);">
              <loading-outlined spin v-if="unitNameLoading" />
              <a-tooltip v-if="!unitNameLoading && unitNameTooltip" :title="unitNameTooltip">
                <info-circle-outlined class="ant-form-item-explain-error"/>
              </a-tooltip>
            </span>
              
          </a-input-group> -->
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="统一社会信用代码" name="credit_code">
          <a-input v-model:value="formState.baseInfo.credit_code" :maxlength="18" placeholder="请输入统一社会信用代码"/>
          <!-- <a-input v-model:value="formState.baseInfo.credit_code" :maxlength="18" placeholder="请输入统一社会信用代码" readonly/> -->
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="行业门类" name="trade_a">
          <a-select
            v-model:value="formState.baseInfo.trade_a"
            placeholder="请选择行业门类"
            show-search
            allow-clear
            :filter-option="filterOption"
            :options="trade_aOptions"
            @change="handletrade_aChange"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="行业大类" name="trade_b">
          <a-select
            v-model:value="formState.baseInfo.trade_b"
            placeholder="请选择行业大类"
            show-search
            allow-clear
            :filter-option="filterOption"
            :options="trade_bOptions"
            @change="handletrade_bChange"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="行业中类" name="trade_c">
          <a-select
            v-model:value="formState.baseInfo.trade_c"
            placeholder="请选择行业中类"
            show-search
            allow-clear
            :filter-option="filterOption"
            :options="trade_cOptions"
            @change="handletrade_cChange"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="行业小类" name="trade_d">
          <a-select
          v-model:value="formState.baseInfo.trade_d"
          placeholder="请选择行业小类"
          show-search
          allow-clear
          :filter-option="filterOption"
          :options="tradeDOptions" 
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="单位所在省份" name="province_name">
          <a-select
            v-model:value="formState.baseInfo.province_name"
            placeholder="请选择单位所在省份"
            show-search
            allow-clear
            :filter-option="filterOption"
            :options="provinceOptions"
            @change="handleProvinceChange"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="单位所在地区市" name="city_name">
          <a-select
            v-model:value="formState.baseInfo.city_name"
            placeholder="请选择单位所在地区市"
            show-search
            allow-clear
            :filter-option="filterOption"
            :options="cityOptions"
            @change="handleCityChange"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="单位所在区县" name="country_name">
          <a-select
            v-model:value="formState.baseInfo.country_name"
            placeholder="请选择单位所在区县"
            show-search
            allow-clear
            :filter-option="filterOption"
            :options="countryOptions"
            @change="handleCountryChange"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="联系电话" name="tel">
          <div class="relative">
            <a-input v-model:value="formState.baseInfo.tel" placeholder="请输入联系电话" />
            <a-tooltip title="手机号或固话（手机号11位，固话如010-12345678）" placement="topRight">
              <span class="item-tip" ><info-circle-outlined /></span>
            </a-tooltip>
          </div>
          
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="是否含有自备电厂" name="is_captive_power_plant">
          <span class="relative">
            <CheckboxRadio
              v-model="formState.baseInfo.is_captive_power_plant"
              allowClear
              :options="[
                { label: '是', value: '1' },
                { label: '否', value: '0' }
              ]"
            />
            <a-tooltip placement="topRight">
              <template #title>
                <div v-html="is_captive_power_plantTip"></div>
              </template>
              <span class="item-tip" style="top:-4px"><info-circle-outlined /></span>
            </a-tooltip>
          </span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue';
  import type { FormInstance } from 'ant-design-vue';
  import { InfoCircleOutlined } from '@ant-design/icons-vue';
  import hangye from '@/assets/hangye.json';
  import China from '@/assets/China.json';
  import { forEachTree } from '@/util';
  import { filterOption } from './device_types';
  import {  http, http2 } from '@/util/http';
  import { of, Subject } from 'rxjs';
  import { debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
  import { currentStepRef, deviceChange$ } from './validation-subject';

  // 定义props，接收父组件传递的baseInfo对象，并添加默认值
  const props = defineProps({
    filingData: {
      type: Object,
      default: () => ({})
    },
    baseInfo: {
      type: Object,
      default: () => ({})
    }
  });

  forEachTree(hangye as any, item => {
    item.label = item.name;
    item.value = item.name;
  });

  forEachTree(China as any, item => {
    item.label = item.name;
    item.value = item.name;
  });

  const trade_aOptions = ref<any>(hangye);
  const trade_bOptions = ref<any>([]);
  const trade_cOptions = ref<any>([]);
  const tradeDOptions = ref<any>([]);

  const provinceOptions = ref<any>(China);
  const cityOptions = ref<any>([]);
  const countryOptions = ref<any>([]);

  const is_captive_power_plantTip = `当选择"是"时，设备列表中至少要有一个类型选择"发电锅炉"且"自备电厂用锅炉"选择对应值<br>
  当选择"否"时，类型选择"发电锅炉"的设备，"自备电厂用锅炉"应选择"否"`;

  const handletrade_aChange = (value: string) => {
    const selectedtrade_a = trade_aOptions.value.find((item: any) => item.value === value);
    trade_bOptions.value = selectedtrade_a?.children || [];
    trade_cOptions.value = [];
    tradeDOptions.value = [];
    formState.baseInfo.trade_b = null;
    formState.baseInfo.trade_c = null;
    formState.baseInfo.trade_d = null;
  };

  const handletrade_bChange = (value: string) => {
    const selectedtrade_b = trade_bOptions.value.find((item: any) => item.value === value);
    trade_cOptions.value = selectedtrade_b?.children || [];
    tradeDOptions.value = [];
    formState.baseInfo.trade_c = null;
    formState.baseInfo.trade_d = null;
    // 行业大类改变时触发验证是否含有自备电厂
    nextTick(() => {
      formRef.value?.validateFields(['is_captive_power_plant']);
    });
  };

  const handletrade_cChange = (value: string) => {
    const selectedtrade_c = trade_cOptions.value.find((item: any) => item.value === value);
    tradeDOptions.value = selectedtrade_c?.children || [];
    formState.baseInfo.trade_d = null;
  };

  const handleProvinceChange = (value: string) => {
    const selectedProvince = provinceOptions.value.find((item: any) => item.value === value);
    cityOptions.value = selectedProvince?.children || [];
    countryOptions.value = [];
    formState.baseInfo.city_name = null;
    formState.baseInfo.country_name = null;
  };

  const handleCityChange = (value: string) => {
    const selectedCity = cityOptions.value.find((item: any) => item.value === value);
    countryOptions.value = selectedCity?.children || [];
    formState.baseInfo.country_name = null;
  };

  const handleCountryChange = (value: string) => {
    formState.baseInfo.country_name = value;
  };

  // 从props中获取filingData，所有表单数据
  let filingData = props.filingData;
  const formRef = ref<FormInstance>();
  const formState = reactive({baseInfo: props.baseInfo});
  const unitNameLoading = ref(false);
  const unitNameTooltip = ref('');
  // 单位名称搜索
  const unitNameOptions = ref<any>([]);

  const handleSearch = async (keyword: string) => {
    unitNameChange$.next(keyword);
  };

  const unitNameChange$ = new Subject<string>();
  unitNameChange$.pipe(
    debounceTime(500),
    tap(() => {
      unitNameTooltip.value = '';
      unitNameLoading.value = true;
    }),
    switchMap((value: string) => {
      const keyword = value.trim();
      
      if (!keyword || keyword.length < 3) {
        unitNameLoading.value = false;
        unitNameTooltip.value = '单位名称长度必须大于2个字符';
        return of([]);
      }
     
      return http2.post<string[]>('/data/filing/getSuggestCompanyName', { unit_name: keyword }, {loading: false})
        .pipe(
          tap((options: string[]) => {
            unitNameLoading.value = false;
            unitNameTooltip.value = options ? '' : '未查询到相关单位名称';
          }),
          catchError((err: any) => {
            unitNameLoading.value = false;
            unitNameTooltip.value = err.message || '查询单位名称失败';
            return of([]);
          })
        );
    }), 
    
  ).subscribe((list: string[]) => {
    const options = list || [];
    unitNameOptions.value = (options || []).map(item => ({
      label: item,
      value: item
    }));
  });
  
  /**
   * 单位名称改变时查询单位名称对应的统一社会信用代码
   * @param e 
   */
  const handleUnitNameChange = (unit_name: string) => {
     unitNameTooltip.value = '';
    if (!unit_name) {
      unitNameLoading.value = false;
      formState.baseInfo.credit_code = '';
      return;
    }

    unitNameLoading.value = true;
    http2.post<string>('/data/filing/getCompanyBaseInfo', { unit_name }, {loading: false})
    .pipe(
      tap((credit_code: string) => {
        unitNameLoading.value = false;
        unitNameTooltip.value = credit_code ? '' : '未查询到相关统一社会信用代码';
      }),
      catchError((err: any) => {
        unitNameLoading.value = false;
        unitNameTooltip.value = err.message || '查询统一社会信用代码失败';
        return of('');
      })
    ).subscribe((credit_code: string) => {
      formState.baseInfo.credit_code = credit_code;
    });
  };

  // 校验自备电厂字段
  const validateCaptivePowerPlant = async (_rule: any, value: string) => {
    if (value == null) {
       return Promise.resolve();
    }

     // 当行业大类以44开头时，不校验
    if (/^44/.test(formState.baseInfo.trade_b)) {
       return Promise.resolve();
    }

    if (currentStepRef.value < 4) {
      return Promise.resolve();
    }

    const devices = filingData?.devices || [];
    const powerBoilers = devices.filter((device: any) => device.equipment_type === '发电锅炉');
    const yn = value === '1' ? '是' : '否';

    // 当自备电厂用锅炉选择"是"时，设备列表中至少要有一个类型选择"发电锅炉"
    if (value ==='1') {
      if (!powerBoilers.length) {
        return Promise.reject('设备列表中至少要有一个类型选择"发电锅炉"');
      }
      const hasCaptivePowerPlantBoiler = powerBoilers.some((device: any) => device.is_captive_power_plant_boiler === value);
      if (!hasCaptivePowerPlantBoiler) {
        return Promise.reject('设备列表中至少要有一个类型选择"发电锅炉"且"自备电厂用锅炉"选择"' + yn + '"');
      }
      return Promise.resolve();
    }
     
    if (powerBoilers.length) {
     const hasCaptivePowerPlantBoiler = powerBoilers.some((device: any) => device.is_captive_power_plant_boiler === value);
      if (!hasCaptivePowerPlantBoiler) {
        return Promise.reject('设备列表中类型选择"发电锅炉"时，"自备电厂用锅炉"应选择"' + yn + '"');
      }
    }

    

    return Promise.resolve();
  };

  const rules = {
    stat_date: [{ required: true, message: '请选择统计日期' }],
    unit_name: [
      { required: true, message: '请输入单位名称' },
      { max: 100, message: '单位名称长度不能超过100个字符' }
    ],
    credit_code: [{ required: true, message: '请输入统一社会信用代码' }],
    trade_a: [{ required: true, message: '请选择行业门类' }],
    trade_b: [{ required: true, message: '请选择行业大类' }],
    trade_c: [{ required: true, message: '请选择行业中类' }],
    province_name: [{ required: true, message: '请选择单位所在省份' }],
    city_name: [{ required: true, message: '请选择单位所在地区市' }],
    country_name: [{ required: true, message: '请选择单位所在地区区县' }],
    tel: [
      { required: true, message: '请输入联系电话' },
      {
        pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/,
        message: '请输入正确的手机号或固话（手机号11位，固话如010-12345678）'
      }
    ],
    is_captive_power_plant: [
      { required: true, message: '请选择是否含有自备电厂' },
      { validator: validateCaptivePowerPlant },
    ]
  };

  const validateForm = async () => {
    try {
      await formRef.value?.validate();
      return true;
    } catch (error) {
      return false;
    }
  };

  const getFormData = () => {
    return JSON.parse(JSON.stringify(formState.baseInfo));
  };

  watch(
    () => props.baseInfo,
    (newVal) => {
      formState.baseInfo = newVal || {}
    }
  );

  watch(
    () => props.filingData,
    (newVal) => {
      filingData = newVal || {}
    }
  );

  // 订阅设备变化事件，当第五部分设备类型或自备电厂用锅炉变化时重新校验
  let deviceChangeSubscription: any;
  onMounted(() => {
    deviceChangeSubscription = deviceChange$.subscribe(() => {
      // 重新校验自备电厂字段
      if (formState.baseInfo.is_captive_power_plant != null ) {
        nextTick(() => {
          formRef.value?.validateFields(['is_captive_power_plant']);
        });
      }
    });
  });

  onUnmounted(() => {
    if (deviceChangeSubscription) {
      deviceChangeSubscription.unsubscribe();
    }
  });

  defineExpose({
    validateForm,
    getFormData,
    clearValidate: () => formRef.value?.clearValidate(),
  });
</script>

<style scoped>
.unit_name-tip {
  color: rgba(0, 0, 0, 0.45);
  right: -25px;
  left: initial;
  width: 20px;
  top: 5px;
  z-index: 100;
  position: absolute;
}
</style>
