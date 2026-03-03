import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { ref } from 'vue';


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
 * 设备变化验证数据
 */
export interface DeviceChangeValidationData {
  /**
   * 是否有发电锅炉
   */
  hasPowerBoiler: boolean;
  /**
   * 是否有发电锅炉选择自备电厂用锅炉
   */
  hasCaptivePowerPlantBoiler: boolean;
}

/**
 * 煤消费量变更事件
 */
export const coalConsumptionChange$ = new ReplaySubject<CoalValidationData>(1);
/**
 * 设备用途变更事件
 */
export const deviceUsageChange$ = new ReplaySubject<DeviceUsageValidationData>(1);
/**
 * 设备输入量变更事件
 */
export const deviceTotalInputChange$ = new ReplaySubject<DeviceTotalInputData>(1);
/**
 * 设备变化事件
 */
export const deviceChange$ = new ReplaySubject<number>(1);

/**
 * 当前步骤
 */
export const currentStepRef = ref(0);
