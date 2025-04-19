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
import { Schedule, SelectedItem } from '../types';
import { formatTime } from '@/Feutures/format';
import { useState } from 'react';
import ScheduleModal from './ScheduleModal';

  type ShiftStatus = "confirm" | "draft" | "preferred";



  type User = {
    id: number;
    name: string;
    email: string;
  };



export default function Index() {
    const { props } = usePage();

    // シフト募集の月を取得
    const requestMonth = props.request_month as string;


    // シフト希望の管理
    const prosRequestSchedules = props.schedules as Schedule[];
    const [requestSchedules, setRequestSchedules] = useState<Schedule[]>(prosRequestSchedules);

    // 確定シフトの状態の管理
    const prosConfirmedShifts = props.confirmed_shifts as Schedule[];
    const [confirmedShifts, setConfirmedShifts] = useState<Schedule[]>(prosConfirmedShifts);
    // 削除されたスケジュールを管理
    const [deletedIds, setDeletedIds] = useState<number[]>([]);

    // ユーザのデータを取得
    const users = props.users as User[];


    const [selectedItem, setSelectedItem] = useState<SelectedItem | null>();


    // カレンダーの初期化処理
    const currentDate = new Date(requestMonth.replace("/", "-") + "-01");
    const start = startOfDay(startOfMonth(currentDate));
    const end = endOfMonth(endOfMonth(currentDate));
    const days : Date[] = [];
    let date = start;

    while (date <= end) {
    days.push(date);
    date = addDays(date, 1);
    }


    // 確定シフトの追加
    const handleAddSchedule = (newSchedule: Schedule) => {
        console.log("handleAddSchedule");
        // 同じものがあった場合上書きする
        const existingScheduleIndex = confirmedShifts.findIndex((schedule) => schedule.user_id === newSchedule.user_id && schedule.work_date === newSchedule.work_date);
        if (existingScheduleIndex !== -1) {
            const updatedConfirmedShifts = [...confirmedShifts];
            updatedConfirmedShifts[existingScheduleIndex] = newSchedule;
            setConfirmedShifts(updatedConfirmedShifts);
        } else {
            setConfirmedShifts((prev) => [...prev, newSchedule]);
        }
    };

    const handleDeleteSchedule = (schedule: Schedule) => {
        console.log("handleDeleteSchedule");
        // 確定シフトを削除する
        setConfirmedShifts((prev) => prev.filter((s) => s.user_id !== schedule.user_id || s.work_date !== schedule.work_date));
        // 削除されたスケジュールのIDを追加する
        if (schedule.id) {
            setDeletedIds((prev) => [...prev, schedule.id!]);
        }
    }


    // DBに登録する
    const handleSubmit = () => {
        // idがnullのもののみ登録する
        const schedulesToSubmit = confirmedShifts.filter((schedule) => !schedule.id);
        const data = {
            schedules: schedulesToSubmit.map((schedule) => ({
                user_id: schedule.user_id,
                work_date: schedule.work_date,
                status: schedule.status,
                start_time: schedule.start_time,
                end_time: schedule.end_time,
            })),
            deleted_ids: deletedIds,
        }
        console.log("handleSubmit");
        console.log(JSON.stringify(data, null, 2));
        router.post('/create', data, {
            onSuccess: () => {
                // 登録後に新しいスケジュールを取得して状態を更新する
                setConfirmedShifts((prev) => prev.map((schedule) => ({ ...schedule, id: schedule.id || Math.random() })));
                setDeletedIds([]);
            },
        });
    }


    // スケジュールの追加系
    // 日付を選択したときに呼ばれる
    const handleDayClick = ({
        date,
        userId,
        schedule,
        confirmedShift,
    }: SelectedItem) => {
            setSelectedItem({
            date,
            userId,
            schedule,
            confirmedShift,
        });
    };
    const handleClose = () => {
        setSelectedItem(null);
    }

    return (
    <div css={testCss}>
        <table>
            <thead>
                <tr>
                    <th>名前</th>
                    {days.map((day) => {
                        const key = format(day, "yyyy-MM-dd");
                        return (
                            <th key={key}>
                                {format(day, "d(eee)", { locale: ja })}
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
                                    days.map((day) => {
                                        const key = format(day, "yyyy-MM-dd");
                                        const schedule = requestSchedules.find((schedule) => schedule.user_id === user.id && schedule.work_date === key);
                                        const confirmedShift = confirmedShifts.find((schedule) => schedule.user_id === user.id && schedule.work_date === key);
                                        return (
                                            <td key={key}
                                                onClick={() => {
                                                    handleDayClick({
                                                        date: day,
                                                        userId: user.id,
                                                        schedule: schedule || null,
                                                        confirmedShift: confirmedShift || null,});
                                                }}
                                            >
                                                <div css={cellContentCss}>
                                                        {/* 希望シフト */}
                                                        {schedule ? (
                                                            <div css={requestScheduleCss}>
                                                                <p>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</p>
                                                            </div>
                                                        ) : (
                                                            <div>-</div>
                                                        )}

                                                        {/* 確定シフト */}
                                                        {confirmedShift && (
                                                        <div css={confirmedCss(confirmedShift)}>
                                                            <p>
                                                                {formatTime(confirmedShift.start_time)} - {formatTime(confirmedShift.end_time)}
                                                            </p>
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
        <button
            onClick={() => {
                console.log("confirmedShifts", confirmedShifts);
            }}
        >test</button>
        <button
            onClick={() => {
                handleSubmit();
            }}
        >送信</button>
        <button>
            シフト確定
        </button>
        {selectedItem && (
        <ScheduleModal
            selectedItem={selectedItem!}
            confirmedShifts={confirmedShifts}
            handleClose={handleClose}
            handleAddSchedule={handleAddSchedule}
            handleDeleteSchedule={handleDeleteSchedule}

        />
      )}
    </div>
    );
}


const testCss = css`
    table {
        border-collapse: collapse;
        width: 100%;
        margin: 20px 20px;
        table-layout: fixed;
    }

    th, td {
        border: 1px solid #ccc;
        width: 140px;
        text-align: center;
        height: 80px;
    }

    th {
        background-color: #f4f4f4;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }
`;

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

const confirmedCss = (confirmedShift : any) => css`
    font-size: 18px;
    /* background-color: #d9f2d9; */
    background-color: ${confirmedShift.status === "confirm" ? "#d9f2d9" : confirmedShift.status === "draft" ? "#fff4cc" : "#fce5cd"};
    width: 100%;
    padding: 10px 0;
`;

const requestScheduleCss = css`
    width: 100%;
    /* background-color: #d9e6f2; */
`;
