DROP TABLE IF EXISTS "enterprise_user_info";
CREATE TABLE "enterprise_user_info" (
  "obj_id" varchar(36) NOT NULL,                       -- 主键，表：企业用户信息表
	"user_name" varchar(20) NOT NULL,                    -- 用户名
	"user_pws" varchar(20) NOT NULL,                     -- 密码
	"tel" varchar(15)                                   -- 联系电话
  PRIMARY KEY ("obj_id")
);
-- 表注释：企业用户信息表
PRAGMA foreign_keys = true;