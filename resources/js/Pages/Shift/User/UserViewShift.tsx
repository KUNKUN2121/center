import axios from "axios";
import { useEffect, useState } from "react";
import { Schedule } from "../types";
import ViewCalender from "@/Feutures/View/NormalCalender/ViewCalender";
import { css, Select } from "@mui/material";
import RowCalenderNew from "@/Feutures/View/RowCalender/RouCalenderNew";
import { parse, format } from 'date-fns'
import { User } from "@/types";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
export default function UserViewShift() {

    const [confirmShift, setConfirmShift] = useState<Schedule[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [closedDays, setClosedDays] = useState([]);
    const [selectedView, setSelectedView] = useState("1");
    const [requestMonth, setRequestMonth] = useState(new Date().toISOString().slice(0, 7));

    // axiosでデータを取得する
    const fetchData = async () => {
        try {
            const response = await axios.get('/api/shift/view?month=' + requestMonth);
            console.log(response.data);
            setConfirmShift(response.data.confirmedShifts);
            setUsers(response.data.users);
            setClosedDays(response.data.closedDays);
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [requestMonth]);


    // 月の変更
    const handleMonthChange = async (month: string) => {
        setRequestMonth(month);
    }
    // シフト交代
    const handleChangeShift = async (schedule:Schedule) => {
        console.log("handleChangeShift", schedule);
    }



    let userId = 1;
    const date = parse(requestMonth, 'yyyy-MM', new Date())
    // if(confirmShift.length === 0) {
    //     return (
    //         <div>シフトがありません。</div>
    //     );
    // }
    return (
        <div css={wapperCss}>
            <div css={titleCss}>
                <div css={btnCss}>
                    <KeyboardArrowLeftIcon
                        onClick={() => {
                            const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
                            handleMonthChange(format(prevMonth, 'yyyy-MM'));
                        }}
                        style={{ cursor: "pointer" }}
                    />
                    <h1>{format(date, 'yyyy年MM月')}</h1>
                    <KeyboardArrowRightIcon
                        onClick={() => {
                            const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
                            handleMonthChange(format(nextMonth, 'yyyy-MM'));
                        }}
                        style={{ cursor: "pointer" }}
                    />
                </div>

                <select
                    value={selectedView}
                    onChange={(e) => setSelectedView(e.target.value)}
                >
                    <option value="1">個人シフト</option>
                    <option value="2">全体シフト</option>
                </select>
            </div>

            <div css={contentsCss}>
                {selectedView === "1" ? (
                    <>
                    <p>{users.find((user) => user.id === userId)?.name}のシフト</p>
                    <ViewCalender
                        requestMonth={requestMonth}
                        schedules={confirmShift}
                        closedDays={closedDays}
                        userId={userId}
                        handleChangeShift={handleChangeShift}
                    />
                    </>
                ) : (
                    <RowCalenderNew
                        requestMonth={requestMonth}
                        users={users}
                        schedules={confirmShift}
                        closedDays={closedDays}
                    />
                )}
            </div>



        </div>
    );
}

const wapperCss = css`

`;

const titleCss = css`
    margin: 24px auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    h1 {
        margin: 0;
        font-size: 24px;
    }
    select{
        margin-top: 20px;
    }
`;

const btnCss = css`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const contentsCss = css`
    max-width: 1600px;
    margin: 0 auto;
`;
