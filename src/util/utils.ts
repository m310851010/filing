import { TableColumnType } from 'ant-design-vue';

/**
 * 新建列
 * @param columns
 */
export function newColumns<T = any>(...columns: TableColType[]) {
  const newColumns: TableColumnType<T>[] = [];
  for (const column of columns) {
    if (column.dataIndex || column.customRender || column.key || column.title) {
      const key = column.key || (column.dataIndex as string);
      column.key = key;
      column.dataIndex = key;
      column.ellipsis = true;
      column.align = 'center';
      newColumns.push(column);
      continue;
    }

    for (const key in column) {
      newColumns.push({
        title: (column as Record<string, string>)[key],
        dataIndex: key,
        key: key,
        align: 'center',
        ellipsis: true
      });
    }
  }
  return newColumns;
}
export type TableColType = Record<string, string> | TableColumnType;

/**
 * 生成uuid
 * @returns
 */
export function UUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * omit
 * @param obj
 * @param fields
 * @returns
 */
export function omit<T>(obj: T, fields: (keyof T)[]) {
  const shallowCopy = Object.assign({}, obj);
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}

/**
 * 获取文件名
 * @param filePath 文件路径
 * @returns 文件名
 */
export function getFileName(filePath: string) {
  //  兼容windows和linux
  filePath = filePath.replace(/\\/g, '/');
  return filePath.split('/').pop() || '';
}

/**
 * 获取文件扩展名
 * @param filePath
 */
export function getFileExtension(filePath: string) {
  return filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
}



/**
 * 遍历树结构
 * @param treeNodes TreeNode[]
 * @param accept 函数返回false即结束遍历, true或者undefined将继续遍历
 * @param childrenName 子节点字段名称
 */
export function forEachTree<T extends TreeNode>(
  treeNodes: T[] | undefined | null,
  accept: (node: T, parentNode: T | undefined, level: number) => boolean | void,
  childrenName: keyof T | TreeChildren<T> = 'children'
): void {
  if (!treeNodes || !treeNodes.length) {
    return;
  }

  const getChildren = typeof childrenName === 'string' ? (node: T) => node[childrenName] : (childrenName as TreeChildren<T>);

  let stack: T[] = [...treeNodes];
  const parents: { count: number; parent?: T; level: number }[] = [{ count: treeNodes.length, level: 0 }];
  let counter = 0;

  while (stack.length) {
    const item = stack.shift()!;
    const parent = parents[0];
    if (++counter === parent.count) {
      parents.shift();
      counter = 0;
    }
    if (accept(item, parent.parent, parent.level) === false) {
      return;
    }

    const children = getChildren(item, parent.parent, parent.level);
    if (children && children.length) {
      stack = stack.concat(children);
      parents.push({ count: children.length, parent: item, level: parent.level + 1 });
    }
  }
}

/**
 * 列表转树结构
 * @param list 列表数据
 * @param idName id的属性名
 * @param pidName parentId属性名
 * @param childrenName children属性名
 */
export function listToTree<T extends { pid?: string; id?: string; [key: string]: any }>(
  list: T[],
  idName: keyof T = 'id',
  pidName: keyof T = 'pid',
  childrenName: string = 'children'
): T[] {
  if (!list || !list.length) {
    return [];
  }
  const nodeMap: { [key: string]: any } = {};
  for (const node of list) {
    nodeMap[node[idName]] = node;
  }

  const treeNodes: T[] = [];
  for (const node of list) {
    const pid = node[pidName];
    const parent = nodeMap[node[pidName]];
    if (pid && parent) {
      // @ts-ignore
      parent[childrenName] ||= [];
      parent[childrenName].push(node);
    } else {
      treeNodes.push(node);
    }
  }
  return treeNodes;
}

/**
 * 打平树结构
 * @param treeNodes 树结构
 * @param accept 函数返回false即结束遍历, true或者undefined将继续遍历
 * @param childrenName 子节点字段名称
 */
export function flatTree<T extends TreeNode>(
  treeNodes: T[],
  accept: (node: T, parentNode: T | undefined, level: number) => boolean | void = () => true,
  childrenName: keyof T | TreeChildren<T> = 'children'
): T[] {
  const list: T[] = [];
  forEachTree(
    treeNodes,
    (node, parentNode, level) => {
      if (accept(node, parentNode, level) === false) {
        return;
      }
      list.push(node);
    },
    childrenName
  );
  return list;
}

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式
 * @returns 格式化后的日期
 */
export const formatDate  = (srcDate: Date, fmt: string) => {
    if (!srcDate) {
      return '';
    }
    const week = {
      0: '\u65e5',
      1: '\u4e00',
      2: '\u4e8c',
      3: '\u4e09',
      4: '\u56db',
      5: '\u4e94',
      6: '\u516d'
    };

    const o = {
      'M+': srcDate.getMonth() + 1,
      'd+': srcDate.getDate(),
      'h+': srcDate.getHours() % 12 === 0 ? 12 : srcDate.getHours() % 12,
      'H+': srcDate.getHours(),
      'm+': srcDate.getMinutes(),
      's+': srcDate.getSeconds(),
      'q+': Math.floor((srcDate.getMonth() + 3) / 3),
      'S+': srcDate.getMilliseconds(),
      'e+': srcDate.getDay(),
      // @ts-ignore
      E: week[srcDate.getDay()],
      'w+': (date => {
        const date2 = new Date(date.getFullYear(), 0, 1);
        const day = (date2.getDay() ? date2.getDay() : 7) - (date.getDay() ? date.getDay() : 7);
        return Math.ceil(Math.round((date.getTime() - date2.getTime() + day * (24 * 3600000)) / 86400000) / 7) + 1;
      })(srcDate)
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (srcDate.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        // @ts-ignore
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }
    return fmt;
  };


/**
 * 把list转为Map
 * @param options options
 * @param keyName value的处理器
 * @param valueResolve value的处理器
 */
export function list2Map<T, V>(options: T[], keyName?: string, valueResolve?: string | ((v: T) => V)): Record<string, V> {
  keyName ||= 'value';
  valueResolve ||= 'label';

  let vfn = valueResolve;
  if (typeof valueResolve === 'string') {
    // @ts-ignore
    vfn = v => v[valueResolve];
  }
  return (options || []).reduce((prev, curr) => {
    // @ts-ignore
    prev[curr[keyName]] = vfn(curr);
    return prev;
  }, {});
}

/**
 * 树节点
 */
export interface TreeNode {
  [key: string]: any;

  /**
   * 子节点
   */
  children?: TreeNode[];
}

export type TreeChildren<T = any> = (node: T, parentNode: T | undefined, level: number) => T[] | null;

/**
 * 浮点数保留小数位（处理精度问题）
 * @param num 要处理的数字
 * @param precision 保留小数位数，默认为2
 * @returns 处理后的数字
 */
export function numberFixed(num: number, precision: number = 2): number {
  return parseFloat(num.toFixed(precision));
}

/**
 * 浮点数求和（处理精度问题）
 * @param numbers 要相加的数字数组
 * @param precision 保留小数位数，默认为2
 * @returns 求和结果
 */
export function floatSum(numbers: number[], precision: number = 2): number {
  const sum = numbers.reduce((acc, val) => acc + (val || 0), 0);
  return parseFloat(sum.toFixed(precision));
}

/**
 * 浮点数相等比较（处理精度问题）
 * @param a 数字a
 * @param b 数字b
 * @param precision 保留小数位数，默认为2
 * @returns 是否相等
 */
export function floatEqual(a: number, b: number, precision: number = 2): boolean {
  const aFixed = parseFloat((a || 0).toFixed(precision));
  const bFixed = parseFloat((b || 0).toFixed(precision));
  return aFixed === bFixed;
}

/**
 * 验证总值是否等于分项之和（用于表单验证）
 * @param total 总值
 * @param items 分项数组
 * @param precision 保留小数位数，默认为2
 * @returns 验证结果对象
 */
export function validateSum(
  total: number,
  items: number[],
  precision: number = 2
): { valid: boolean; sum: number } {
  const sum = floatSum(items, precision);
  const valid = floatEqual(total, sum, precision);
  return { valid, sum };
}


/**
 * 转换为select项
 * @param list  列表数据
 * @returns select项
 */
export function toSelectItems(list: string[]): SelectOption[] {
  return list.map((item) => ({
    value: item,
    label: item
  }));
}

export type SelectOption = {
  value: string;
  label: string;
}