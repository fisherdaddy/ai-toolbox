// 测试原始配置文件中4月18日的农历日期
const fs = require('fs');
const path = require('path');

// 读取原始配置文件
try {
  // 读取配置文件
  const configPath = path.join(__dirname, 'src', 'data', 'calendar-config.json');
  const configData = fs.readFileSync(configPath, 'utf8');
  const calendarConfig = JSON.parse(configData);
  
  console.log('成功读取配置文件');
  
  // 检查4月18日的配置
  const year = 2024;
  const mmdd = '0418';
  
  console.log(`检查 ${year}年${mmdd.slice(0, 2)}月${mmdd.slice(2)}日 的农历配置...`);
  
  if (calendarConfig && 
      calendarConfig.lunarDateMap && 
      calendarConfig.lunarDateMap[year] && 
      calendarConfig.lunarDateMap[year][mmdd]) {
    
    const lunarData = calendarConfig.lunarDateMap[year][mmdd];
    console.log('找到农历数据:', lunarData);
    
    // 检查是否为预期的三月廿一
    const lunarMonth = lunarData.lunarMonth;
    const lunarDay = lunarData.lunarDay;
    
    console.log(`农历月份: ${lunarMonth}`);
    console.log(`农历日期: ${lunarDay}`);
    console.log(`完整农历日期: ${lunarMonth}月${lunarDay}`);
    
    const isMatch = lunarMonth === "三" && lunarDay === "廿一";
    console.log(`是否符合预期的"三月廿一": ${isMatch ? "✓ 是" : "✗ 否"}`);
    
    // 如果不匹配，提示修正方法
    if (!isMatch) {
      console.log('\n需要修改配置文件:');
      console.log(`当前值: "lunarMonth": "${lunarMonth}", "lunarDay": "${lunarDay}"`);
      console.log(`应改为: "lunarMonth": "三", "lunarDay": "廿一"`);
    } else {
      console.log('\n配置已正确，无需修改。');
    }
  } else {
    console.log('未找到对应的农历数据配置');
  }
} catch (error) {
  console.error('读取配置文件出错:', error);
} 