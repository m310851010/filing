import { http, http2 } from '@/util/http';
import { firstValueFrom, map, Observable, shareReplay } from 'rxjs';
import { tap } from 'rxjs/operators';
import { sm3 } from 'sm-crypto-v2';
import { Constant } from '../constant';

/**
 * 登录
 * @param loginModel 登录数据
 */
export function login(loginModel: LoginModel): Promise<string> {
  const password = sm3(loginModel.password);
  return firstValueFrom(
    http2
      .post<string>(
        '/system/security/auth',
        {
          ...loginModel,
          password
        },
        { loading: false }
      )
      .pipe(tap(token => localStorage.setItem(Constant.AUTH_TOKEN_KEY, token)))
  );
}

/**
 * 获取验证码
 */
export function getCaptcha(): Promise<CaptchaInfo> {
  return http.get<CaptchaInfo>('/system/security/verification/code', null, { loading: false });
}

/**
 * 是否验证码
 */
export function codeEnable(): Observable<boolean> {
  return http2.get<string>('/system/config/getCodeEnable').pipe(
    map(v => v === 'true'),
    shareReplay(1)
  );
}

/**
 * 获取短信验证码有效期
 * @returns 短信验证码有效期
 */
export function getSmsValidTime(): Promise<number> {
  return http.get<number>('/system/config/smsValidTime');
}

/**
 * 发送短信验证码
 * @param phone 手机号
 * @param uuid 唯一标识
 * @param verifyCode 验证码
 * @returns 短信验证码id
 */
export function sendSmsCode(phone: string, uuid: string, verifyCode: string): Promise<string> {
  return http.post<string>('/system/security/verification/smsCode', { phone, uuid, verifyCode }, { loading: false });
}

/**
 * 注册
 * @param model 注册数据
 */
export function register(model: RegisterModel): Promise<string> {
  const password = sm3(model.password);
  return http.post<string>('/system/security/register', { ...model, password }, { loading: false });
}

/**
 * 登录数据模型
 */
export interface LoginModel {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 验证码
   */
  verifyCode: string;
  /**
   * 用户类型
   */
  userType?: number;
  /**
   * uuid 唯一标识
   */
  uuid: string;

  /**
   * 是否记住密码
   */
  remember?: boolean;
}

/**
 * 验证码信息
 */
export interface CaptchaInfo {
  /**
   * uuid 唯一标识
   */
  uuid: string;
  /**
   * 验证码
   */
  img: string;
}

export interface RegisterModel extends LoginModel {
  /**
   * 确认密码
   */
  phone: string;
  /**
   * 短信验证码
   */
  smsCode: string;
  /**
   * 短信验证码id
   */
  smsId: string;
}
