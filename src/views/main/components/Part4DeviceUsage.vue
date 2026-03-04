<template>
  <a-form ref="formRef" :model="formState" layout="vertical">
    <div class="flex-v">
      <div class="flex-main relative">
        <div v-if="devices.length" ref="scrollContainer">
          <a-card size="small" v-for="(device, index) in devices" :key="device.obj_id" class="device-card">
            <template #title>
              <a-space class="device-header ant-form ant-form-vertical">
                <a-form-item>
                  <a-tag color="blue">设备 #{{ index + 1 }}</a-tag>
                </a-form-item>
                <a-form-item
                  required
                  label="类型"
                  :name="['devices', index, 'equipment_type']"
                  :rules="[{ required: true, message: '请选择设备类型' }]"
                >
                  <a-select
                    v-model:value="device.equipment_type"
                    placeholder="设备类型"
                    show-search
                    :filter-option="filterOption"
                    :options="deviceTypeOptions"
                    @change="handleTypeChange(device, device.equipment_type)"
                    style="width: 120px"
                  />
                </a-form-item>
                <a-form-item
                  v-if="device.equipment_type === '发电锅炉'"
                  label="自备电厂用锅炉"
                  :name="['devices', index, 'is_captive_power_plant_boiler']"
                  :rules="[{ required: true, message: '请选择' }]"
                >
                  <CheckboxRadio
                    v-model="device.is_captive_power_plant_boiler"
                    :options="[
                      { label: '是', value: '1' },
                      { label: '否', value: '0' }
                    ]"
                  ></CheckboxRadio>
                </a-form-item>
                <a-form-item
                  required
                  label="编号"
                  :name="['devices', index, 'coal_no']"
                  :rules="[{ required: true, message: '请输入编号' }, { validator: (rule: any, value: string) => validateCoalNo(rule, value, device), trigger: 'change' }]"
                >
                  <a-input v-model:value="device.coal_no" placeholder="请输入编号" class="d-w" @change="() => onCoalNoChange(device)" />
                </a-form-item>
                <a-form-item
                  v-if="device.equipment_type === '发电锅炉' || device.equipment_type === '工业锅炉'"
                  required
                  label="型号"
                  :name="['devices', index, 'equipment_model']"
                  :rules="[{ required: true, message: '请输入型号' }]"
                >
                  <a-input v-model:value="device.equipment_model" placeholder="请输入型号" class="d-w" />
                </a-form-item>
                <a-form-item
                  required
                  label="累计使用时间"
                  :name="['devices', index, 'usage_time']"
                  :rules="[{ required: true, message: '请输入累计使用时间' }, { validator: (rule: any, value: number) => validateUsageTime(rule, value, device), trigger: 'change' }]"
                >
                  <a-input-number v-model:value="device.usage_time" :min="0" :max="50" :precision="0" :step="1" placeholder="0~50" />
                </a-form-item>
                <a-form-item
                  required
                  label="设计年限"
                  :name="['devices', index, 'design_life']"
                  :rules="[{ required: true, message: '请输入设计年限' }]"
                >
                  <a-input-number v-model:value="device.design_life" :min="0" :max="50" :precision="0" :step="1" placeholder="设计年限" @change="() => onDesignLifeChange(device, index)" />
                </a-form-item>
                <!-- <a-form-item
                  required
                  label="能效水平"
                  :name="['devices', index, 'enecrgy_efficienct_bmk']"
                  :rules="[{ required: true, message: '请选择能效水平' }]"
                >
                  <a-select v-model:value="device.enecrgy_efficienct_bmk" placeholder="能效水平" allowClear style="width: 200px">
                    <a-select-option v-for="t in enecrgy_efficienct_bmks" :key="t" :value="t">{{ t }}</a-select-option>
                  </a-select>
                </a-form-item> -->
                <a-form-item
                  required
                  label="容量单位"
                  :name="['devices', index, 'capacity_unit']"
                  :rules="[{ required: true, message: '请选择容量单位' }]"
                >
                  <a-select v-model:value="device.capacity_unit" placeholder="容量单位" style="width: 120px" allowClear :options="device._device_type?.capacity_units" />
                </a-form-item>
                <a-form-item
                  required
                  label="容量"
                  :name="['devices', index, 'capacity']"
                  :rules="[{ required: true, message: '请输入容量' }]"
                >
                  <a-input-number
                    v-model:value="device.capacity"
                    :min="0"
                    :max="1000000"
                    :precision="0"
                    :step="1"
                    placeholder="容量"
                    class="d-w"
                  />
                </a-form-item>
                <a-form-item
                  label="年投入量"
                  :name="['devices', index, 'input_quantity']"
                >
                  <a-input-number
                    v-model:value="device.input_quantity"
                    :precision="2"
                    placeholder="年投入量"
                    class="d-w"
                    readonly
                  />
                </a-form-item>
              </a-space>
            </template>
            <template #extra>
              <a-form-item>
                <a-button type="link" danger @click="handleDeleteDevice(index)" size="small">删除设备</a-button>
              </a-form-item>
            </template>

            <a-card size="small" style="margin-bottom: 12px; background-color: #fafafa">
              <template #title>
                <div class="flex-between">
                  <h3>用途明细</h3>
                  <a-button size="small" type="primary" @click="addUsage(device, index)">
                    <PlusOutlined />
                    增加用途
                  </a-button>
                </div>
              </template>
              <a-table :data-source="device.usages" :pagination="false" size="small" row-key="obj_id" bordered>
                <a-table-column title="主要用途" width="175px">
                  <template #default="{ record, index: uIdx }">
                    <a-form-item
                      :name="['devices', index, 'usages', uIdx, 'main_usage']"
                      :rules="[
                        { required: true, message: '请选择主要用途' },
                        { validator: (rule: any, value: any) => validateUsageDuplicate(rule, value, device, record, 'main_usage'), trigger: 'change' }
                      ]"
                      style="margin-bottom: 0"
                    >
                      <a-select
                        v-model:value="record.main_usage"
                        :options="device._device_type?.children || []"
                        class="w-100"
                        show-search
                        :filter-option="filterOption"
                        placeholder="主要用途"
                        @change="onMainUsageChange(device, record, uIdx)"
                      />
                    </a-form-item>
                  </template>
                </a-table-column>
                <a-table-column title="具体用途">
                  <template #default="{ record, index: uIdx }">
                    <a-form-item
                      :name="['devices', index, 'usages', uIdx, 'specific_usage']"
                      :rules="[
                        { required: true, message: '请输入具体用途' },
                        { validator: (rule: any, value: any) => validateUsageDuplicate(rule, value, device, record, 'specific_usage'), trigger: 'change' }
                      ]"
                      style="margin-bottom: 0"
                    >
                      <a-select
                        v-model:value="record.specific_usage"
                        :options="record._main_usage?.specific_usage || []"
                        show-search
                        :filter-option="filterOption"
                        allowClear
                        class="w-100"
                        placeholder="具体用途"
                        @change="onSpecificUsageChange(record, uIdx)"
                      />
                    </a-form-item>
                  </template>
                </a-table-column>
                <a-table-column title="投入品种">
                  <template #default="{ record, index: uIdx }">
                    <a-form-item
                      :name="['devices', index, 'usages', uIdx, 'input_variety']"
                      :rules="[
                        { required: true, message: '请选择投入品种' },
                        { validator: (rule: any, value: any) => validateUsageDuplicate(rule, value, device, record, 'input_variety'), trigger: 'change' }
                      ]"
                      style="margin-bottom: 0"
                    >
                      <a-select
                        v-model:value="record.input_variety"
                        :options="record._specific_usage?.input_variety || []"
                        show-search
                        allowClear
                        :filter-option="filterOption"
                        class="w-100"
                        placeholder="投入品种"
                        @change="onInputVarietyChange(record)"
                      />
                    </a-form-item>
                  </template>
                </a-table-column>
                <a-table-column title="投入计量单位" width="110px">
                  <template #default="{ record }">
                    <a-input v-model:value="record.input_unit" readonly class="w-100" />
                  </template>
                </a-table-column>
                <a-table-column title="年投入量" width="100px">
                  <template #default="{ record, index: uIdx }">
                    <a-form-item
                      :name="['devices', index, 'usages', uIdx, 'input_quantity']"
                      :rules="[{ required: true, message: '请输入年投入量' }, { type: 'number', max: 10000, message: '不能超过10000' }]"
                      style="margin-bottom: 0"
                    >
                      <a-input-number 
                        v-model:value="record.input_quantity" 
                        :precision="2" 
                        :min="0" 
                        class="w-100" 
                        placeholder="年投入量" 
                        @change="onInputQuantityChange(device)"
                      />
                    </a-form-item>
                  </template>
                </a-table-column>
                <a-table-column title="产出品种品类">
                  <template #default="{ record, index: uIdx }">
                    <a-form-item
                      :name="['devices', index, 'usages', uIdx, 'output_energy_types']"
                      :rules="[
                        { validator: (rule: any, value: string) => validateOutputEnergyTypes(rule, value, record), trigger: 'change' },
                        { validator: (rule: any, value: any) => validateUsageDuplicate(rule, value, device, record, 'output_energy_types'), trigger: 'change' }
                      ]"
                      style="margin-bottom: 0"
                    >
                      <a-select
                        v-model:value="record.output_energy_types"
                        :options="record._specific_usage?.output_energy_types || []"
                        show-search
                        allowClear
                        :filter-option="filterOption"
                        class="w-100"
                        placeholder="产出品种品类"
                        @change="onOutputEnergyTypesChange(record)"
                      />
                    </a-form-item>
                  </template>
                </a-table-column>
                <a-table-column title="产出计量单位" width="110px">
                  <template #default="{ record }">
                    <a-input v-model:value="record.measurement_unit" readonly class="w-100" />
                  </template>
                </a-table-column>

                <a-table-column title="年产出量" width="100px">
                  <template #default="{ record, index: uIdx }">
                    <a-form-item
                      :name="['devices', index, 'usages', uIdx, 'output_quantity']"
                      :rules="[{ required: true, message: '请输入年产出量' }]"
                      style="margin-bottom: 0"
                    >
                      <a-input-number v-model:value="record.output_quantity" :precision="2" :min="0" class="w-100" placeholder="年产出量" />
                    </a-form-item>
                  </template>
                </a-table-column>
                <a-table-column title="备注" width="120px">
                  <template #default="{ record }">
                    <a-input v-model:value="record.remarks" class="w-100" placeholder="备注" />
                  </template>
                </a-table-column>

                <a-table-column title="操作" width="60px">
                  <template #default="{ index: uIdx }">
                    <a-button type="link" danger @click="handleDeleteUsage(device, uIdx)">删除</a-button>
                  </template>
                </a-table-column>
              </a-table>
            </a-card>
          </a-card>
        </div>

        <div v-else class="flex-v flex-center">
          <a-empty>
            <template #description>
              暂无设备信息，请点击
              <a-button type="link" @click="addDevice" size="small">添加设备信息</a-button>
              添加设备
            </template>
          </a-empty>
        </div>
      </div>

      <a-button type="primary" block @click="addDevice" style="margin-top: 8px">
        <PlusOutlined />
        添加设备信息
      </a-button>
    </div>
  </a-form>
</template>

<script setup lang="ts">
  import { ref, reactive, nextTick, watch } from 'vue';
  import type { FormInstance } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { deviceTypes, DeviceType, MainUsage, SpecificUsage, OpgionUnit, filterOption } from './device_types';
  import { floatSum, SelectOption, UUID } from '@/util';
  import { deviceUsageChange$, deviceTotalInputChange$, deviceChange$ } from './validation-subject';

  const props = defineProps({
    filingData: {
      type: Object,
      default: () => ({})
    },
    devices: {
      type: Array as () => Device[],
      default: () => []
    }
  });

  // 从props中获取filingData，所有表单数据
  let filingData = props.filingData;
  const formRef = ref<FormInstance>();
  const formState = reactive({ devices: props.devices });

  const scrollContainer = ref<HTMLElement>();
  // 定义设备类型和能效水平选项
  const deviceTypeOptions = deviceTypes;
  const enecrgy_efficienct_bmks = ['优于先进水平', '先进水平至节能水平之间', '节能水平至准入水平之间', '低于准入水平', '无能效标准'];

  /**
   * 验证产出品种品类是否为空
   * @param _rule 验证规则
   * @param value 产出品种品类
   * @param record 用途
   */
  const validateOutputEnergyTypes = async (_rule: any, value: string, record: Usage) => {
    const options = record._specific_usage?.output_energy_types || [];
    if (options.length > 0 && !value) {
      return Promise.reject('请选择产出品种品类');
    }
    return Promise.resolve();
  };

  /**
   * 验证用途明细是否重复
   * 主要用途、具体用途、投入品种、产出品种品类全部相同即为重复
   * @param _rule 验证规则
   * @param value 字段值
   * @param device 设备
   * @param usage 当前用途
   * @param field 当前校验的字段名
   */
  const validateUsageDuplicate = async (_rule: any, value: any, device: Device, usage: Usage, field: string) => {
    if (!value) return Promise.resolve();
    
    const usageIndex = device.usages.indexOf(usage);
    const duplicates = device.usages.filter((u: Usage, index: number) => {
      if (index === usageIndex) return false;
      // 四个字段全部相同即为重复
      return u.main_usage === usage.main_usage &&
             u.specific_usage === usage.specific_usage &&
             u.input_variety === usage.input_variety &&
             u.output_energy_types === usage.output_energy_types;
    });
    
    if (duplicates.length > 0) {
      return Promise.reject('用途明细重复');
    }
    return Promise.resolve();
  };

  /**
   * 验证编号是否重复
   * @param _rule 验证规则
   * @param value 编号
   * @param device 设备
   */
  const validateCoalNo = async (_rule: any, value: string, device: Device) => {
    if (!value) return Promise.resolve();
    const idx = formState.devices.indexOf(device);
    const duplicateCount = formState.devices.filter((d, index) => d.coal_no === value && index !== idx).length;
    if (duplicateCount > 0) {
      return Promise.reject('编号不能重复');
    }
    return Promise.resolve();
  };

  /**
   * 验证使用年限是否大于设计年限
   * @param _rule 验证规则
   * @param value 使用年限
   * @param device 设备
   */
  const validateUsageTime = async (_rule: any, value: number, device: Device) => {
    if (!value) return Promise.resolve();
    if (device.design_life && value > device.design_life) {
      return Promise.reject('不能大于设计年限');
    }
    return Promise.resolve();
  };

  const checkHasRawMaterial = () => {
    return formState.devices.some((device: Device) => 
      (device.usages || []).some((usage: Usage) => usage.main_usage === '原料')
    );
  };

  const emitDeviceUsageChange = () => {
    deviceUsageChange$.next({
      hasRawMaterial: checkHasRawMaterial()
    });
  };

  const emitDeviceTotalInputChange = () => {
    const total = formState.devices.reduce((sum: number, device: Device) => {
      return floatSum([sum, device.input_quantity || 0]);
    }, 0);
    deviceTotalInputChange$.next({
      totalInputQuantity: total
    });
  };

  const handleDeleteDevice = (index: number) => {
    formState.devices.splice(index, 1);
    emitDeviceUsageChange();
    emitDeviceTotalInputChange();
  };

  const handleDeleteUsage = (device: Device, uIdx: number) => {
    device.usages.splice(uIdx, 1);
    emitDeviceUsageChange();
    emitDeviceTotalInputChange();
  };

  const onCoalNoChange = (device: Device) => {
    nextTick(() => {
      const idx = formState.devices.indexOf(device);
      formState.devices.forEach((_: Device, index: number) => {
        if (index !== idx) {
          formRef.value?.validateFields([['devices', index, 'coal_no']]);
        }
      });
    });
  };

  const onDesignLifeChange = (device: Device, index: number) => {
    nextTick(() => {
      formRef.value?.validateFields([['devices', index, 'usage_time']]);
    });
  };

  const addDevice = () => {
    const equipment_type = '发电锅炉';
    const device = { equipment_type, obj_id: UUID(), usages: [{obj_id: UUID()}], _device_type: deviceTypes.find(d => d.value === equipment_type)! } as Device;
    formState.devices.push(device);
    nextTick(() => {
      scrollToBottom();
    });
  };

  const addUsage = (device: Device, deviceIndex: number) => {
    device.usages.push({obj_id: UUID()});
  };

  const scrollToBottom = () => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({
        top: scrollContainer.value.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // 设备类型改变时，清空主要用途、具体用途、投入品种品类、投入计量单位、产出品种品类、产出计量单位
  const handleTypeChange = (device: Device, deviceType?: string) => {
    device._device_type = deviceTypes.find(d => d.value === deviceType)!;
    device.capacity_unit = undefined;
    for (const usage of device.usages) {
      usage.main_usage = undefined;
      usage.specific_usage = undefined;
      usage.input_variety = undefined;
      usage.input_unit = undefined;
      usage.output_energy_types = undefined;
      usage.measurement_unit = undefined;

      usage._main_usage = undefined;
      usage._specific_usage = undefined;
    }
  };

  // 当主要用途改变时的处理函数
  const onMainUsageChange = (device: Device, record: Usage, uIdx: number) => {
    const mainUsage = device._device_type!.children!.find(c => c.value === record.main_usage);
    record.specific_usage = undefined;
    record.input_variety = undefined;
    record.input_unit = undefined;
    record.output_energy_types = undefined;
    record.measurement_unit = undefined;

    record._main_usage = mainUsage;
    record._specific_usage = undefined;
    
    emitDeviceUsageChange();
  };

  // 当具体用途改变时的处理函数
  const onSpecificUsageChange = (record: Usage, uIdx: number) => {
    const specificUsage = record._main_usage!.specific_usage!.find(s => s.value === record.specific_usage);
    record.input_variety = undefined;
    record.input_unit = undefined;
    record.output_energy_types = undefined;
    record.measurement_unit = undefined;

    record._specific_usage = specificUsage;
  };

  // 当产出品种品类改变时的处理函数
  const onOutputEnergyTypesChange = (record: Usage) => {
    if (record.output_energy_types) {
      const output_energy_types = record._specific_usage!.output_energy_types!.find(v => v.value === record.output_energy_types);
      record.measurement_unit = output_energy_types?.unit || '';
    } else {
      record.measurement_unit = '';
    }
  };

  // 当投入品种改变时的处理函数
  const onInputVarietyChange = (record: Usage) => {
    if (record.input_variety) {
      const input_variety = record._specific_usage!.input_variety!.find(v => v.value === record.input_variety);
      record.input_unit = input_variety?.unit || '';
    } else {
      record.input_unit = '';
    }
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
    return JSON.parse(JSON.stringify(props.devices.map((d, i) => {
      const device = { ...d, serial_number: i + 1 };
      delete device._device_type;
      device.usages = d.usages.map(u => {
        const usage = { ...u, serial_number: device.serial_number };
        delete usage._main_usage;
        delete usage._specific_usage;
        return usage;
      });
      return device;
    })));
  };


  // 年投入量变化时的处理函数,计算设备的年投入量总和
  const onInputQuantityChange = (device: Device) => {
     if (!device.usages || device.usages.length === 0) {
      device.input_quantity = 0;
      emitDeviceTotalInputChange();
      return;
    }

    const total = device.usages.reduce((sum: number, usage: Usage) => {
      // 过滤掉未选择投入品种的项
      if (!usage.input_quantity || !usage.input_variety) {
        return sum;
      }
      if (!['原煤', '洗精煤', '其他洗煤','煤制品'].includes(usage.input_variety)) {
        return sum;
      }
      return floatSum([sum, usage.input_quantity!]);
    }, 0);
    device.input_quantity = total;
    emitDeviceTotalInputChange();
  };

  // 监听 props.devices 变化，添加临时属性
  watch(
    () => props.devices,
    (newDevices) => {
      console.log('watch props.devices', newDevices);
      newDevices.forEach((device: Device) => {
        // 添加或更新 _device_type
        if (device.equipment_type) {
          device._device_type = deviceTypes.find(d => d.value === device.equipment_type);
        }
        
        // 为每个用途添加临时属性
        device.usages.forEach((usage: Usage) => {
          // 添加或更新 _main_usage
          if (usage.main_usage && device._device_type?.children) {
            usage._main_usage = device._device_type.children.find(c => c.value === usage.main_usage);
          }
          
          // 添加或更新 _specific_usage
          if (usage.specific_usage && usage._main_usage?.specific_usage) {
            usage._specific_usage = usage._main_usage.specific_usage.find(s => s.value === usage.specific_usage);
          }
        });
      });

      formState.devices = newDevices;
      emitDeviceUsageChange();
      emitDeviceTotalInputChange();
    },
    {immediate: true}
  );

  // 监听 props.filingData 变化，更新 filingData
  watch(
    () => props.filingData,
    (newVal) => {
      filingData = newVal || {}
    }
  );

  // 监听设备编号变化，触发重复验证
  watch(
    () => formState.devices.map(d => d.coal_no),
    () => {
      nextTick(() => {
        formState.devices.forEach((device: Device, index: number) => {
          // 只校验有值的编号，避免新添加的设备触发校验
          if (device.coal_no) {
            formRef.value?.validateFields([['devices', index, 'coal_no']]);          
          }
        });
      });
    },
    { deep: true }
  );

  // 监听投入品种变化，重新计算设备的年投入量
  watch(
    () => formState.devices.map(device => 
      device.usages.map(usage => usage.input_variety)
    ),
    () => {
      formState.devices.forEach(device => {
        onInputQuantityChange(device);
      });
    },
    { deep: true }
  );

  // 监听用途明细四个字段变化，触发重复校验
  watch(
    () => formState.devices.map(device =>
      device.usages.map(usage => ({
        main_usage: usage.main_usage,
        specific_usage: usage.specific_usage,
        input_variety: usage.input_variety,
        output_energy_types: usage.output_energy_types
      }))
    ),
    (newVal, oldVal) => {
      nextTick(() => {
        formState.devices.forEach((device: Device, deviceIndex: number) => {
          device.usages.forEach((usage: Usage, usageIndex: number) => {
            const fieldsToValidate: [string, number, string, number, string][] = [];
            if (usage.main_usage && usage.specific_usage && usage.input_variety && usage.output_energy_types) {
              formRef.value?.validateFields([
                ['devices', deviceIndex, 'usages', usageIndex, 'main_usage'],
                ['devices', deviceIndex, 'usages', usageIndex, 'specific_usage'],
                ['devices', deviceIndex, 'usages', usageIndex, 'input_variety'],
                ['devices', deviceIndex, 'usages', usageIndex, 'output_energy_types']
            ]);
            }
          });
        });
      });
    },
    { deep: true }
  );

  // 监听设备类型和自备电厂用锅炉字段变化，发送事件
  watch(
    () => formState.devices.map(device => (device.equipment_type || '') + (device.is_captive_power_plant_boiler || '')),
    () => {
      console.log('设备类型或自备电厂用锅炉字段变化');
      deviceChange$.next(Date.now());
    },
    { deep: true }
  );

  defineExpose({
    validateForm,
    getFormData,
    clearValidate: () => formRef.value?.clearValidate(),
  });


  interface Usage {
    obj_id?: string;
    main_usage?: string;
    specific_usage?: string;
    input_variety?: string;
    input_unit?: string;
    input_quantity?: number;
    output_energy_types?: string;
    measurement_unit?: string;
    output_quantity?: number;
    remarks?: string;

    // 缓存主要用途，用于显示选项标签
    _main_usage?: MainUsage;
    // 缓存具体用途，用于显示选项标签
    _specific_usage?: SpecificUsage;
  }

  interface Device {
    obj_id?: string;
    equipment_type?: string;
    is_captive_power_plant_boiler?: string;
    coal_no?: string;
    equipment_model?: string;
    usage_time?: number;
    design_life?: number;
    enecrgy_efficienct_bmk?: string;
    capacity_unit?: string;
    capacity?: number;
    input_quantity?: number;
    usages: Usage[];

    // 缓存设备类型，用于显示选项标签
    _device_type?: DeviceType;
  }

</script>

<style scoped>
  .d-w {
    width: 100px;
  }

  .device-card {
    margin-bottom: 16px;
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
  }

  ::v-deep(.ant-card) {
    .ant-card-body {
      padding: 0 10px;
    }

    .ant-card-head {
      border: 0;
    }

    .ant-card-head-title {
      padding-bottom: 0 !important;
      font-weight: initial;
    }
  }

</style>
