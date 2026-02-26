
/**
 * 用户信息
 */
export interface UserInfo {
  id: string;
  /**
   * 用户名
   */
  username: string;
  /**
   * 权限码
   */
  authorities: string[];
  /**
   * 名称
   */
  name: string;
  nickName: string;
  /**
   * 性别, 1-男 0-女
   */
  sex: 0 | 1;

  phone?: string;
  email?: string;
  /**
   * 头像
   */
  avatar?: string;
  /**
   * 组织机构id
   */
  officeId: string;
  officeName: string;
  /**
   * 用户状态 0正常，1禁用
   */
  status: 0 | 1;
  /**
   * 创建时间
   */
  createDate: string;
  /**
   * 角色名称
   */
  roleNames: string[];
  /**
   * 用户类型 0-普通用户 1-管理员
   */
  userType: 0 | 1;
}
