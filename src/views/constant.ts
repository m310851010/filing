const prefix = '_ma_';
export const Constant = {
  /**
   * 请求header的token
   */
  AUTH_TOKEN_KEY: `${prefix}AUTHORIZATION`,
  /**
   * 登录后的用户信息
   */
  USER_INFO_KEY: `${prefix}USER_INFO_TOKEN`
};

export const AREA_DATA = [
  {
    label: '内蒙古自治区',
    value: '15',
    children: [
      {
        label: '鄂尔多斯市',
        value: '1506',
        children: [
          { label: '达拉特旗', value: '150621' },
          { label: '东胜区', value: '150602' }
        ]
      }
    ]
  }
];

export const INDUSTRY_DATA = [
  {
    label: '制造业',
    value: 'C',
    children: [
      {
        label: '化学原料和化学制品制造业',
        value: '26',
        children: [
          {
            label: '基础化学原料制造',
            value: '261',
            children: [{ label: '无机酸制造', value: '2611' }]
          }
        ]
      },
      {
        label: '黑色金属冶炼和压延加工业',
        value: '31',
        children: [{ label: '炼铁', value: '311', children: [{ label: '炼铁', value: '3110' }] }]
      }
    ]
  }
];
