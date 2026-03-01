import { forEachTree, list2Map, SelectOption, toSelectItems } from '@/util';
// 投入品种
const input_variety: Array<{ value: string; unit: string }> = [
  {
    value: '原煤',
    // 投入计量单位
    unit: '万吨'
  },
  {
    value: '洗精煤',
    // 投入计量单位
    unit: '万吨'
  },
  {
    value: '其他洗煤',
    // 投入计量单位
    unit: '万吨'
  },
  {
    value: '煤制品',
    // 投入计量单位
    unit: '万吨'
  },
  {
    value: '焦炭',
    // 投入计量单位
    unit: '万吨'
  },
  {
    value: '兰炭',
    // 投入计量单位
    unit: '万吨'
  },
  {
    value: '焦炉煤气',
    // 投入计量单位
    unit: '万立方米'
  },
  {
    value: '高炉煤气',
    // 投入计量单位
    unit: '万立方米'
  }
];

// 容量单位
const capacity_units = toSelectItems(['吨/小时', '立方米/小时', '千伏安', '立方米', '兆瓦']);

const deviceTypes = [
  {
    value: '发电锅炉',
    capacity_units: toSelectItems(['吨/小时']),
    // 主要用途
    children: [
      {
        value: '发电',
        //具体用途
        specific_usage: [
          {
            value: '-',
            // 投入品种品类
            input_variety,
            // 产出品种品类
            output_energy_types: [
              {
                value: '电力',
                // 产出计量单位
                unit: '万千瓦时'
              }
            ]
          }
        ]
      },
      {
        value: '热电联产（发电）',
        // 具体用途
        specific_usage: [
          {
            value: '-',
            // 投入品种品类
            input_variety,
            // 产出品种品类
            output_energy_types: [
              {
                value: '电力',
                // 产出计量单位
                unit: '万千瓦时'
              }
            ]
          }
        ]
      },
      {
        value: '热电联产（供热）',
        //具体用途
        specific_usage: [
          {
            value: '提供蒸汽',
            input_variety,
            // 产出品种品类
            output_energy_types: [
              {
                value: '蒸汽（200℃以上）',
                // 产出计量单位
                unit: '百万千焦'
              }
            ]
          }
        ]
      },
      {
        value: '供热',
        //具体用途
        specific_usage: [
          {
            value: '提供蒸汽',
            // 投入品种品类
            input_variety,
            // 产出品种品类
            output_energy_types: [
              {
                value: '蒸汽（200℃以上）',
                // 产出计量单位
                unit: '百万千焦'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value: '工业锅炉',
    capacity_units: toSelectItems(['吨/小时', '兆瓦']),
    // 主要用途
    children: [
      {
        value: '供热',
        //具体用途
        specific_usage: [
          {
            value: '提供蒸汽',
            // 投入品种品类
            input_variety,
            // 产出品种品类
            output_energy_types: [
              {
                value: '蒸汽（200℃以上）',
                // 产出计量单位
                unit: '百万千焦'
              },
              {
                value: '蒸汽（200℃以下）',
                // 产出计量单位
                unit: '百万千焦'
              }
            ]
          },
          {
            value: '提供热水',
            // 投入品种品类
            input_variety,
            // 产出品种品类
            output_energy_types: [
              {
                value: '热水',
                // 产出计量单位
                unit: '万立方米'
              }
            ]
          },
          {
            value: '提供热载体',
            // 投入品种品类
            input_variety,
            // 产出品种品类
            output_energy_types: [
              {
                value: '热载体',
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value: '窑炉',
    capacity_units,
    // 主要用途
    children: [
      {
        value: '供热',
        //具体用途
        specific_usage: [
          {
            value: '提供反应热',
            // 投入品种品类
            input_variety
          }
        ]
      }
    ]
  },
  {
    value: '气化炉',
    capacity_units,
    // 主要用途
    children: [
      {
        value: '原料',
        //具体用途
        specific_usage: [
          {
            value: '煤化工',
            // 投入品种品类
            input_variety,
            // 产出品种品类
            output_energy_types: [
              {
                value: '煤制油',
                // 产出计量单位
                unit: '万吨'
              },
              {
                value: '煤制气',
                // 产出计量单位
                unit: '万立方米'
              },
              {
                value: '煤制合成氨',
                // 产出计量单位
                unit: '万吨'
              },
              {
                value: '煤制甲醇',
                // 产出计量单位
                unit: '万吨'
              },
              {
                value: '煤制乙二醇',
                // 产出计量单位
                unit: '万吨'
              },
              {
                value: '煤制烯烃',
                // 产出计量单位
                unit: '万吨'
              },
              {
                value: '电石',
                // 产出计量单位
                unit: '万吨'
              },
              {
                value: '黄磷',
                // 产出计量单位
                unit: '万吨'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value: '炼铁高炉',
    capacity_units,
    // 主要用途
    children: [
      {
        value: '供热',
        //具体用途
        specific_usage: [
          {
            value: '提供反应热',
            // 投入品种品类
            input_variety
          }
        ]
      },
      {
        value: '原料',
        specific_usage: [
          {
            value: '还原剂',
            // 投入品种
            input_variety: [
              {
                value: '焦炭',
                // 投入计量单位
                unit: '万吨'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value: '焦化炉',
    capacity_units,
    // 主要用途
    children: [
      {
        value: '原料',
        // 具体用途
        specific_usage: [
          {
            value: '炼焦',
            // 投入品种
            input_variety: [
              {
                value: '煤炭',
                // 投入计量单位
                unit: '万吨'
              }
            ],
            // 产出品种品类
            output_energy_types: [
              {
                value: '焦炭',
                // 产出计量单位
                unit: '万吨'
              },
              {
                value: '焦炉煤气',
                // 产出计量单位
                unit: '万立方米'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value: '矿热炉',
    capacity_units,
    // 主要用途
    children: [
      {
        value: '供热',
        //具体用途
        specific_usage: [
          {
            value: '提供反应热',
            // 投入品种
            input_variety: [
              {
                value: '煤炭',
                // 投入计量单位
                unit: '万吨'
              }
            ]
          }
        ]
      }
    ]
  }
] as DeviceType[];

forEachTree(
  deviceTypes,
  item => {
    // @ts-ignore
    item.label = item.value;
  },
  // @ts-ignore
  node => node.children || node.specific_usage || node.input_variety || node.output_energy_types
);

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

export { deviceTypes, filterOption };

export interface DeviceType {
  value: string;
  label: string;
  capacity_units: SelectOption[];
  children?: MainUsage[];
}

export interface MainUsage {
  value: string;
  label: string;
  specific_usage?: SpecificUsage[];
}

export interface SpecificUsage {
  value: string;
  label: string;
  input_variety?: OpgionUnit[];
  output_energy_types?: OpgionUnit[];
}

export interface OpgionUnit {
  value: string;
  unit: string;
  label: string;
}

export interface FilingData {
    baseInfo?: any;
    energy?: any;
    coal?: any;
    devices: any[];
  }