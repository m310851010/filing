
import { Observable, shareReplay } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserInfo } from './user-info';
import { http2 } from '@/util/http';
import { Constant } from '@/views/constant';

class UserService {
  private userInfo$?: Observable<UserInfo>;

  /**
   * 获取用户信息
   */
  getUserInfo(): Observable<UserInfo> {
    if (this.userInfo$) {
      return this.userInfo$;
    }
    this.userInfo$ = http2.get<UserInfo>('/system/user/info').pipe(shareReplay(1));
    return this.userInfo$;
  }

  /**
   * 退出登录
   */
  logout(): Observable<void> {
    return http2.get<void>('/system/security/logout').pipe(finalize(() => this.clearCache()));
  }

  /**
   * 清空用户信息
   */
  clearUserInfo(): void {
    this.userInfo$ = undefined;
  }

  /**
   * 获取token
   */
  getToken(): string | null {
    const token = localStorage.getItem(Constant.AUTH_TOKEN_KEY);
    return token ? encodeURIComponent(token) : null;
  }

  /**
   * 是否已登录
   */
  isLogin(): boolean {
    return !!this.getToken();
  }

  /**
   * 删除token
   */
  clearCache(): void {
    localStorage.removeItem(Constant.AUTH_TOKEN_KEY);
    this.clearUserInfo();
  }
}

export const userService = new UserService();