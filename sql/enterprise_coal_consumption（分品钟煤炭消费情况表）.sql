DROP TABLE IF EXISTS "enterprise_coal_consumption";
CREATE TABLE "enterprise_coal_consumption" (
  "obj_id" varchar(36) NOT NULL,                                -- 主键，表：分品种煤炭消费情况表
	"stat_date" varchar(10) NOT NULL,                             -- 年份
  "unit_name" varchar(100) NOT NULL,                            -- 单位名称
  "credit_code" varchar(20) NOT NULL,                           -- 统一社会信用代码
	"annual_raw_coal_consumption" varchar(100) NOT NULL,          -- 年原煤消费量，2位小数，加密
	"annual_anthracite_consumption" varchar(100) NOT NULL,        -- 其中：年无烟煤消费量，2位小数，加密
	"annual_bituminous_coal_consumption" varchar(100) NOT NULL,   -- 其中：年烟煤消费量，2位小数，加密
	"annual_lignite_consumption" varchar(100) NOT NULL,           -- 其中：年褐煤消费量，2位小数，加密
  "annual_clean_coal_consumption" varchar(100) NOT NULL,        -- 年洗精煤消费量，2位小数，加密
  "annual_other_coal_consumption" varchar(100) NOT NULL,        -- 年其他洗煤消费，2位小数，加密
	"annual_coal_products_consumption" varchar(100) NOT NULL,     -- 年煤制品消费总量，2位小数，加密
	"annual_coke_consumption" varchar(100) NOT NULL,              -- 年焦炭消费量，2位小数，加密
  "annual_blue_coke_consumption" varchar(100) NOT NULL,         -- 年兰炭消费量，2位小数，加密
	"annual_blast_furnace_gas_consumption" varchar(100) NOT NULL, -- 年高炉煤气消费量，2位小数，加密
	"annual_coke_oven_gas_consumption" varchar(100) NOT NULL,     -- 年焦炉煤气消费量，2位小数，加密
  "create_user" varchar(100) NOT NULL,                          -- 上传用户
  "create_time" datetime NOT NULL,                              -- 创建时间
	"is_check" varchar(100),                                      -- 是否已校核，0未校核，1已校核，2校核未通过，加密
  PRIMARY KEY ("obj_id")
);
-- 表注释：分品种煤炭消费情况表
PRAGMA foreign_keys = true;
