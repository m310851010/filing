import { BehaviorSubject, Subject } from 'rxjs';


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

/**
 * 煤消费量变更事件
 */
export const coalConsumptionChange$ = new Subject<CoalValidationData>();
/**
 * 设备用途变更事件
 */
export const deviceUsageChange$ = new Subject<DeviceUsageValidationData>();
/**
 * 设备输入量变更事件
 */
export const deviceTotalInputChange$ = new Subject<DeviceTotalInputData>();

/**
 * 当前步骤
 */
export const currentStepRef = ref(0);
