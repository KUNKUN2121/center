import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { css } from '@emotion/react';
import { Head } from '@inertiajs/react';
import Header from '../Components/Header';

export default function Create() {
    return (
    <div css={testCss}>
        <Header />
        <Calendar />
    </div>
    );
}


const testCss = css`

`;
