import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "../lib/utils";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CalendarCurrent = ({ activityLog = [] }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const isToday = (day, month, year) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const hasActivity = (day, month, year) => {
    if (!activityLog || activityLog.length === 0) return false;
    
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    return activityLog.some(log => {
      const logDate = new Date(log.date).toISOString().split('T')[0];
      return logDate === dateStr;
    });
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysInPrevMonth = getDaysInMonth(currentMonth - 1, currentYear);
    
    const days = [];
    
    // Previous month overflow days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isPrevMonth: true,
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday: isToday(i, currentMonth, currentYear),
        hasActivity: hasActivity(i, currentMonth, currentYear),
      });
    }
    
    // Next month overflow days to complete 42 cells (6 weeks)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isNextMonth: true,
      });
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <div
      className="w-full max-w-xs rounded-lg p-2 shadow-sm"
      style={{
        backgroundColor: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border-light)",
      }}
    >
      {/* Header with Month/Year and Navigation */}
      <div className="flex items-center justify-between mb-1.5">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevMonth}
          className="p-0.5 rounded hover:bg-opacity-80 transition-colors"
          style={{ backgroundColor: "var(--color-bg-tertiary)" }}
        >
          <ChevronLeft className="w-3 h-3" style={{ color: "var(--color-text-primary)" }} />
        </motion.button>
        
        <h3 className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>
          {MONTHS[currentMonth]} {currentYear}
        </h3>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextMonth}
          className="p-0.5 rounded hover:bg-opacity-80 transition-colors"
          style={{ backgroundColor: "var(--color-bg-tertiary)" }}
        >
          <ChevronRight className="w-3 h-3" style={{ color: "var(--color-text-primary)" }} />
        </motion.button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-[9px] font-medium py-0.5"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((dayObj, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.003,
              duration: 0.1,
            }}
            whileHover={{ scale: 1.05 }}
            className={cn(
              "relative flex items-center justify-center rounded text-[10px] font-medium cursor-pointer transition-all",
              dayObj.isCurrentMonth
                ? "hover:shadow-sm"
                : "opacity-30"
            )}
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: dayObj.hasActivity && dayObj.isCurrentMonth
                ? "#FB923C"
                : dayObj.isToday
                ? "#1E293B"
                : dayObj.isCurrentMonth
                ? "var(--color-bg-tertiary)"
                : "var(--color-bg-secondary)",
              color: dayObj.hasActivity && dayObj.isCurrentMonth
                ? "#FFF"
                : dayObj.isToday
                ? "#FFF"
                : "var(--color-text-primary)",
            }}
          >
            {dayObj.day}
            
            {/* Today's Check Icon */}
            {dayObj.isToday && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="absolute top-0 right-0"
              >
                <Check className="w-2 h-2 text-white" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CalendarCurrent;
