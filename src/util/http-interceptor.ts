import { HttpInterceptor } from './http';
import { catchError, finalize, map, Observable, switchMap } from 'rxjs';
import { globalLoading } from '@/components/globalLoading';
import { userService } from '@/hook/user.service';
import { Constant } from '@/views/constant';
import { getEnvValue } from '@/hook/useAppConfig';

  let loginBack = false;
  function handleLoginBack() {
    if (!loginBack) {
      loginBack = true;
      // 登录失效，提示重新登录
      // @ts-ignore
      window.$modal.error({
        title: '提示：',
        okText: '重新登录',
        content: '登录已失效， 请重新登录',
        onOk: () => {
          loginBack = false;
          userService.clearCache();
          window.location.reload();
        }
      })
    }
  }

export function httpSetup() {
  let requestCount = 0;
  HttpInterceptor.request = function (config) {
    if (config.loading !== false) {
      requestCount++;
      globalLoading.startLoading();
    }

    let url = config.url!;
    if (!/^http/i.test(url)) {
      if (url.charAt(0) !== '/') {
        url = '/' + url;
      }
      url = (getEnvValue('M_BASE_API') ) + url;
    }
    config.url = url;

    if (config.method === 'GET' || config.method === 'DELETE') {
      config.params ||= {};
      config.params.r = Date.now();
    }
   
    const token = userService.getToken();
    if (token) {
       config.headers ||= {};
      // @ts-ignore
      config.headers['Authorization'] = token;
    }
    return config;
  };


  HttpInterceptor.response = function (config, response) {
    return response.pipe(
      finalize(() => {
        if (config.loading !== false) {
          requestCount--;
          if (requestCount === 0) {
            globalLoading.endLoading();
          }
        }
      }),
      switchMap(result => {
        return new Observable<any>(observe => {
          if (!result) {
            observe.error({ bizError: false, status: 0, message: '发生未知错误' });
            return;
          }

          if (config.responseType === 'json') {
            if (result.code != 200) {
              observe.error({ bizError: true, status: result.code, message: result.message ?? '未知错误' });
              return;
            }
            observe.next(result.data);
            observe.complete();
            return;
          }

          if (result.response instanceof Blob && result.response.type === 'application/json') {
            result.response.text().then((text: string) => {
              const err = JSON.parse(text) as { code: number; message: string };
              observe.error({ bizError: true, status: err.code, message: err.message ?? '未知错误' });
            });
            return;
          }

          if (result.response instanceof ArrayBuffer && result.responseHeaders['content-type'].indexOf('application/json') >= 0) {
            const text = arrayBufferToString(result.response);
            const err = JSON.parse(text) as { code: number; message: string };
            observe.error({ bizError: true, status: err.code, message: err.message ?? '未知错误' });
            return;
          }

          observe.next(result);
          observe.complete();
        });
      }),
      catchError((err: HttpErrorInfo) => {
        if (err.bizError) {
          if (err.status == 402) {
            handleLoginBack();
          } else {
            window.$message.error(err.message);
          }
        } else if(config.showError !== false){
          if (err.status == 403) {
            window.$message.error('你没有权限访问');
          } else if (err.status == 404) {
            window.$message.error('你访问的地址不存在, 请检查');
          } else {
            window.$message.error('服务器发生错误, 请联系管理员');
          }
        }
        throw err;
      })
    );
  };
}

export interface HttpErrorInfo {
  bizError: boolean;
  status: number;
  message: string;
}

function arrayBufferToString(buffer: ArrayBuffer, encoding = 'utf-8') {
  const decoder = new TextDecoder(encoding);
  return decoder.decode(buffer);
}
