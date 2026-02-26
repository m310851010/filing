import { createApp } from 'vue';
import App from './App.vue';
import './style.less';
import router from './router';
import { ComponentPlugin } from '@/components';
import 'ant-design-vue/dist/antd.less';
import { httpSetup } from '@/util/http-interceptor';

const app = createApp(App);
app.use(router);
app.use(ComponentPlugin);

httpSetup();
app.mount('#app');
