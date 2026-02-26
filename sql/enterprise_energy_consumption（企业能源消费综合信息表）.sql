DROP TABLE IF EXISTS "enterprise_energy_consumption";
CREATE TABLE "enterprise_energy_consumption" (
  "obj_id" varchar(36) NOT NULL,                                -- 主键，表：企业能源消费综合信息表
	"stat_date" varchar(10) NOT NULL,                             -- 年份
  "unit_name" varchar(100) NOT NULL,                            -- 单位名称
  "credit_code" varchar(20) NOT NULL,                           -- 统一社会信用代码
	"annual_energy_equivalent_value" varchar(100) NOT NULL,       -- 年综合能耗当量值，2位小数，加密
  "annual_energy_equivalent_cost" varchar(100) NOT NULL,        -- 年综合能耗等价值，2位小数，加密
  "annual_raw_material_energy" varchar(100) NOT NULL,           -- 年原料用能消费量，2位小数，加密
	"annual_raw_coal" varchar(100) NOT NULL,                      -- 年原料用煤消费量，2位小数，加密
  "annual_total_coal_consumption" varchar(100) NOT NULL,        -- 年煤炭消费总量-实物量，2位小数，加密
  "annual_total_coal_products" varchar(100) NOT NULL,           -- 年煤炭消费总量-标准量，2位小数，加密
  "create_user" varchar(100) NOT NULL,                          -- 上传用户
  "create_time" datetime NOT NULL,                              -- 创建时间
	"is_check" varchar(100),                                      -- 是否已校核，0未校核，1已校核，2校核未通过，加密
  PRIMARY KEY ("obj_id")
);
-- 表注释：企业能源消费综合信息表
PRAGMA foreign_keys = true;
