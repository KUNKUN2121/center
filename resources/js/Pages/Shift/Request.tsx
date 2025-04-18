import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { css } from '@emotion/react';
import { Head, router, usePage } from '@inertiajs/react';
import Header from '../Components/Header';
import Calendar from './Calendar';
import { useEffect, useState } from 'react';
import { Schedule } from './types';

export default function Request() {
    // Inertia経由で渡された props を取得
    const { props } = usePage();
    const initialSchedules = props.schedules as Schedule[];
    const requestMonth = props.request_month as string;

    const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules ?? []);
    // postように変換する
    const convertSchedules = () => {
        return schedules.map((schedule) => ({
            work_date: schedule.work_date,
            status: schedule.status,
            start_time: schedule.start_time.slice(0, 5),
            end_time: schedule.end_time.slice(0, 5),
        }));
    };

    const handleSubmit = () => {
        router.post('/request', {
            schedules: convertSchedules(),
        });
    }

    const deleteSchedule = (work_date: string) => {
        console.log("deleteSchedule", work_date);
        router.delete('/request', {
            data: { work_date },
            onSuccess: () => {
                setSchedules((prev) => prev.filter(s => s.work_date !== work_date));
            }
        });
    };


    useEffect(() => {
        const data = { schedules: convertSchedules() };
        console.log(JSON.stringify(data, null, 2));
        handleSubmit();

    }, [schedules]);
    return (
    <div css={testCss}>
        <Header />
        <Calendar requestMonth={requestMonth} schedules={schedules} setSchedules={setSchedules} deleteSchedule={deleteSchedule}/>

        <div css={submitBtnWapperCss}>
            <button
                onClick={() => {
                    schedules.map((schedule) => {
                        deleteSchedule(schedule.work_date);
                    });
                }
                }
            >クリア</button>
        </div>
    </div>
    );
}


const testCss = css`

`;

const submitBtnWapperCss = css`
    display: flex;
    justify-content: space-between;
    margin: 0 20px;
    button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        :hover {
            background-color: #0056b3;
        }
    }
`;
