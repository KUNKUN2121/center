/** @jsxImportSource @emotion/react */
import React, { Dispatch, SetStateAction, useState } from "react";
import { css } from "@emotion/react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
} from "date-fns";
import DayCell from "./DayCell";
import ScheduleModal from "./ScheduleModal";
import { Schedule } from "./types";

const calendarGrid = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const header = css`
  text-align: center;
  font-size: 24px;
  margin-bottom: 16px;
`;

interface CalendarProps {
    requestMonth: string;
    schedules: Schedule[];
    setSchedules: Dispatch<SetStateAction<Schedule[]>>;
    deleteSchedule: (work_date: string) => void;
}

const Calendar = ({
    requestMonth,
    schedules,
    setSchedules,
    deleteSchedule
}: CalendarProps) => {
    console.log("requestMonth", requestMonth);
//   const [currentDate] = useState(new Date());
    // requestmonthが 2025/05 の場合は 2025-05-01のように変換
    const currentDate = new Date(requestMonth.replace("/", "-") + "-01");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddSchedule = (schedule: Schedule) => {
    // 同じ日付のスケジュールがある場合は上書き
    const existingScheduleIndex = schedules.findIndex(s => s.work_date === schedule.work_date);
    if (existingScheduleIndex !== -1) {
        const updatedSchedules = [...schedules];
        updatedSchedules[existingScheduleIndex] = schedule;
        setSchedules(updatedSchedules);
    } else {
        // 新しいスケジュールを追加
        setSchedules((prev) => [...prev, schedule]);
    }
  };

  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));
  const days = [];
  let date = start;

  while (date <= end) {
    days.push(date);
    date = addDays(date, 1);
  }

  return (
    <div>
      <div css={header}>{format(currentDate, "yyyy年 MM月")}</div>
      <div css={calendarGrid}>
        {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
          <div key={d} css={{ textAlign: "center", border: "1px solid #ccc", background: "#eee", padding: 4 }}>
            {d}
          </div>
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const schedule = schedules.find((s) => s.work_date === key);
          return (
            <DayCell
              key={key}
              date={day}
              currentMonth={currentDate}
              schedule={schedule}
              onClick={handleDayClick}
            />
          );
        })}
      </div>
      {selectedDate && (
        <ScheduleModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          onSubmit={handleAddSchedule}
          schedules={schedules}
        deleteSchedule={deleteSchedule}
        />
      )}
    </div>
  );
};

export default Calendar;
