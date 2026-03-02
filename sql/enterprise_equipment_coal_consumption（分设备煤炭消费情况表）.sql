DROP TABLE IF EXISTS "enterprise_equipment_coal_consumption";
CREATE TABLE "enterprise_equipment_coal_consumption" (
  "obj_id" varchar(36) NOT NULL,                       -- 主键，表：分设备煤炭消费情况表
	"stat_date" varchar(10) NOT NULL,                    -- 年份
  "unit_name" varchar(100) NOT NULL,                   -- 单位名称
  "credit_code" varchar(20) NOT NULL,                  -- 统一社会信用代码
	"serial_number" varchar(10),                         -- 设备序号，从1开始，自动生成
	"equipment_type" varchar(10),                        -- 类型
	"is_captive_power_plant_boiler" varchar(10),         -- 是否自备电厂用锅炉
  "coal_no" varchar(36),                               -- 编号
	"equipment_model" varchar(10),                       -- 型号，类型为发电锅炉或工业锅炉时填写
  "usage_time" varchar(20),                            -- 累计使用时间
  "design_life" varchar(20),                           -- 设计年限
  "enecrgy_efficienct_bmk" varchar(20),                -- 能效对标 优于先进水平  先进水平至节能水平之间  节能水平至准入水平之间  无能效标准
  "capacity_unit" varchar(10),                         -- 容量单位
  "capacity" varchar(50),                              -- 容量
  "input_quantity" varchar(100),                       -- 年投入量，2位小数，加密
  "create_user" varchar(100) NOT NULL,                 -- 上传用户
  "create_time" datetime NOT NULL,                     -- 创建时间
	"is_check" varchar(100),                             -- 是否已校核，0未校核，1已校核，2校核未通过，加密
  PRIMARY KEY ("obj_id")
);
-- 表注释：分设备煤炭消费情况表
PRAGMA foreign_keys = true;
