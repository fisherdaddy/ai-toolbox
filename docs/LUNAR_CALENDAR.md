# 农历日期计算功能

本文档介绍了日历应用中的农历日期计算功能。

## 功能概述

农历日期计算功能允许应用显示与公历日期对应的农历日期信息，包括：

- 农历年（天干地支，如"甲辰年"）
- 生肖（如"龙"）
- 农历月（如"正月"）
- 农历日（如"初一"）

## 实现方式

农历日期的计算主要通过两种方式实现：

1. **配置数据驱动**：对于已知年份，从配置文件中查找预设的农历日期映射。
2. **简化计算回退**：对于配置中不存在的年份，使用简化的计算方法估算农历日期。

## 配置文件结构

农历数据存储在 `src/data/calendar-config.json` 文件中，主要包含以下内容：

```json
{
  "lunarDateMap": {
    "2024": {
      "0101": { "lunarMonth": "腊", "lunarDay": "廿一" },
      ...更多日期...
    },
    "2025": {
      "0101": { "lunarMonth": "腊", "lunarDay": "初二" },
      ...更多日期...
    }
  }
}
```

配置结构说明：

1. `lunarDateMap`：顶层对象，包含各年份的农历数据
2. 年份（如`"2024"`）：包含该年全年的农历日期映射
3. 日期格式为`"MMDD"`：月和日都使用两位数表示，如`"0101"`表示1月1日
4. 每个日期映射包含：
   - `lunarMonth`：农历月份（如"正"、"二"、"腊"等）
   - `lunarDay`：农历日期（如"初一"、"十五"、"廿九"等）

## 如何使用

### 基本用法

```javascript
import { getLunarDate } from './js/lunarCalendar.js';
import calendarConfig from './data/calendar-config.json';

// 创建一个日期对象
const date = new Date(2024, 0, 1); // 2024年1月1日

// 获取农历日期
const lunarDate = getLunarDate(date, calendarConfig);

console.log(lunarDate.year);   // "甲辰年"
console.log(lunarDate.animal); // "龙"
console.log(lunarDate.month);  // "腊月"
console.log(lunarDate.day);    // "廿一"
```

### 返回值说明

`getLunarDate` 函数返回一个包含以下属性的对象：

- `year`：农历年（天干地支年，如"甲辰年"）
- `animal`：生肖（如"龙"）
- `month`：农历月（如"正月"）
- `day`：农历日（如"初一"）

## 如何扩展数据

若要为新的年份添加农历数据，请按以下步骤操作：

1. 打开 `src/data/calendar-config.json` 文件
2. 在 `lunarDateMap` 对象中添加新的年份条目：

```json
"lunarDateMap": {
  "2024": { ... },
  "2025": { ... },
  "2026": {
    "0101": { "lunarMonth": "冬", "lunarDay": "十三" },
    "0102": { "lunarMonth": "冬", "lunarDay": "十四" },
    ...
  }
}
```

添加数据时，请确保：
- 月日格式为 `MMDD`（两位数月份和两位数日期）
- 提供准确的农历月份和日期信息

## 测试

可以通过访问 `src/test-lunar.html` 页面来测试农历日期计算功能。该页面会展示几个测试案例，包括配置中存在和不存在的日期。

## 注意事项

1. 简化计算方法仅作为回退机制，不保证准确性
2. 实际农历计算涉及闰月、大小月以及二十四节气等复杂因素
3. 为获得最佳结果，建议为所有需要支持的年份提供完整的配置数据
4. 农历年份的计算（特别是农历年的开始和结束）依赖于农历月份信息 