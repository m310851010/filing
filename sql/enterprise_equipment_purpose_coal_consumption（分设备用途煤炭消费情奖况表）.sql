DROP TABLE IF EXISTS "enterprise_equipment_purpose_coal_consumption";
CREATE TABLE "enterprise_equipment_purpose_coal_consumption" (
  "obj_id" varchar(36) NOT NULL,                       -- 主键，表：分设备用途煤炭消费情奖况表
	"stat_date" varchar(10) NOT NULL,                    -- 年份
  "unit_name" varchar(100) NOT NULL,                   -- 单位名称
  "credit_code" varchar(20) NOT NULL,                  -- 统一社会信用代码
	"serial_number" varchar(10),                         -- 设备序号，对应分设备煤炭消费情况表中设备序，从1-1开始，自动生成
	"main_usage" varchar(10),                            -- 主要用途
  "specific_usage" varchar(10),                        -- 具体用途
  "input_variety" varchar(50),                         -- 投入品种
  "input_unit" varchar(30),                            -- 投入计量单位
  "input_quantity" varchar(100),                       -- 年投入量，2位小数，加密
	"output_energy_types" varchar(10),                   -- 产出品种品类
	"measurement_unit" varchar(10),                      -- 产出计量单位
  "output_quantity" varchar(100),                      -- 年产出量，2位小数，加密
  "remarks" varchar(256),                              -- 备注
  "create_user" varchar(100) NOT NULL,                 -- 上传用户
  "create_time" datetime NOT NULL,                     -- 创建时间
	"is_check" varchar(100),                             -- 是否已校核，0未校核，1已校核，2校核未通过，加密
  PRIMARY KEY ("obj_id")
);
-- 表注释：分设备用途煤炭消费情奖况表
PRAGMA foreign_keys = true;
