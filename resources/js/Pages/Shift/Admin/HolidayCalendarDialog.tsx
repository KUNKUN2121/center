// HolidayCalendarDialog.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, css } from '@mui/material';
import HolidayCalendar from './HolidayCalendar';

interface Props {
  open: boolean;
  onClose: () => void;
    month: string;
}

const HolidayCalendarDialog: React.FC<Props> = ({ open, onClose, month }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>休館日設定</DialogTitle>
      <DialogContent>
        <span>
            休みにする日をクリックしてください。<br />
            曜日をクリックすることで一括で変更できます。
        </span>
        <div css={infoWapperCss}>
            <div><span css={redCss}/> : 休み</div>
        </div>
        <HolidayCalendar month={month} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HolidayCalendarDialog;


const infoWapperCss = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    div {
        display: flex;
        align-items: center;
    }
`;
const redCss = css`
    width: 16px;
    height: 16px;
    background-color: #fdbbbb;
    display: inline-block;
    margin-right: 8px;
`;
