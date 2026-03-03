<template>
  <div class="box flex-h">
    <div class="info-anchor">
      <a-anchor @click="handleClick" :offsetTop="60" >
        <a-anchor-link href="#unitInfo" title="填写单位属性" />
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
          <a-button type="primary" :disabled="currentStep <= 2" @click="handleExportDBFile">导出db文件</a-button>
          <a-button :disabled="true" >导出excel文件</a-button> 
        </a-space>
      </template>

      <div class="box-content" style="overflow: auto;">
        <div :style="{minWidth: currentStep === 3 ? '1310px' : '100%', paddingBottom: '24px', height: '100%'}">
          <div v-if="currentStep >= 0">
            <div id="unitInfo" class="titile-line">（1）填写单位属性</div>
            <Part0UnitInfo ref="unitInfoRef" v-model:unitInfo="formData.unitInfo" v-model:filingData="formData" />
          </div>
          <div v-if="currentStep >= 1">
            <div id="baseInfo" class="titile-line">（2）填写单位基础信息</div>
            <Part1BaseInfo ref="baseInfoRef" v-model:baseInfo="formData.baseInfo" v-model:filingData="formData" />
          </div>
          <div v-if="currentStep >= 2" >
            <div id="energySummary" class="titile-line">（3）单位能源消费综合信息<b class="ant-form-item-explain-error">（保留2位小数数字）</b></div>
            <Part2EnergySummary ref="energySummaryRef" v-model:energy="formData.energy" v-model:filingData="formData" />
          </div>
          <div v-if="currentStep >= 3" style="margin-bottom: 24px;">
            <div id="coalDetail" class="titile-line">（4）分品种煤炭消费情况<b class="ant-form-item-explain-error">（保留2位小数数字）</b></div>
            <Part3CoalDetail ref="coalDetailRef" v-model:coal="formData.coal" v-model:filingData="formData" />
          </div>
          <div v-if="currentStep >= 4">
            <div id="deviceUsage" class="titile-line">（5）分设备煤炭消费情况</div> 
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
import { currentStepRef } from './components/validation-subject';

  const Part0UnitInfo = defineAsyncComponent(() => import('./components/Part0UnitInfo.vue'));
  const Part1BaseInfo = defineAsyncComponent(() => import('./components/Part1BaseInfo.vue'));
  const Part2EnergySummary = defineAsyncComponent(() => import('./components/Part2EnergySummary.vue'));
  const Part3CoalDetail = defineAsyncComponent(() => import('./components/Part3CoalDetail.vue'));
  const Part4DeviceUsage = defineAsyncComponent(() => import('./components/Part4DeviceUsage.vue'));

  const unitInfoRef = ref<typeof Part0UnitInfo>();
  const baseInfoRef = ref<typeof Part1BaseInfo>();
  const energySummaryRef = ref<typeof Part2EnergySummary>();
  const coalDetailRef = ref<typeof Part3CoalDetail>();
  const deviceUsageRef = ref<typeof Part4DeviceUsage>();
  const forms = [unitInfoRef, baseInfoRef, energySummaryRef, coalDetailRef, deviceUsageRef];

  const currentStep = ref(0);
  const importModalVisible = ref(false);
  const fileList = ref<UploadProps['fileList']>([]);
  const importing = ref(false);

  const formData = reactive({
    unitInfo: {},
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
  const getFormData = async () => {
    const data: Record<string, any> = {};

    const unitInfoValid = await unitInfoRef.value!.validateForm();
    if (!unitInfoValid) {
      message.error('请填写完整单位属性');
      return null;
    }
    
    const baseInfoValid = await baseInfoRef.value!.validateForm();
    if (!baseInfoValid) {
      message.error('请填写完整单位基础信息');
      return null;
    }
     
    data.baseInfo = baseInfoRef.value!.getFormData();
     // 添加对象的 obj_id, stat_date, unit_name, credit_code
    const commonFields = {
      stat_date: data.baseInfo.stat_date,
      unit_name: data.baseInfo.unit_name,
      credit_code: data.baseInfo.credit_code
    };

    const names = ['baseInfo', 'energy', 'coal', 'devices'];
    names.forEach(name => {
      const index = names.indexOf(name);
      if (forms[index] && forms[index].value) {
        data[name] = forms[index].value!.getFormData();
        Object.assign(data[name], commonFields);
      }
    });

    if (deviceUsageRef.value) {
        data.devices.forEach((device: any) => {
          Object.assign(device, commonFields);
          device.usages.forEach((usage: any) => {
            Object.assign(usage, commonFields);
          });
        });
    }

    return data;
  };


/**
 * 验证失败导出db文件
 * @param data 导出数据
 */
  const handleInvlidaExportDb = async (data: Record<string, any> | null | undefined) => {
    if (!data) return;
    Modal.confirm({
        title: '校验未通过',
        content: '数据校验未通过，是否继续并下载文件？',
        okText: '继续下载文件',
        onOk: async () => {
          data.checkStatus = '2';
          await http.post('/data/filing/validate', data);
          await downloadDBFile();
        }
      });
  }

  const handleValidateData = async () => {
    if ( currentStep.value !== 3) {
      const data = await getFormData();
      handleInvlidaExportDb(data);
      return;
    }
    
    // 校验所有表单
    const valid = await Promise.all(forms.map(form => form.value?.validateForm() || false));
    if (!valid.every(v => v)) {
      const data = await getFormData();
      handleInvlidaExportDb(data);
      return;
    }

    // 获取当前表单数据
    const data = await getFormData();
    if (!data) return;

    data.checkStatus = '1';
    const res = await http.post('/data/filing/validate', data);
    if (res.success) {
      message.success('校验通过');
    }
  };

  const handleNextStep = async () => {
    if (currentStep.value === 3) return;
    const currentForm = forms[currentStep.value].value!;
    const valid = await currentForm.validateForm();
    if (valid) {
      currentStep.value++;
      currentStepRef.value = currentStep.value;
    }
  };

  const handleImportDBFile = () => {
    importModalVisible.value = true;
    fileList.value = [];
  };

  const beforeUpload: UploadProps['beforeUpload'] = (file: any) => {
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
      currentStepRef.value = 3;
      
      // 重置所有表单校验状态
      forms.forEach(form => form?.value?.clearValidate());
      importModalVisible.value = false;
    } finally {
      importing.value = false;
    }
  };

  /**
   * 处理导出db文件
   */
  const handleExportDBFile = async () => {
    // 获取当前表单数据
    const data = await getFormData();
    if (!data) return;
    data.checkStatus = '0';
    await http.post('/data/filing/validate', data);
    await downloadDBFile();
  };

  /**
   * 下载db文件
   */
   const downloadDBFile = async () => {
    const res = await http.get(`/data/filing/export/db`, null, { observe: 'response', responseType: 'blob' });
    downloadByAjaxResponse(res);
  };

  const handleClick = (e: any) => {
    e.preventDefault();
  };

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
