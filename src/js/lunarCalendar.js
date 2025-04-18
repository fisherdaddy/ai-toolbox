// 天干
const celestialStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
// 地支
const earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
// 生肖
const zodiacAnimals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
// 农历月份
const lunarMonths = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
// 农历日期
const lunarDays = [
  "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
  "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
];

// 导入chinese-lunar库进行农历转换
import chineseLunar from 'chinese-lunar';

/**
 * 获取农历日期信息
 * @param {Date} date - 公历日期
 * @param {Object} config - 配置信息 (用于兼容原代码，但不再使用)
 * @returns {Object} 包含农历年、生肖、月、日的对象
 */
function getLunarDate(date, config) {
  // 使用chinese-lunar库进行日期转换
  const lunarDate = chineseLunar.solarToLunar(date);
  
  // 获取年、月、日
  const lunarYear = lunarDate.year;
  const lunarMonth = lunarDate.month; // 1-12
  const lunarDay = lunarDate.day; // 1-30
  
  // 计算天干地支年
  const stemIndex = (lunarYear - 4) % 10;
  const branchIndex = (lunarYear - 4) % 12;
  const stem = celestialStems[stemIndex >= 0 ? stemIndex : stemIndex + 10];
  const branch = earthlyBranches[branchIndex >= 0 ? branchIndex : branchIndex + 12];
  
  // 计算生肖
  const zodiacIndex = (lunarYear - 4) % 12;
  const zodiac = zodiacAnimals[zodiacIndex >= 0 ? zodiacIndex : zodiacIndex + 12];
  
  // 获取农历月份和日期的中文表示
  const monthName = lunarMonths[lunarMonth - 1]; // 月份从1开始，数组从0开始
  const dayName = lunarDays[lunarDay - 1]; // 日期从1开始，数组从0开始
  
  return {
    year: `${stem}${branch}年`,
    animal: zodiac,
    month: monthName,
    day: dayName,
    isLeapMonth: lunarDate.isLeap || false
  };
}

export {
  getLunarDate
}; 