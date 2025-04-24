/** @jsxImportSource @emotion/react */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { ClosedDay, Schedule } from "./types";
import { Alert } from "@mui/material";
import { on } from "events";
import { formatTime } from "@/Feutures/format";


const wapperCss = css`
    max-width: 800px;
    margin: 0 auto;
`;
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
    closedDays: ClosedDay[];
    setSchedules: Dispatch<SetStateAction<Schedule[]>>;
    deleteSchedule: (work_date: string) => void;
    setAlertMessage: Dispatch<SetStateAction<{ message: string; severity: 'success' | 'info' | 'warning' | 'error' } | null>>;
}

const Calendar = ({
    requestMonth,
    schedules,
    closedDays,
    setSchedules,
    deleteSchedule,
    setAlertMessage,
}: CalendarProps) => {
    console.log("requestMonth", requestMonth);
    // requestmonthが 2025/05 の場合は 2025-05-01のように変換
    const currentDate = new Date(requestMonth.replace("/", "-") + "-01");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const handleDayClick = (date: Date) => {
    // requestMonthより前の日付はクリックできない
    // 休みの日付はクリックできない
    const isClosed = closedDays.some((closedDay) => closedDay.date === format(date, "yyyy-MM-dd"));
    if (date < startOfMonth(currentDate) || isClosed) {
        setAlertMessage({ message: "このの日付は選択できません。", severity: "error" });
        return;
    }
    setSelectedDate(date);
  };

    const isValidTime = (start: string, end: string) => {
        const startTime = new Date(`1970-01-01T${formatTime(start)}:00`);
        const endTime = new Date(`1970-01-01T${formatTime(end)}:00`);
        return startTime < endTime;
    };

  const handleAddSchedule = (schedule: Schedule) => {
    if(!isValidTime(schedule.start_time, schedule.end_time)) {
        setAlertMessage({ message: "終了時間が開始時間より早いため保存できません。", severity: "error" });
        return;
    }
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
    setSelectedDate(null);
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
    <div css={wapperCss}>
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
          const isClosed = closedDays.some((closedDay) => closedDay.date === key);
          return (
            <DayCell
              key={key}
              date={day}
              currentMonth={currentDate}
              schedule={schedule}
              isClosed={isClosed}
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
