/**
 * 获取环境变量值
 * @param key 环境变量键名
 * @returns 环境变量值
 */
export function getEnvValue(key: string): string {
  return ENV[key]  || '';
}

/**
 * 环境变量对象
 */
export const ENV: Record<string, string> = Object.assign({}, import.meta.env, (window as any).__APP_CONFIG__);

/**
 * 获取应用配置
 * @returns 应用配置对象
 */
export const useAppConfig = (): Record<string, string> => {
  return  ENV;
};