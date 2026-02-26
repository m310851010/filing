DROP TABLE IF EXISTS "gov_user_info";
CREATE TABLE "gov_user_info" (
  "obj_id" varchar(36) NOT NULL,                       -- 主键，表：政府用户信息表
	"province_name" varchar(100) NOT NULL,               -- 单位所在省份
	"city_name" varchar(100) NOT NULL,                   -- 单位所在地市
	"country_name" varchar(100),                         -- 单位所在区县
	"user_name" varchar(20) NOT NULL,                    -- 用户名
	"user_pws" varchar(20) NOT NULL,                     -- 密码
	"tel" varchar(15)                                   -- 联系电话
  PRIMARY KEY ("obj_id")
);
-- 表注释：政府用户信息表
PRAGMA foreign_keys = true;