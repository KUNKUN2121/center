import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { css } from '@emotion/react';
import { Head } from '@inertiajs/react';
import Header from '../Components/Header';
import { Button } from '@mui/material';

export default function Index() {
    const handleBtnClick = (href :string) => {
        window.location.href = '/shift/' + href;
    }
    return (
    <div css={testCss}>
        <Header />
        <div css={shiftRequestWapperCss}>
            <button
                onClick={() => handleBtnClick('request')}
                css={shiftRequestCss}
            >
                シフト提出
            </button>
            <button
                onClick={() => handleBtnClick('#')}
                css={shiftRequestCss}>
                シフト確認
            </button>
            <button
                onClick={() => handleBtnClick('admin/')}
                css ={shiftRequestCss}>
                管理パネル
            </button>
        </div>

        {/* シフト提出 */}
        {/* シフト希望 */}
    </div>
    );
}


const testCss = css`

`;

const shiftRequestWapperCss = css`
    display: flex;
    justify-content: space-around;

`;
const shiftRequestCss = css`
    width: 200px;
    height: 100px;
    border-radius: 10px;
    background: var(--main, linear-gradient(94deg, #1EA263 23%, #0EB0BA 100%));
    color: #FFF;
    font-size: 24px;
    :hover {
        opacity: 0.8;
    }
    transition: 0.3s ease all;
`;
