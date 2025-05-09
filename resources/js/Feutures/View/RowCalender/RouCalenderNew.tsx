import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { css } from '@emotion/react';
import { Head, router, usePage } from '@inertiajs/react';
import {
    format,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    addDays,
    startOfDay,
  } from "date-fns";
  import { de, ja } from "date-fns/locale";
import { ClosedDay, Schedule, SelectedItem } from '../../../Pages/Shift/types';
import { formatTime } from '@/Feutures/format';
import { useState } from 'react';
import ScheduleModal from './ScheduleModal';
import { User } from '@/types';
import { useRowCalendar } from '@/hook/useRowCalender';

  type ShiftStatus = "confirm" | "draft" | "preferred";



interface Data {
    request_month: string;
    schedules: Schedule[];
    confirmed_shifts: Schedule[];
    users: User[];
    closed_days: ClosedDay[];
}

  import { useEffect } from 'react';
import axios from 'axios';

export default function RowCalenderNew({
    requestMonth,
    users,
    schedules,
    closedDays,
    // setAlertMessage,
}: {
    requestMonth: string;
    users: User[];
    schedules: Schedule[];
    closedDays: ClosedDay[];
}) {

    // カレンダー処理
    const start = startOfDay(startOfMonth(requestMonth));
    const end = endOfMonth(endOfMonth(requestMonth));
    const days : Date[] = [];
    let date = start;

    while (date <= end) {
        days.push(date);
        date = addDays(date, 1);
    }



    // 休み判定
    const isClosedDay = (day: Date): boolean => {
        const targetDate = format(day, "yyyy-MM-dd");
        return closedDays.some((closed) => closed.date === targetDate);
    };




    return (
    <div css={wapperCss}>
        <div css={tableWapperCss}>
            <table>
                <thead>
                    <tr>
                        <th
                            css={css`
                            width: 100px !important;
                            background-color: #f4f4f4;

                            `}
                        >名前</th>
                        {days.map((day,dayIndex) => {
                            const key = format(day, "yyyy-MM-dd");
                            const closed = isClosedDay(day);
                            const isEvenColumn = dayIndex % 2 === 0; // 偶数列かどうかを判定


                            return (
                                <th
                                    key={key}
                                    css={weekCss(closed, isEvenColumn)}
                                >
                                    <span css={css`
                                        color: ${closed ? "#ff8d8d" : "inherit"} !important;
                                        font-size: 20px;
                                    `}>{format(day, "d", { locale: ja })}</span>
                                    <span
                                        css={css`
                                            color: ${closed ? "#ff8d8d" : "inherit"} !important;
                                            font-size: 12px;
                                        `}
                                    >{format(day, "eee", { locale: ja })}</span>
                                </th>
                            );
                        }
                        )}
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    {
                                        days.map((day,dayIndex) => {
                                            const key = format(day, "yyyy-MM-dd");
                                            const confirmedShift = schedules.find((schedule) => schedule.user_id === user.id && schedule.work_date === key);
                                            const closed = isClosedDay(day);
                                            const isEvenColumn = dayIndex % 2 === 0; // 偶数列かどうかを判定
                                            return (
                                                <td key={key}
                                                    onClick={() => {}}
                                                    css={weekCss(closed, isEvenColumn)}
                                                >
                                                    <div css={cellContentCss}>
                                                            {confirmedShift && (
                                                            <div css={confirmedCss}>
                                                                <span>{formatTime(confirmedShift.start_time)}</span>
                                                                <span>{formatTime(confirmedShift.end_time)}</span>
                                                            </div>
                                                            )}
                                                    </div>
                                                </td>
                                            );
                                        })
                                    }
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
        </div>

    </div>
    );
}


const weekCss = (isClosed:boolean, isEvenColumn:boolean) => {
    return css`
        background-color: ${isClosed ? "#ececec" : "inherit"} !important; // 定休日の場合、背景色を変更
        background-color: ${isEvenColumn ? "#f7f7f7" : "inherit"} !important; // 偶数列は濃いグレー
        &:hover {
            background-color: #e0e0e0;
        }
        span{
            display: block;
        }
    `;
}

const wapperCss = css`

`;

const tableWapperCss = css`
    overflow-x: auto;
        table {
        border-collapse: collapse;
        width: 100%;
        /* margin: 20px 20px; */
        table-layout: fixed;
    }

    th, td {
        border: 1px solid #ccc;
        width: 40px;
        text-align: center;
        height: 80px;
    }

    th, th:first-of-type{
        background-color: #f4f4f4;
    }

`

const cellContentCss = css`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center; /* 横中央揃え */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const confirmedCss = css`
    font-size: 14px;
    background-color: #d9e6f2;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

