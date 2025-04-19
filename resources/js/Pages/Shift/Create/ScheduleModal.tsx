/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Schedule, SelectedItem } from "../types";
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
    selectedItem: SelectedItem;
    confirmedShifts: Schedule[];
    handleClose: () => void;
    handleAddSchedule: (schedule: Schedule) => void;
    handleDeleteSchedule: (schedule: Schedule) => void;
}

const ScheduleModal: React.FC<Props> = ({ selectedItem,handleClose,handleAddSchedule,handleDeleteSchedule}) => {
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");

  console.log("selectedItem", selectedItem);


// ほしいのはユーザーのデータ
// 選択された日付

// 希望シフトのデータ
// 確定シフトのデータ




// 確定時間がなく、希望シフトがある場合は希望シフトの時間を収録する

// 確定時間も希望シフトもない場合は、デフォルトの時間を収録する


//     useEffect(() => {
//         const dateString = format(selectedDate, "yyyy-MM-dd");
//         const confirmedShift = confirmedShifts.find((schedule) => schedule.work_date === dateString);
//         const requestSchedule = requestSchedules.find((schedule) => schedule.work_date === dateString);

//         // 確定データがある場合は確定の時間を収録する
//         if (confirmedShift) {
//             setStartTime(formatTime(confirmedShift.start_time));
//             setEndTime(formatTime(confirmedShift.end_time));
//         // 確定データがない場合は希望シフトの時間を収録する
//         } else if (requestSchedule) {
//             setStartTime(formatTime(requestSchedule.start_time));
//             setEndTime(formatTime(requestSchedule.end_time));
//         } else {
//         // 確定データも希望シフトもない場合はデフォルトの時間を収録する
//             setStartTime("16:30");
//             setEndTime("21:00");
//         }
//     }
//     , [selectedDate, confirmedShifts, requestSchedules]);
//   const handleSubmit = () => {
//     onSubmit({
//         user_id: userId,
//         work_date: format(selectedDate, "yyyy-MM-dd"),
//         status: "draft",
//         start_time: startTime,
//         end_time: endTime,
//     });
//     onClose();
//   };
//   const handleDelete = (date : Date) => {
//     onClose();
//   }

    // 確定シフト、希望シフトのデータからスタート時間とエンド時間を取得する
    useEffect(() => {
        if(selectedItem.confirmedShift) {
            setStartTime(formatTime(selectedItem.confirmedShift.start_time));
            setEndTime(formatTime(selectedItem.confirmedShift.end_time));
        }
        else if(selectedItem.schedule) {
            setStartTime(formatTime(selectedItem.schedule.start_time));
            setEndTime(formatTime(selectedItem.schedule.end_time));
        }else{
            setStartTime("10:00");
            setEndTime("12:00");
        }
    }, [selectedItem]);

    const handleDelete = () => {
        onclose;
    }

    const hasConfirmedShift = selectedItem.confirmedShift !== null;


  return (
    <div css={overlay}>
      <div css={modal}>
        <h3>{format(selectedItem.date, "yyyy年MM月dd日")}</h3>
        <label>開始時間:</label>
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        <br />
        <label>終了時間:</label>
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        <div css={buttonWapperCss}>
            <button onClick={handleClose} style={{ marginLeft: "10px" }}>閉じる</button>
            {hasConfirmedShift ? (
                <button
                onClick={() => {
                    handleDeleteSchedule(selectedItem.confirmedShift!);
                    handleClose();
                }
                }
                style={{ marginLeft: "10px" }}
              >
                削除
              </button>
            ) : (
                <div></div>
            )}
                  <button
                    onClick={() => {
                        handleAddSchedule({
                            user_id: selectedItem.userId!,
                            work_date: format(selectedItem.date, "yyyy-MM-dd"),
                            status: "draft",
                            start_time: startTime,
                            end_time: endTime,
                        });
                        handleClose();
                    }
                    }
                    style={{ marginLeft: "10px" }}
                  >
                    保存
                  </button>
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
