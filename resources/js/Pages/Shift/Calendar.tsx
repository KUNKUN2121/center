import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import styled from "@emotion/styled";

const CalendarContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: auto;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const Day = styled.div<{ isCurrentMonth: boolean; isSelected: boolean }>`
  padding: 10px;
  background: ${({ isCurrentMonth, isSelected }) =>
    isSelected ? "#4caf50" : isCurrentMonth ? "#fff" : "#ddd"};
  color: ${({ isCurrentMonth }) => (isCurrentMonth ? "#000" : "#aaa")};
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`;

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));

  const days = [];
  let date = startDate;

  while (date <= endDate) {
    days.push(date);
    date = addDays(date, 1);
  }

  return (
    <CalendarContainer>
      <h2>{format(currentDate, "yyyy年 MM月")}</h2>
      <Grid>
        {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
          <Day key={d} isCurrentMonth={true} isSelected={false}>
            {d}
          </Day>
        ))}
        {days.map((day) => (
          <Day
            key={day.toString()}
            isCurrentMonth={isSameMonth(day, currentDate)}
            isSelected={selectedDate ? isSameDay(day, selectedDate) : false}
            onClick={() => setSelectedDate(day)}
          >
            {format(day, "d")}
          </Day>
        ))}
      </Grid>
    </CalendarContainer>
  );
};

export default Calendar;
