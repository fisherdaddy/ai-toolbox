// 直接测试4月18日的农历日期

// 直接定义配置数据
const calendarConfig = {
  lunarDateMap: {
    "2024": {
      "0418": { "lunarMonth": "三", "lunarDay": "廿一" }
    }
  }
};

// 模拟getLunarDate函数的核心逻辑
function testLunarDate() {
  // 模拟4月18日的日期
  const year = 2024;
  const month = 4;
  const day = 18;
  
  // 格式化月日为 MMDD 格式
  const mmdd = `${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  
  console.log(`测试日期: ${year}年${month}月${day}日, MMDD格式: ${mmdd}`);
  
  // 从配置获取农历数据
  let lunarData = null;
  if (calendarConfig && calendarConfig.lunarDateMap && 
      calendarConfig.lunarDateMap[year] && 
      calendarConfig.lunarDateMap[year][mmdd]) {
    lunarData = calendarConfig.lunarDateMap[year][mmdd];
  }
  
  console.log("获取到的农历数据:", lunarData);
  
  if (lunarData) {
    // 使用配置中的农历数据
    const lunarMonth = lunarData.lunarMonth;
    const lunarDay = lunarData.lunarDay;
    
    console.log(`农历月份: ${lunarMonth}月`);
    console.log(`农历日期: ${lunarDay}`);
    console.log(`完整农历日期: ${lunarMonth}月${lunarDay}`);
    
    // 检查是否为预期的三月廿一
    const isMatch = lunarMonth === "三" && lunarDay === "廿一";
    console.log(`是否符合预期的"三月廿一": ${isMatch ? "✓ 是" : "✗ 否"}`);
  } else {
    console.log("未找到农历数据");
  }
}

// 执行测试
testLunarDate(); 