DROP TABLE IF EXISTS "enterprise_info";
CREATE TABLE "enterprise_info" (
  "obj_id" varchar(36) NOT NULL,                       -- 主键，表：企业基础信息表
	"stat_date" varchar(10) NOT NULL,                    -- 年份
  "unit_name" varchar(100) NOT NULL,                   -- 单位名称
  "credit_code" varchar(20) NOT NULL,                  -- 统一社会信用代码
	"trade_a" varchar(36) NOT NULL,                      -- 行业门类
  "trade_b" varchar(36) NOT NULL,                      -- 行业大类
  "trade_c" varchar(36) NOT NULL,                      -- 行业中类
	"trade_d" varchar(36),                               -- 行业小类
	"province_name" varchar(100) NOT NULL,               -- 单位所在省份
	"province_code" varchar(10),                         -- 单位省级编码
	"city_name" varchar(100) NOT NULL,                   -- 单位所在地市
	"city_code" varchar(10),                             -- 单位市级编码
	"country_name" varchar(100),                         -- 单位所在区县
	"country_code" varchar(10),                          -- 单位县级编码
	"tel" varchar(15),                                   -- 联系电话
	"enterprise_type" varchar(20) NOT NULL,              -- 企业类型，规上企业、规下企业
	"is_captive_power_plant " varchar(10) NOT NULL,      -- 是否含有自备电厂
  "create_user" varchar(100) NOT NULL,                 -- 上传用户
  "create_time" datetime NOT NULL,                     -- 创建时间
	"is_check" varchar(100),                             -- 是否已校核，0未校核，1已校核，2校核未通过，加密
  PRIMARY KEY ("obj_id")
);
-- 表注释：企业基础信息表
PRAGMA foreign_keys = true;
