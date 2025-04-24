import { Head, router, usePage } from '@inertiajs/react';
import RowCalender from '../../../../Feutures/Create/RowCalender';



export default function Index() {
    return (
        <div>
            <Head title="シフト作成" />
            <div>
                <span>2025/05 のシフト</span>
                <span>締め切り 5/19</span>
                <span>設定</span>
            </div>

            <select name="" id="">
                <option value="">横表示</option>
                <option value="">人表示</option>
            </select>
            <RowCalender />
        </div>
    )
}

