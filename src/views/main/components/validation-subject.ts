import { Subject } from 'rxjs';

/**
 * 煤消费量验证数据
 */
export interface CoalValidationData {
  /**
   * 原料用煤消费量
   */
  raw_coal_consumption: number;
  /**
   * 清煤用煤消费量
   */ 
  clean_coal_consumption: number;
  /**
   * 其他用煤消费量
   */ 
  other_coal_consumption: number;
}

/**
 * 设备用途验证数据
 */
export interface DeviceUsageValidationData {
  /**
   * 是否有原料用数据
   */
  hasRawMaterial: boolean;
}

export interface DeviceTotalInputData {
  totalInputQuantity: number;
}

export const coalConsumptionChange$ = new Subject<CoalValidationData>();
export const deviceUsageChange$ = new Subject<DeviceUsageValidationData>();
export const deviceTotalInputChange$ = new Subject<DeviceTotalInputData>();

