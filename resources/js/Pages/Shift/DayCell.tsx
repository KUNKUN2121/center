/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { format, isSameMonth } from "date-fns";
import React from "react";
import { Schedule } from "./types";
import { formatTime } from "@/Feutures/format";

interface Props {
  date: Date;
  currentMonth: Date;
  schedule?: Schedule;
  isClosed?: boolean;
  onClick: (date: Date) => void;
}

// 時間を 00:00 形式に変換する関数


const getDayStyle = (date: Date, currentMonth: Date, status?: Schedule["status"], isClosed:boolean) => {
    let bg = "#fff";

    if (!isSameMonth(date, currentMonth)) {
      bg = "#dbdbdf";
    } else if (status) {
      switch (status) {
        case "draft":
          bg = "#fffae6";
          break;
        case "tentative":
          bg = "#ffe0e0";
          break;
        case "confirm":
          bg = "#d0ffd0";
          break;
      }
    }

    bg = isClosed ? "#dbdbdf" : bg;

    return css`
      height: 110px;
      border: 1px solid #ccc;
      background: ${bg};
      padding: 4px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    `;
  };

const DayCell: React.FC<Props> = ({ date, currentMonth, schedule, isClosed, onClick}) => {
  return (
    <div css={getDayStyle(date, currentMonth, schedule?.status, isClosed)} onClick={() => onClick(date)}>
      <p>{format(date, "d")}</p>
      <div css={itemCss}>
        {schedule && (
                <>
                    <p>{formatTime(schedule.start_time)}</p>
                    <span></span>
                    <p>{formatTime(schedule.end_time)}</p>
                </>
            )}
      </div>

    </div>
  );
};

export default DayCell;

const itemCss = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    p {
      margin: 2px 0;
      font-size: 20px;
    }
    span{
        background-color: #000;
        width: 2px;
        height: 10px;
    }
`
