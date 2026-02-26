<template>
  <div class="box flex-h">
    <div class="info-anchor">
      <a-anchor @click="handleClick" :offsetTop="60" >
        <a-anchor-link href="#baseInfo" title="单位基础信息填写" />
        <a-anchor-link href="#energySummary" title="单位能源消费综合信息" />
        <a-anchor-link href="#coalDetail" title="分品种煤炭消费情况" />
        <a-anchor-link href="#deviceUsage" title="分设备煤炭消费情况" />
      </a-anchor>
    </div>

    <a-card  :bordered="false"size="small" style="overflow: hidden;flex: 1;" >
      <template #extra>
        <a-space>
          <a-button @click="handleImportDBFile" type="primary" >导入db文件</a-button>
          <a-button @click="handleValidateData" type="primary" >数据校核</a-button>
          <a-button type="primary" :disabled="!canExport" @click="exportFile('db')">导出db文件</a-button>
          <!-- <a-button :disabled="!canExport" @click="exportFile('excel')">导出excel文件</a-button> -->
        </a-space>
      </template>

    
      <div class="box-content" style="overflow: auto;">
        <div :style="{minWidth: currentStep === 3 ? '1310px' : '100%', paddingBottom: '24px', height: '100%'}">
          <div v-if="currentStep >= 0">
            <div id="baseInfo" class="titile-line">（1）单位基础信息填写</div>
            <Part1BaseInfo v-if="currentStep >= 0" ref="baseInfoRef"  v-model:baseInfo="formData.baseInfo" v-model:filingData="formData" />
          </div>
          <div v-if="currentStep >= 1" >
            <div id="energySummary" class="titile-line">（2）单位能源消费综合信息<b class="ant-form-item-explain-error">（保留2位小数数字）</b></div>
            <Part2EnergySummary ref="energySummaryRef" v-model:energy="formData.energy" v-model:filingData="formData" />
          </div>
          <div v-if="currentStep >= 2" style="margin-bottom: 24px;">
            <div id="coalDetail" class="titile-line">（3）分品种煤炭消费情况<b class="ant-form-item-explain-error">（保留2位小数数字）</b></div>
            <Part3CoalDetail ref="coalDetailRef" v-model:coal="formData.coal" v-model:filingData="formData" />
          </div>
          <div v-if="currentStep >= 3">
            <div id="deviceUsage" class="titile-line">（4）分设备煤炭消费情况</div>
            <Part4DeviceUsage ref="deviceUsageRef" v-model:devices="formData.devices" v-model:filingData="formData" />
          </div>
        </div>

        <div class="button-footer">
          <a-button v-if="currentStep < 3" type="primary" style="width: 150px;" @click="handleNextStep">下一步</a-button>
        </div>
      </div>
    </a-card>

    <a-modal v-model:visible="importModalVisible" title="导入db文件" width="600px" ok-text="导入" cancel-text="取消" :ok-button-props="{ loading: importing }" @cancel="importModalVisible = false" :maskClosable="false" @ok="handleImportSubmit">
      <a-upload-dragger
        v-model:fileList="fileList"
        name="file"
        :multiple="false"
        accept=".db"
        :max-count="1"
        :before-upload="beforeUpload"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p class="ant-upload-hint">支持.db格式文件</p>
      </a-upload-dragger>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, defineAsyncComponent } from 'vue';
  import { Modal, message } from 'ant-design-vue';
  import { InboxOutlined } from '@ant-design/icons-vue';
  import { http } from '@/util/http';
  import type { UploadProps } from 'ant-design-vue';
  import { FilingData } from './components/device_types';
import { UUID } from '@/util';
import { downloadByAjaxResponse } from '@/util/download';

  const Part1BaseInfo = defineAsyncComponent(() => import('./components/Part1BaseInfo.vue'));
  const Part2EnergySummary = defineAsyncComponent(() => import('./components/Part2EnergySummary.vue'));
  const Part3CoalDetail = defineAsyncComponent(() => import('./components/Part3CoalDetail.vue'));
  const Part4DeviceUsage = defineAsyncComponent(() => import('./components/Part4DeviceUsage.vue'));

  const baseInfoRef = ref<typeof Part1BaseInfo>();
  const energySummaryRef = ref<typeof Part2EnergySummary>();
  const coalDetailRef = ref<typeof Part3CoalDetail>();
  const deviceUsageRef = ref<typeof Part4DeviceUsage>();
  const forms = [baseInfoRef, energySummaryRef, coalDetailRef, deviceUsageRef];

  const currentStep = ref(0);
  const canExport = ref(false);
  const validationPassed = ref(false);
  const importModalVisible = ref(false);
  const fileList = ref<UploadProps['fileList']>([]);
  const importing = ref(false);

  const formData = reactive({
    baseInfo: { stat_date: '2025' },
    energy: {},
    coal: {},
    devices: []
  });

  const getContainer = () => document.querySelector('.content');

  /**
   * 获取当前表单数据
   * @returns 包含所有表单数据的对象
   */
  const getFormData = () => {
    const names = ['baseInfo', 'energy', 'coal', 'devices'];
    const data: Record<string, any> = {};
    names.forEach(name => data[name] = forms[names.indexOf(name)].value?.getFormData());
    // 添加对象的 obj_id, stat_date, unit_name, credit_code
    const commonFields = {
      stat_date: data.baseInfo.stat_date,
      unit_name: data.baseInfo.unit_name,
      credit_code: data.baseInfo.credit_code
    };

    Object.assign(data.energy, commonFields, { obj_id: data.energy.obj_id || UUID()});
    Object.assign(data.coal, commonFields, { obj_id: data.coal.obj_id || UUID()});

    data.devices.forEach((device: any) => {
      Object.assign(device, commonFields);
      device.usages.forEach((usage: any) => {
        Object.assign(usage, commonFields);
      });
    });

    return data;
  };

  const handleValidateData = async () => {
    if ( currentStep.value !== 3) {
      message.error('请先完成所有步骤');
      return;
    }

    // 校验所有表单，当验证失败切换tab到当前tab
    const valid = await Promise.all(forms.map(form => form.value?.validateForm() || false));
    if (!valid.every(v => v)) {
      message.error('请先完成所有步骤');
      return;
    }

    // 获取当前表单数据
    const data = getFormData();

     if (data.energy.annual_raw_coal > 0) {
      const found = data.devices.some((device: any) => (device.usages||[]).some((usage: any) => usage.main_usage == '原料'))
      if (!found) {
        message.error('年原料用煤消费量>0时，请在主要用途中列出“原料”数据');
        currentStep.value = 3;
        return;
      }
    }

    const res = await http.post('/data/filing/validate', data);
    validationPassed.value = true;
    canExport.value = true;

    if (res.success) {
      validationPassed.value = true;
      canExport.value = true;
      message.success('校验通过');
    } else {
      Modal.confirm({
        title: '校验未通过',
        content: '数据存在异常，是否继续并允许下载文件？',
        onOk: () => {
          canExport.value = true;
          validationPassed.value = false;
        },
        onCancel: () => {
          canExport.value = false;
        }
      });
    }
  };

  const handleNextStep = async () => {
    if (currentStep.value === 3) return;
    const currentForm = forms[currentStep.value].value!;
    const valid = await currentForm.validateForm();
    if (valid) {
      currentStep.value++;
    }
  };

  const handleImportDBFile = () => {
    importModalVisible.value = true;
    fileList.value = [];
  };

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isDb = /\.db$/i.test(file.name);
    if (!isDb) {
      message.error('只能上传.db格式的文件');
      setTimeout(() => (fileList.value = []));
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('文件大小不能超过5MB');
      setTimeout(() => (fileList.value = []));
      return false;
    }
    return false;
  };

  const handleImportSubmit = async () => {
    if (!fileList.value || fileList.value.length === 0) {
      message.error('请选择文件');
      return;
    }
    importing.value = true;
    try {
      const form = new FormData();
      form.append('file', fileList.value[0].originFileObj as File);
      const res = await http.post<FilingData>('/data/filing/import/db', form);
      Object.assign(formData, res);
      message.success('导入成功');
      currentStep.value = 3;
      // 重置所有表单校验状态
      forms.forEach(form => form?.value?.clearValidate());
    } finally {
      importModalVisible.value = false;
      importing.value = false;
    }
  };

  const exportFile = async (type: string) => {
    const res = await http.get(`/data/filing/export/db`, null, { observe: 'response', responseType: 'blob' });
    downloadByAjaxResponse(res);
  };

  const handleClick = (e: any) => {
    e.preventDefault();
  };

  const initFormData = () => {
    http.get('/data/filing/getdb').then(res => {
      if (!res) return;
      Object.assign(formData, res);
      currentStep.value = 3;
    });
  };

initFormData();
</script>

<style scoped lang="less">
  .box {
    background: #f0f2f5;
    min-height: 100%;
  }

  ::v-deep(.ant-card) .ant-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .button-footer {
    border-top: 1px solid #e8e8e8;
    padding-top: 10px;
    text-align: center;
  }

  .titile-line{
    border-bottom: 1px solid #4874cb;
    padding-bottom: 10px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
  }

  .info-anchor {
    width: 175px;
    background-color: #fff;
    margin-right: 12px;
    padding-left: 5px;
  }
</style>
