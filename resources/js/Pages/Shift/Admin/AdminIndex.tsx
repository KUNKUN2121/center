import { css } from "@emotion/react";
import { Head } from "@inertiajs/react";

export default function AdminIndex () {
    return (
        <div>
            <Head title="管理パネル" />
            <div css={shiftRequestWapperCss}>
                <button css={shiftRequestCss}
                    onClick={() => window.location.href = '/shift/admin/create'}
                >シフト作成</button>
                <button css={shiftRequestCss}
                    onClick={() => window.location.href = '/shift/admin/settings'}
                >シフト募集設定</button>
            </div>
        </div>
    )
}

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
