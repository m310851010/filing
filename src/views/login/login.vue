<template>
  <LoginCard>
    <div class="login-form-content">
      <h1 class="title">{{ M_APP_NAME }}</h1>
      <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical" class="login-form" @finish="handleLogin">
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

        <!-- <a-form-item name="phone">
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
        -->

        <div class="form-options">
          <a-checkbox v-model:checked="formState.remember">记住用户</a-checkbox>
          <a v-if="userType === 1" class="register-link" @click="handleRegisterClick">立即注册</a>
        </div> 

        <a-form-item class="submit-btn-row">
          <a-button type="primary" html-type="submit" size="large" block :loading="loading" class="login-button">登 录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </LoginCard>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { UserOutlined, LockOutlined, SafetyCertificateOutlined, PhoneOutlined, MessageOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import type { FormInstance } from 'ant-design-vue';
  import LoginCard from './login-card.vue';
  import { login, getCaptcha, getSmsValidTime, sendSmsCode, type LoginModel } from './login.service';
  import { useAppConfig } from '@/hook/useAppConfig';
  const { M_APP_NAME, M_LOGIN_TYPE, mode } = useAppConfig();

  // 状态定义
  const router = useRouter();
  const userType = ref<number>(Number(M_LOGIN_TYPE)); // tab key
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

  const defaultFormState = import.meta.env.DEV? {
    username: 'test1234',
    password: 'Test@1234!',
    // phone: '13512345678',
    smsCode: '1',
  }: {};
  
  const formState = reactive({
    username: '',
    password: '',
    // phone: '',
    // smsCode: '',
    verifyCode: '',
    ...defaultFormState,
    remember: false
  });

  // 表单验证规则
  const rules = {
    username: [{ required: true, message: '请输入用户名' }],
    password: [{ required: true, message: '请输入密码' }],
    verifyCode: [{ required: true, message: '请输入验证码' }],
    // phone: [
    //   { required: true, message: '请输入手机号' },
    //   { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
    // ],
    // smsCode: [{ required: true, message: '请输入手机验证码' }]
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

  // 登录逻辑
  const handleLogin = async (values: any) => {
    loading.value = true;

    const loginModel: LoginModel = {
      ...values,
      uuid: uuid.value,
      userType: userType.value
    };

    try {
      await login(loginModel);
      message.success(`${userType.value === 2 ? '政府' : '个人'}用户登录成功！`);

      // 路由跳转
      router.push('/main');
    } catch (error) {
      // 登录失败后刷新验证码
      refreshCaptcha();
    } finally {
      loading.value = false;
    }
  };

  // 注册点击事件
  const handleRegisterClick = () => {
    router.push('/register');
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
  /*const handleGetSmsCode = async () => {
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
  };*/

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

  /* Tabs 样式微调 */
  :deep(.ant-tabs-nav) {
    margin-bottom: 24px;
  }

  :deep(.ant-tabs-tab) {
    font-size: 16px;
    padding: 12px 0;
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
</style>
