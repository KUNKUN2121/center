/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import axios from "axios";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  formatDate,
  getDay,
  isSameDay,
  isSameMonth,
  set,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, { useEffect, useState } from "react";


const backgroundWapperCss = css`
    width: 80%;
    margin: 0 auto;
    border-radius: 20px;
    height: 100%;
    /* background-color: rgba(0, 0, 0, 0.4); */
    background-color: #FFF;
`;
const wrapper = css`
  max-width: 800px;
  height: 100%;
  margin: 0 auto;
`;

const header = css`
  text-align: center;
  font-size: 24px;
  margin-bottom: 12px;
`;

const weekdayButtons = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 12px;
`;

const weekdayButton = css`
  padding: 6px 0;
  text-align: center;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  user-select: none;
    font-weight: "bold";
  &:hover {
    background-color: #ddd;
  }
`;

const calendarGrid = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const dayCell = (isCurrentMonth: boolean, selected: boolean) => css`
  height: 100px;
  border: 1px solid #ccc;
  background-color: ${selected ? "#ffdcdc" : isCurrentMonth ? "#fff" : "#f3f3f3"};
  padding: 4px;
  cursor: ${isCurrentMonth ? "pointer" : "default"};
  text-align: right;
  font-size: 16px;
`;

interface Props {
    month: string;
}

interface Holiday {
    id?: number;
    date: string;
    reason: string;
}
const HolidayCalendar: React.FC<Props> = ({ month }) => {
  const baseMonth = new Date(month)
  const [selectedDates, setSelectedDates] = useState<Holiday[]>([]);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    fetchHolidays();
  }, []);

  useEffect(() => {
    // 初回レンダリング時にPOSTしない
    if (isFirstRender) {
        setIsFirstRender(false);
        return;
    }
    handleSubmit();

  }, [selectedDates]);


    // 休館日情報を取得する
    const fetchHolidays = () => {
        axios.get('/shift/admin/create/holiday',{
            params:{
                month: format(month,"yyyyMM")
            }
        })
        .then(response => {
            console.log('Holidays:', response.data);
            setSelectedDates(
                response.data.map((holiday: Holiday) => ({
                    id: holiday.id,
                    date: format(new Date(holiday.date), 'yyyy-MM-dd'),
                    reason: holiday.reason,
                }))
            );
        }
        )
        .catch(error => {
            console.error('Error fetching holidays:', error);
        }
        );
    };


    const handleSubmit = () => {
        axios.post('/shift/admin/create/holiday', {
            // dateは 2025-05-01 のような形式にする
            holidays: selectedDates.map((date) => ({
                id: date.id,
                date: date.date,
                reason: date.reason,
            })),
        })
        .then(response => {
            console.log('Success:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        }
        );
    };

    const handleDelete = (id: number) => {
        axios.delete(`/shift/admin/create/holiday/${id}`, {
            data: {
                // id: id,
            }
        })
        .then(response => {
            console.log('Success:', response.data);
            setSelectedDates((prev) => prev.filter((holiday) => holiday.id !== id));
        }
        )
        .catch(error => {
            console.error('Error:', error);
        }
        );
    };

  const isSelected = (date: Date) =>
    selectedDates.some((d) => isSameDay(new Date(d.date), date));

  const toggleDate = (date: Date) => {
    if (!isSameMonth(date, baseMonth)) return;

    const target = selectedDates.find((d) => isSameDay(new Date(d.date), date));
    const exists = !!target;

    if (exists) {
      // サーバーに削除リクエスト
      if (target?.id) {
        handleDelete(target.id);
      } else {
        // ローカルで追加しただけのもの（未保存）なら state から削除だけ
        setSelectedDates((prev) =>
          prev.filter((d) => !isSameDay(new Date(d.date), date))
        );
      }
    } else {
      setSelectedDates((prev) => [
        ...prev,
        { date: format(date, 'yyyy-MM-dd'), reason: "" },
      ]);
    }
  };

  const toggleWeekday = (weekday: number) => {
    const start = startOfMonth(baseMonth);
    const end = endOfMonth(baseMonth);
    let date = start;
    const matchingDates: Date[] = [];

    while (date <= end) {
      if (getDay(date) === weekday) {
        matchingDates.push(date);
      }
      date = addDays(date, 1);
    }

    const allSelected = matchingDates.every(isSelected);
    setSelectedDates((prev) =>
      allSelected
        ? prev.filter((d) => !matchingDates.some((m) => isSameDay(new Date(d.date), m)))
        : [
            ...prev,
            ...matchingDates
              .filter((m) => !isSelected(m))
              .map((m) => ({ date: format(m, 'yyyy-MM-dd'), reason: "" }))
          ]
    );
  };

  const start = startOfWeek(startOfMonth(baseMonth));
  const end = endOfWeek(endOfMonth(baseMonth));
  const days = [];
  let date = start;

  while (date <= end) {
    days.push(date);
    date = addDays(date, 1);
  }

  return (
    <div css={backgroundWapperCss}>
        <div css={wrapper}>
        <div css={header}>{format(baseMonth, "yyyy年 MM月")}の休館日設定</div>

        {/* 曜日ボタン */}


        {/* カレンダー本体 */}
        <div css={calendarGrid}>
            {["日", "月", "火", "水", "木", "金", "土"].map((d, idx) => (
            <div
                key={d}
                onClick={() => toggleWeekday(idx)}
                css={weekdayButton}
            >
                {d}
            </div>
            ))}
            {days.map((day) => (
            <div
                key={day.toISOString()}
                css={dayCell(isSameMonth(day, baseMonth), isSelected(day))}
                onClick={() => toggleDate(day)}
            >
                {format(day, "d")}
            </div>
            ))}
        </div>
        </div>
    </div>
  );
};

export default HolidayCalendar;
