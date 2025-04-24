/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Schedule } from "./types";
import { formatTime } from "@/Feutures/format";

const overlay = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const modal = css`
  background: #fff;
  padding: 20px;
  width: 300px;
  border-radius: 8px;
`;

interface Props {
  date: Date;
  onClose: () => void;
  onSubmit: (newSchedule: Schedule) => void;
  schedules: Schedule[];
  deleteSchedule: (work_date: string) => void;
}

const ScheduleModal: React.FC<Props> = ({ date, onClose, onSubmit,schedules,deleteSchedule }) => {
  const [startTime, setStartTime] = useState("16:30");
  const [endTime, setEndTime] = useState("21:00");

    // 既存のスケジュールがあるかを返す関数
    const hasSchedule = (work_date: string) => {
        return schedules.some((schedule) => schedule.work_date === work_date);
    };

  useEffect(() => {
    const existingSchedule = schedules.find(
      (schedule) => schedule.work_date === format(date, "yyyy-MM-dd")
    );
    if (existingSchedule) {
      setStartTime(existingSchedule.start_time);
      setEndTime(existingSchedule.end_time);
    }
  }, [date, schedules]);

  const handleSubmit = () => {
    onSubmit({
        work_date: format(date, "yyyy-MM-dd"),
        status: "draft",
        start_time: startTime,
        end_time: endTime,
    });
  };
  const handleDelete = (date : Date) => {
    deleteSchedule(format(date, "yyyy-MM-dd"));
    onClose();
  }

  // scheduleの追加履歴を取得
  const scheduleHistyory = () => {
    const reversedSchedules = [...schedules].reverse();
    // 同じ時間は除外
    const uniqueSchedules = reversedSchedules.filter((schedule, index, self) =>
      index === self.findIndex((s) => s.start_time === schedule.start_time && s.end_time === schedule.end_time)
    );
    return uniqueSchedules
  }


  return (
    <div css={overlay}>
      <div css={modal}>
        <h3>{format(date, "yyyy年MM月dd日")}</h3>
        <label>開始時間:</label>
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        <br />
        <label>終了時間:</label>
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        <p>履歴追加</p>
        <div css={scheduleHistoryWapperCss}>

            {scheduleHistyory().map((schedule, index) => (
                <button
                    key={index}
                    onClick={() => {
                        setStartTime(schedule.start_time);
                        setEndTime(schedule.end_time);
                        onSubmit({
                            work_date: format(date, "yyyy-MM-dd"),
                            status: "draft",
                            start_time: schedule.start_time,
                            end_time: schedule.end_time,
                        });
                        onClose();
                    } }
                >
                    <span><span css={hisyoryStartTimeCss}>{formatTime(schedule.start_time)}</span> - {formatTime(schedule.end_time)}</span>
                </button>
            ))}
        </div>
        <div css={buttonWapperCss}>
            <button onClick={onClose} style={{ marginLeft: "10px" }}>閉じる</button>
            {
                hasSchedule(format(date, "yyyy-MM-dd")) ? (
                    <>
                    <button onClick={() => handleDelete(date)} style={{ marginLeft: "10px" }}>削除</button>
                    <button onClick={handleSubmit}>変更</button>
                    </>
                ) : (
                    <button onClick={handleSubmit}>追加</button>
                )

            }



        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;

const buttonWapperCss = css`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
`;

const scheduleHistoryWapperCss = css`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    height: 200px;
    overflow-y: scroll;
    border: 1px solid #ccc;
    button {
        display: block;
        font-size: 16px;
        padding: 8px;
        border-bottom: 1px solid #ccc;
    }
`

const hisyoryStartTimeCss = css`
    font-weight: bold;
    font-size: 1.1em;
    `;
