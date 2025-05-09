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
import { ClosedDay, Schedule } from "../../../Pages/Shift/types";
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
    userId: number;
    handleChangeShift: (schedule: Schedule) => void;
}

const ViewCalender = ({
    requestMonth,
    schedules,
    closedDays,
    userId,
    handleChangeShift,
}: CalendarProps) => {
    console.log("requestMonth", requestMonth);
    // requestmonthが 2025/05 の場合は 2025-05-01のように変換
    const currentDate = new Date(requestMonth.replace("/", "-") + "-01");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);





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
      {/* <div css={header}>{format(currentDate, "yyyy年 MM月")}</div> */}
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
              userId={userId}
              isClosed={isClosed}
              onClick={() => handleChangeShift(schedule as Schedule)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ViewCalender;
