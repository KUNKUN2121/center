/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';
import { format, subMonths, setDate } from 'date-fns';
import { router } from '@inertiajs/react';
import ShiftSettingsDialog from './ShiftSettingsDialog';

const ShiftSettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [openMonth, setOpenMonth] = useState("2025/05");

  const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);

  const handleClickOpen = (date:string) => {
    setOpenMonth(date);
    console.log(date);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const baseMonth = new Date(2025, 4); // 5月（0始まり）
  const lastMonth = subMonths(baseMonth, 1);
  const defaultStart = format(setDate(lastMonth, 1), 'yyyy-MM-dd');
  const defaultEnd = format(setDate(lastMonth, 20), 'yyyy-MM-dd');

  const handleSubmit = () => {
    const data = {};
    router.post('#', data, {
      onSuccess: () => setOpen(false),
      onError: () => {},
    });
  };

  // 仮のデータ
  const shiftMonths = [
    { label: '2025/04', isPast: true },
    { label: '2025/05', isCurrent: true },
    { label: '2025/06', isFuture: true },
  ];

  const selectMonth = "2025/05";

  return (
    <div css={mainWrapperCss}>
      <h2 css={titleCss}>シフト管理</h2>
      <div css={monthGridCss}>
        {shiftMonths.map((month, index) => (
          <div
            key={month.label}
            css={[
              monthCardCss,
              month.isCurrent && currentMonthCss,
              month.isPast && pastMonthCss,
              month.isFuture && futureMonthCss,
            ]}
            onClick={() => {
                if (!month.isPast) {
                    handleClickOpen(month.label);
                }
            }}
          >
            {month.label}
          </div>
        ))}
      </div>
      <button css={pastButtonCss}>以前のシフト管理</button>

      <ShiftSettingsDialog
        openMonth={openMonth}
        open={open}
        handleClose={handleClose}
        setHolidayDialogOpen={setHolidayDialogOpen}
        holidayDialogOpen={holidayDialogOpen}
        baseMonth={baseMonth}
        />


    </div>
  );
};

export default ShiftSettings;

// Emotion CSS
const mainWrapperCss = css`
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const titleCss = css`
  font-size: 24px;
  margin-bottom: 24px;
  font-weight: bold;
`;

const monthGridCss = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  width: 100%;
  margin-bottom: 24px;
`;

const monthCardCss = css`
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const currentMonthCss = css`
  background-color: #bbdefb;
  font-weight: bold;
`;

const pastMonthCss = css`
  background-color: #eeeeee;
  color: #888;
  cursor: default;
  &:hover {
    background-color: #eeeeee;
  }
`;

const futureMonthCss = css`
  background-color: #e8f5e9;
`;

const pastButtonCss = css`
  background: none;
  border: 1px solid #888;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: #444;
  cursor: pointer;
  margin-top: 12px;
  &:hover {
    background-color: #f5f5f5;
  }
`;
