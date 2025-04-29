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
import { ClosedDay, Schedule, SelectedItem } from '../../Pages/Shift/types';
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

export default function RowCalenderNew() {

    // const [data, setData] = useState(<Data>[]);
    const [data, setData] = useState<Data | null>(null);
    const [selectedItem, setSelectedItem] = useState<SelectedItem | null>();
    const [deletedIds, setDeletedIds] = useState<number[]>([]);
    // axiosを使ってAPIからデータを取得する
    const fetchData = () => {
        axios.get('/api/shift/create')
        .then(response => {
            console.log(response.data);
            setData(response.data);
        }).catch(error => {
            console.error('Error fetching holidays:', error);
        }
    );
    }

    useEffect(() => {
        fetchData();
    }, []);

    if(!data){
        return <div>Loading...</div>;
    }

    // カレンダー処理
    const currentDate = new Date(data!.request_month.slice(0, 4) + "-" + data!.request_month.slice(4, 6) + "-01");
    const start = startOfDay(startOfMonth(currentDate));
    const end = endOfMonth(endOfMonth(currentDate));
    const days : Date[] = [];
    let date = start;

    while (date <= end) {
        days.push(date);
        date = addDays(date, 1);
    }



    // 休み判定
    const isClosedDay = (day: Date): boolean => {
        const targetDate = format(day, "yyyy-MM-dd");
        return data.closed_days.some((closed) => closed.date === targetDate);
    };


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

        const handleAddSchedule = async (newSchedule: Schedule) => {
            const isUpdate = data!.confirmed_shifts.some(
                shift => shift.user_id === newSchedule.user_id && shift.work_date === newSchedule.work_date
            );

            // 楽観的更新
            const optimisticUpdate = (schedules: Schedule[]) => {
                setData(prev => ({
                    ...prev!,
                    confirmed_shifts: schedules
                }));
            };

            // 更新用の新しいシフト一覧
            const updatedShifts = isUpdate
                ? data!.confirmed_shifts.map(shift =>
                      shift.user_id === newSchedule.user_id && shift.work_date === newSchedule.work_date
                          ? { ...shift, ...newSchedule }
                          : shift
                  )
                : [...data!.confirmed_shifts, newSchedule];

            optimisticUpdate(updatedShifts);

            try {
                const response = await axios.post('/api/shift/create/add', { schedules: newSchedule });
                const addedSchedule = response.data.schedule;

                // 新規追加時のIDの更新
                if (!isUpdate) {
                    optimisticUpdate(
                        updatedShifts.map(shift =>
                            shift.user_id === newSchedule.user_id && shift.work_date === newSchedule.work_date
                                ? { ...shift, id: addedSchedule.id }
                                : shift
                        )
                    );
                }
            } catch (error) {
                // エラー時は元に戻す
                setData(prev => ({
                    ...prev!,
                    confirmed_shifts: data!.confirmed_shifts
                }));
                console.error('Error saving schedule:', error);
            }
        };



        const handleDeleteSchedule = async (schedule: Schedule) => {
            try {
                setData((prev) => ({
                    ...prev!,
                    confirmed_shifts: prev!.confirmed_shifts.filter(
                        (shift) => shift.user_id !== schedule.user_id || shift.work_date !== schedule.work_date
                    ),
                }));

                await axios.delete(`/api/shift/create/delete/${schedule.id}`);
            } catch (error) {
                // 元に戻す
                setData((prev) => ({
                    ...prev!,
                    confirmed_shifts: [...prev!.confirmed_shifts, schedule],
                }));

                console.error('Error deleting schedule:', error);
            }
        };

        const handleConfirmSubmit = async() => {
            await axios.post('/api/shift/create/confirm', {
                request_month: data!.request_month,
            })
            .then((response) => {
                console.log("response", response);
            }
            ).catch((error) => {
                console.error("error", error);
            }
            );
        }

    return (
    <div css={wapperCss}>
        <Head title="シフト作成" />
        <div css={tableWapperCss}>
            <table>
                <thead>
                    <tr>
                        <th>名前</th>
                        {days.map((day) => {
                            const key = format(day, "yyyy-MM-dd");
                            const closed = isClosedDay(day);

                            return (
                                <th
                                    key={key}
                                    css={css`
                                        background-color: ${closed ? "#f0d3d3" : "inherit"} !important; // 定休日の場合、背景色を変更
                                    `}
                                >
                                    {format(day, "d(eee)", { locale: ja })}
                                </th>
                            );
                        }
                        )}
                    </tr>
                </thead>
                <tbody>
                    {
                        data!.users.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    {
                                        days.map((day) => {
                                            const key = format(day, "yyyy-MM-dd");
                                            const schedule = data!.schedules.find((schedule) => schedule.user_id === user.id && schedule.work_date === key);
                                            const confirmedShift = data!.confirmed_shifts.find((schedule) => schedule.user_id === user.id && schedule.work_date === key);
                                            const closed = isClosedDay(day);
                                            return (
                                                <td key={key}
                                                    onClick={() => {
                                                        handleDayClick({
                                                            date: day,
                                                            userId: user.id,
                                                            schedule: schedule || null,
                                                            confirmedShift: confirmedShift || null,});
                                                    }}
                                                    css={css`
                                                        background-color: ${closed ? "#f0d3d3" : "inherit"} !important; // 定休日の場合、背景色を変更
                                                        cursor: pointer;
                                                        &:hover {
                                                            background-color: #e0e0e0;
                                                        }
                                                    `}
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
        </div>
        <div css={css`
            display: flex;
            justify-content: space-between;
            margin: 20px 20px;
        `}>
             {/* <button
                onClick={() => {
                    console.log("confirmedShifts", confirmedShifts);
                }}
            >test</button>
            <button
                onClick={() => {
                    handleSubmit();
                }}
            >送信</button> */}
            <button
                onClick={
                    () => {
                        handleConfirmSubmit();
                    }
                }>
                シフト確定
            </button> *
        </div>
        {selectedItem && (
            <ScheduleModal
                selectedItem={selectedItem!}
                confirmedShifts={data!.confirmed_shifts}
                handleClose={handleClose}
                handleAddSchedule={handleAddSchedule}
                handleDeleteSchedule={handleDeleteSchedule}

                    />
        )}
    </div>
    );
}


const wapperCss = css`

`;

const tableWapperCss = css`
    overflow-x: auto;
        table {
        border-collapse: collapse;
        width: 100%;
        margin: 20px 20px;
        table-layout: fixed;
    }

    th, td {
        border: 1px solid #ccc;
        width: 100px;
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

const confirmedCss = (confirmedShift : any) => css`
    font-size: 16px;
    /* background-color: #d9f2d9; */
    background-color: ${confirmedShift.status === "confirm" ? "#d9f2d9" : confirmedShift.status === "draft" ? "#fff4cc" : "#fce5cd"};
    width: 100%;
    padding: 10px 0;
`;

const requestScheduleCss = css`
    width: 100%;
    background-color: #d9e6f2;
    font-size: 12px;
    padding: 2px 0;
`;
