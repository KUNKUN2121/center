import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { css } from '@emotion/react';
import { Head, router, usePage } from '@inertiajs/react';
import Header from '../Components/Header';
import Calendar from './Calendar';
import { useEffect, useState } from 'react';
import { ClosedDay, Schedule } from './types';
import { Alert } from '@mui/material';
import axios from 'axios';
import { format, parse } from 'date-fns';



export default function Request() {
    // Inertia経由で渡された props を取得
    const { props } = usePage();
    const initialSchedules = props.schedules as Schedule[];
    const requestMonth = props.request_month as string;
    const note = props.note as string;
    const endDate = props.end_date as string;

    const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules ?? []);

    const [alertMessage, setAlertMessage] = useState<{ message: string, severity: 'success' | 'info' | 'warning' | 'error' } | null>(null);

    const [isFirstRender, setIsFirstRender] = useState(true);

// 休みの日を
    const closedDays = props.closed_days as ClosedDay[];




    // postように変換する
    const convertSchedules = () => {
        return schedules.map((schedule) => ({
            work_date: schedule.work_date,
            status: schedule.status,
            start_time: schedule.start_time.slice(0, 5),
            end_time: schedule.end_time.slice(0, 5),
        }));
    };

    //   alertMessageを3秒後に消す
        useEffect(() => {
            if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
            }
        }, [alertMessage]);

    const handleSubmit = async () => {
        try {
            const response = await axios.post('./request', {
                schedules: convertSchedules(),
            });

            // レスポンスの処理
            if(response.status === 200) {
                console.log("handleSubmit : POST success");
            }else {
                setAlertMessage({ message: "保存中にエラーが発生しました。", severity: "error" });
            }

        } catch (error) {
            console.error("handleSubmit : POST error");
            setAlertMessage({ message: "保存中にエラーが発生しました。", severity: "error" });
            console.error(error);
        }
    };

    const deleteSchedule = async (work_date: string) => {
        console.log("deleteSchedule", work_date);
        try {
            const response = await axios.delete('./request', {
                data: { work_date },
            });
            if (response.status === 200) {
                setAlertMessage({ message: "削除しました", severity: "success" });
                console.log("deleteSchedule : POST success");
                setSchedules((prev) => prev.filter(s => s.work_date !== work_date));
            }
        } catch (error) {
            setAlertMessage({ message: "削除中にエラーが発生しました。", severity: "error" });
            console.error("deleteSchedule : POST error");
            console.error(error);

        }
    };


    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return; // 初回レンダリング時はPOSTしない
        }
        // 内容が増えた場合のみPOSTする
        if (schedules.length === 0) {
            return; // スケジュールが空の場合はPOSTしない
        }
        const data = { schedules: convertSchedules() };
        handleSubmit();

    }, [schedules]);

    console.log("schedules", requestMonth);
    const date = parse(requestMonth, 'yyyy-MM', new Date())

    return (
    <div css={testCss}>
        <Header />
        <h1 css={monthCss}>{format(date,"yyyy年MM月")}</h1>
        <div css={messageBoxCss}>
            <p>{note}</p>
            <p>締め切り : {format(endDate,"M月dd日")}</p>
        </div>
        <Calendar requestMonth={requestMonth} schedules={schedules} setSchedules={setSchedules} closedDays={closedDays} deleteSchedule={deleteSchedule} setAlertMessage={setAlertMessage}/>
        {alertMessage && (
            <Alert severity={alertMessage.severity} onClose={() => setAlertMessage(null)} style={{
                zIndex: 2000,
                position: "fixed",
                bottom: "10%",
                right: "4%",
                width: "350px",
            }}>
                {alertMessage.message}
            </Alert>
        )}
    </div>
    );
}


const testCss = css`

`;

const monthCss = css`
  text-align: center;
  font-size: 24px;
  margin-top: 40px;
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

const messageBoxCss = css`
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
    color: #212529;
    max-width: 800px;
    margin: 0 auto 24px;
`;
