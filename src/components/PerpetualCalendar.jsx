import React, { useState, useEffect } from 'react';
import { Typography, Select, Button, Tooltip } from 'antd';
import styled from 'styled-components';
import { getLunarDate } from '../js/lunarCalendar';
import calendarConfig from '../data/calendar-config.json';

const { Title } = Typography;
const { Option } = Select;

// 从配置文件中获取数据
const {
  monthNames,
  weekdayNames,
  yearRange,
  colors,
  solarHolidays,
  solarTerms,
  legalHolidays
} = calendarConfig;

// 样式
const CalendarContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  margin-top: 80px; /* 增加顶部边距，避免导航栏遮挡 */
`;

const CalendarHeader = styled.div`
  margin-bottom: 20px;
  padding-top: 20px;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin: 20px 0;
`;

const DayCell = styled.div`
  height: 76px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: ${props => props.$isHoliday ? colors.holiday : props.$isToday ? colors.today : 'white'};
  cursor: pointer;
  
  &:hover {
    border-color: #1890ff;
  }
`;

const WeekdayHeader = styled.div`
  font-weight: bold;
  text-align: center;
  padding: 8px;
  color: ${props => props.$isWeekend ? colors.holidayText : 'inherit'};
`;

const DayNumber = styled.div`
  font-size: 1.1rem;
  font-weight: ${props => props.$isToday ? 'bold' : 'normal'};
  color: ${props => props.$isToday ? '#1890ff' : props.$isHoliday ? colors.holidayText : 'inherit'};
`;

const LunarDay = styled.div`
  font-size: 0.8rem;
  color: #888;
  margin-top: 2px;
`;

const HolidayTag = styled.div`
  font-size: 0.8rem;
  color: ${colors.holidayText};
  margin-top: 2px;
  font-weight: bold;
`;

const WorkTag = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border-radius: 2px;
`;

const PerpetualCalendar = () => {
  // 获取今天的日期
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [calendarDays, setCalendarDays] = useState([]);

  // 生成年份选项
  const years = [];
  for (let year = yearRange.start; year <= yearRange.end; year++) {
    years.push(year);
  }
  
  // 处理月份变化
  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  // 处理年份变化
  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  // 跳转到今天
  const goToToday = () => {
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth());
  };

  // 上一个月
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedYear(selectedYear - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  // 下一个月
  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedYear(selectedYear + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // 判断是否是今天
  const isToday = (year, month, day) => {
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    
    return day === todayDate && month === todayMonth && year === todayYear;
  };

  // 判断是否为法定节假日、节气或其他节日
  const getHolidayInfo = (year, month, day) => {
    const dateStr = `${year}${month < 9 ? '0' : ''}${month + 1}${day < 10 ? '0' : ''}${day}`;
    
    // 检查是否是法定节假日 - 按年份获取对应数据
    if (legalHolidays && legalHolidays[year] && legalHolidays[year][dateStr]) {
      return legalHolidays[year][dateStr];
    }
    
    // 检查是否是二十四节气 - 按年份获取对应数据
    if (solarTerms && solarTerms[year] && solarTerms[year][dateStr]) {
      return { name: solarTerms[year][dateStr], type: 'solarTerm' };
    }
    
    // 检查是否是阳历节日 - 这些不依赖于年份
    const monthDay = `${month < 9 ? '0' : ''}${month + 1}${day < 10 ? '0' : ''}${day}`;
    if (solarHolidays && solarHolidays[monthDay]) {
      return { 
        name: solarHolidays[monthDay].name, 
        type: solarHolidays[monthDay].isHoliday ? 'holiday' : 'festival' 
      };
    }
    
    return null;
  };

  // 判断是否是实际休息日（考虑周末调休）
  const isActualRestDay = (dateObj) => {
    const { holiday, date } = dateObj;
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // 节假日安排优先级最高
    if (holiday) {
      if (holiday.type === 'holiday') {
        return true;  // 法定假日休息
      } else if (holiday.type === 'workday') {
        return false; // 调休工作日要上班
      }
    }
    
    // 其次是周末自然休息
    return isWeekend;
  };

  // 生成月视图的日期
  const generateMonthDays = () => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = 星期日
    
    // 记录当月的所有日期和上下月填充的日期
    const days = [];
    
    // 上个月的填充日期
    const prevMonthLastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDay = prevMonthLastDay - i;
      const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
      const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
      const date = new Date(prevYear, prevMonth, prevMonthDay);
      const lunarInfo = getLunarDate(date, calendarConfig);
      const holiday = getHolidayInfo(prevYear, prevMonth, prevMonthDay);
      
      days.push({
        day: prevMonthDay,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        lunar: lunarInfo,
        holiday: holiday,
        date: date
      });
    }
    
    // 当月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const lunarInfo = getLunarDate(date, calendarConfig);
      const holiday = getHolidayInfo(selectedYear, selectedMonth, day);
      
      days.push({
        day,
        month: selectedMonth,
        year: selectedYear,
        isCurrentMonth: true,
        lunar: lunarInfo,
        holiday: holiday,
        date: date
      });
    }
    
    // 下个月的填充日期
    const remainingCells = 42 - days.length; // 6行7列 = 42个格子
    for (let day = 1; day <= remainingCells; day++) {
      const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
      const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
      const date = new Date(nextYear, nextMonth, day);
      const lunarInfo = getLunarDate(date, calendarConfig);
      const holiday = getHolidayInfo(nextYear, nextMonth, day);
      
      days.push({
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        lunar: lunarInfo,
        holiday: holiday,
        date: date
      });
    }
    
    setCalendarDays(days);
  };

  // 当年份或月份变化时更新日历
  useEffect(() => {
    generateMonthDays();
  }, [selectedYear, selectedMonth]);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <Title level={2} style={{ textAlign: 'center' }}>万年历</Title>
      </CalendarHeader>
      
      <ControlsContainer>
        <Button onClick={prevMonth}>&lt;</Button>
        
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          style={{ width: 100 }}
        >
          {years.map(year => (
            <Option key={year} value={year}>{year}年</Option>
          ))}
        </Select>
        
        <Select
          value={selectedMonth}
          onChange={handleMonthChange}
          style={{ width: 100 }}
        >
          {monthNames.map((month, index) => (
            <Option key={index} value={index}>{month}</Option>
          ))}
        </Select>
        
        <Button onClick={nextMonth}>&gt;</Button>
        <Button type="primary" onClick={goToToday}>回到今天</Button>
      </ControlsContainer>
      
      {/* 星期表头 */}
      <CalendarGrid>
        {weekdayNames.map((name, index) => (
          <WeekdayHeader key={index} $isWeekend={index === 0 || index === 6}>
            {name}
          </WeekdayHeader>
        ))}
        
        {/* 日期格子 */}
        {calendarDays.map((dateObj, index) => {
          const { day, month, year, isCurrentMonth, lunar, holiday, date } = dateObj;
          const dateIsToday = isToday(year, month, day);
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          
          // 判断是否为法定节假日或调休
          const isHoliday = holiday && holiday.type === 'holiday';
          const isWorkday = holiday && holiday.type === 'workday';
          // 判断是否为实际休息日
          const isRestDay = isActualRestDay(dateObj);
          
          return (
            <Tooltip 
              key={index}
              title={
                <>
                  {holiday && holiday.name && <div>{holiday.name}</div>}
                  {lunar && <div>农历{lunar.month}{lunar.isLeapMonth ? '闰' : ''}月{lunar.day}</div>}
                  {isWorkday && <div>调休工作日</div>}
                  {isHoliday && <div>法定节假日</div>}
                  {!isHoliday && !isWorkday && isWeekend && <div>周末</div>}
                </>
              }
              placement="top"
            >
              <DayCell 
                $isToday={dateIsToday}
                $isWeekend={isWeekend}
                $isWorkday={isWorkday}
                $isHoliday={isHoliday}
                style={{ opacity: isCurrentMonth ? 1 : 0.3 }}
              >
                <DayNumber 
                  $isToday={dateIsToday} 
                  $isWeekend={isWeekend} 
                  $isWorkday={isWorkday}
                  $isHoliday={isHoliday}
                >
                  {day}
                </DayNumber>
                
                {lunar && (
                  <LunarDay>
                    {lunar.day === '初一' ? `${lunar.month}${lunar.isLeapMonth ? '闰' : ''}月` : lunar.day}
                  </LunarDay>
                )}
                
                {holiday && holiday.name && (
                  <HolidayTag>{holiday.name}</HolidayTag>
                )}
                
                {isWorkday && (
                  <WorkTag style={{ backgroundColor: colors.work, color: 'white' }}>
                    班
                  </WorkTag>
                )}
                
                {isHoliday && !isWorkday && (
                  <WorkTag style={{ backgroundColor: colors.rest, color: 'white' }}>
                    休
                  </WorkTag>
                )}
              </DayCell>
            </Tooltip>
          );
        })}
      </CalendarGrid>
    </CalendarContainer>
  );
};

export default PerpetualCalendar; 