/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';
import HolidayCalendarDialog from './HolidayCalendarDialog';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material';
import { format, subMonths, setDate } from 'date-fns';
import { router } from '@inertiajs/react';

const ShiftSettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
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
            onClick={month.label === '2025/05' ? handleClickOpen : undefined}
          >
            {month.label}
          </div>
        ))}
      </div>
      <button css={pastButtonCss}>以前のシフト管理</button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>2025年5月のシフト募集設定</DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField
              label="募集開始日"
              type="date"
              defaultValue={defaultStart}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="募集締め切り日"
              type="date"
              defaultValue={defaultEnd}
              InputLabelProps={{ shrink: true }}
            />
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => setHolidayDialogOpen(true)}>
                休館日設定
              </Button>
              <Button variant="outlined" disabled>
                強制参加日（未実装）
              </Button>
              <Button variant="outlined" disabled>
                長期休暇設定（未実装）
              </Button>
            </Stack>
            <TextField label="備考欄" multiline rows={3} placeholder="備考を入力してください" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleClose} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      <HolidayCalendarDialog
        open={holidayDialogOpen}
        onClose={() => setHolidayDialogOpen(false)}
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
