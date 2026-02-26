<template>
  <LoginCard>
    <div class="login-form-content">
      <h1 class="title">个人注册</h1>

      <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical" class="register-form" @finish="handleRegister">
        <a-form-item name="username">
          <a-input v-model:value="formState.username" placeholder="请输入用户名" size="large">
            <template #prefix>
              <UserOutlined class="input-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="password">
          <a-input-password v-model:value="formState.password" placeholder="请输入密码" size="large">
            <template #prefix>
              <LockOutlined class="input-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="confirmPassword">
          <a-input-password v-model:value="formState.confirmPassword" placeholder="请再次输入密码" size="large">
            <template #prefix>
              <LockOutlined class="input-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="verifyCode">
          <div class="ant-input" style="padding: 0">
            <div class="login-verify" @click="refreshCaptcha" title="点击刷新">
              <img v-if="captchaUrl" :src="captchaUrl" alt="验证码" />
              <div v-else class="captcha-placeholder">加载中...</div>
            </div>

            <a-input v-model:value="formState.verifyCode" placeholder="验证码" size="large" :bordered="false" style="width: 40%">
              <template #prefix>
                <SafetyCertificateOutlined class="input-icon" />
              </template>
            </a-input>
          </div>
        </a-form-item>

        <a-form-item name="phone">
          <a-input v-model:value="formState.phone" placeholder="请输入手机号" size="large">
            <template #prefix>
              <PhoneOutlined class="input-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="smsCode">
          <a-input-group compact>
            <a-input v-model:value="formState.smsCode" placeholder="请输入手机验证码" size="large" style="width: 60%">
              <template #prefix>
                <MessageOutlined class="input-icon" />
              </template>
            </a-input>
            <a-button
              type="primary"
              size="large"
              class="get-sms-code-btn"
              :disabled="countdown > 0"
              :loading="smsLoading"
              @click="handleGetSmsCode"
              style="width: 40%"
            >
              {{ countdown > 0 ? `${countdown}秒` : '获取验证码' }}
            </a-button>
          </a-input-group>
        </a-form-item>

        <div class="button-row">
          <a-button type="primary" html-type="submit" size="large" class="register-button" :loading="loading" block>立即注册</a-button>
          <a-button size="large" class="back-login-button" @click="handleBackLogin" block>返回登录</a-button>
        </div>
      </a-form>
    </div>
  </LoginCard>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Modal } from 'ant-design-vue';
  import { UserOutlined, LockOutlined, SafetyCertificateOutlined, PhoneOutlined, MessageOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import type { FormInstance } from 'ant-design-vue';
  import { getCaptcha, getSmsValidTime, sendSmsCode, register } from './login.service';
  import LoginCard from './login-card.vue';

  // 状态定义
  const router = useRouter();
  const loading = ref<boolean>(false);
  const smsLoading = ref<boolean>(false);
  const captchaUrl = ref<string>('');
  const formRef = ref<FormInstance>();
  const uuid = ref<string>('');
  const countdown = ref<number>(0);
  const timer = ref<number | null>(null);
  // 短信验证码 ID
  let smsId: string = '';

  const SMS_COUNTDOWN_KEY = 'sms_countdown_end_time';
  let SMS_COUNTDOWN_DURATION: number = 0;

  const formState = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    verifyCode: '',
    phone: '',
    smsCode: ''
  });

  // 验证确认密码
  const validateConfirmPassword = (rule: any, value: string) => {
    if (value === formState.password) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('两次输入的密码不一致'));
  };

  // 表单验证规则
  const rules = {
    username: [
      { required: true, message: '请输入用户名' },
      { pattern: /^[a-zA-Z0-9]{6,18}$/, message: '用户名由6~18个英文字符或数字组成！' }
    ],
    password: [
      { required: true, message: '请输入密码' },
      {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,18}$/,
        message: '密码必须由8~18位的大小写字母、数字和特殊字符组成！'
      }
    ],
    confirmPassword: [
      { required: true, message: '请确认密码' },
      { validator: validateConfirmPassword, message: '两次输入的密码不一致' }
    ],
    verifyCode: [{ required: true, message: '请输入验证码' }],
    phone: [
      { required: true, message: '请输入手机号' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
    ],
    smsCode: [{ required: true, message: '请输入手机验证码' }]
  };

  // 获取验证码逻辑
  const refreshCaptcha = async () => {
    try {
      const captcha = await getCaptcha();
      if (captcha) {
        captchaUrl.value = 'data:image/png;base64,' + captcha.img;
        uuid.value = captcha.uuid;
      }
    } catch (error) {
      message.error('验证码获取失败');
    }
  };

  // 计算剩余倒计时时间
  const calculateRemainingTime = () => {
    const countdownStr = localStorage.getItem(SMS_COUNTDOWN_KEY);
    if (!countdownStr) {
      return 0;
    }

    const remaining = parseInt(countdownStr, 10);

    if (remaining <= 0) {
      localStorage.removeItem(SMS_COUNTDOWN_KEY);
    }

    return remaining;
  };

  // 更新倒计时显示
  const updateCountdown = () => {
    const remaining = calculateRemainingTime();
    countdown.value = remaining;

    if (remaining > 0) {
      localStorage.setItem(SMS_COUNTDOWN_KEY, (remaining - 1).toString());
    } else if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  };

  // 获取短信验证码
  const handleGetSmsCode = async () => {
    // 验证手机号
    if (!formState.phone) {
      message.error('请输入手机号');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(formState.phone)) {
      message.error('请输入正确的手机号');
      return;
    }

    if (!formState.verifyCode) {
      message.error('请输入图形验证码');
      return;
    }

    smsLoading.value = true;

    try {
      // 获取短信验证码有效期
      SMS_COUNTDOWN_DURATION = await getSmsValidTime();
      // 发送短信验证码
      smsId = await sendSmsCode(formState.phone, uuid.value, formState.verifyCode);

      // 模拟获取短信验证码
      message.success('短信验证码已发送');

      // 存储倒计时数
      localStorage.setItem(SMS_COUNTDOWN_KEY, SMS_COUNTDOWN_DURATION.toString());

      // 开始倒计时
      countdown.value = SMS_COUNTDOWN_DURATION;

      if (timer.value) {
        clearInterval(timer.value);
      }

      timer.value = window.setInterval(() => {
        updateCountdown();
      }, 1000);
    } catch (error) {
      refreshCaptcha();
    } finally {
      smsLoading.value = false;
    }
  };

  // 注册逻辑
  const handleRegister = async (values: any) => {
    loading.value = true;

    try {
      // if (!smsId) {
      //   message.error('请先获取短信验证码');
      //   return;
      // }

      await register({
        password: values.password,
        phone: values.phone,
        smsCode: values.smsCode,
        verifyCode: values.verifyCode,
        username: values.username,
        uuid: uuid.value,
        smsId: smsId
      });

      localStorage.removeItem(SMS_COUNTDOWN_KEY);
      Modal.success({
        title: '注册成功',
        content: '恭喜您，注册成功！',
        okText: '去登录',
        onOk: () => {
          router.push('/login');
        }
      });
    } finally {
      loading.value = false;
    }
  };

  // 返回登录
  const handleBackLogin = () => {
    router.push('/login');
  };

  // 初始化
  onMounted(() => {
    refreshCaptcha();

    // 检查是否有剩余的倒计时
    const remaining = calculateRemainingTime();
    if (remaining > 0) {
      countdown.value = remaining;
      timer.value = window.setInterval(() => {
        updateCountdown();
      }, 1000);
    }
  });
</script>

<style scoped>
  @import './login-form.less';

  .form-hint {
    font-size: 12px;
    color: #999;
    margin-top: 8px;
  }

  /* 按钮行样式 */
  .button-row {
    display: flex;
    gap: 20px;
    margin-top: 30px;
    justify-content: center;
  }
</style>
