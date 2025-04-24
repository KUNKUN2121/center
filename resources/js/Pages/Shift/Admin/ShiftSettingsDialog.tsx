import { format } from 'date-fns';
import HolidayCalendarDialog from './HolidayCalendarDialog';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
    openMonth: string;
    open: boolean;
    handleClose: () => void;
    setHolidayDialogOpen: (open: boolean) => void;
    holidayDialogOpen: boolean;
    baseMonth: Date;
}

interface ShiftSettings {
    startDate: string;
    endDate: string;
    note?: string;
}

const ShiftSettingsDialog: React.FC<Props> = ({
    openMonth,
    open,
    handleClose,
    setHolidayDialogOpen,
    holidayDialogOpen,
    baseMonth,
}) => {
    const [setting, setSetting] = useState<ShiftSettings>({
        startDate: '',
        endDate: '',
        note: '',
    });

    const getDefaultDates = (month: Date) => {
        return {
            startDate: format(new Date(month.getFullYear(), month.getMonth() - 1, 1), 'yyyy-MM-dd'),
            endDate: format(new Date(month.getFullYear(), month.getMonth() - 1, 20), 'yyyy-MM-dd'),
            note: ""
        };
    };

    const fetchShiftSettings = (month: Date) => {
        const { startDate, endDate } = getDefaultDates(month);

        axios
            .get('/shift/admin/api/settings', {
                params: {
                    year: format(month, 'yyyy'),
                    month: format(month, 'M'),
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setSetting({
                        startDate: response.data.start_date,
                        endDate: response.data.end_date,
                        // note: response.data.note,
                        // note: "",
                        note: response.data.note ? response.data.note : ""
                    });
                } else if (response.status === 204) {
                    setSetting({ startDate, endDate, note: '' });
                }
            })
            .catch(() => {
                setSetting({ startDate, endDate, note: '' });
            });
    };

    useEffect(() => {
        const month = new Date(openMonth);
        fetchShiftSettings(month);
    }, [openMonth]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSetting((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        axios
            .post('/shift/admin/api/settings', {
                year: format(new Date(openMonth), 'yyyy'),
                month: format(new Date(openMonth), 'M'),
                start_date: setting.startDate,
                end_date: setting.endDate,
                note: setting.note,
            })
            .then(() => {
                handleClose();
            })
            .catch((error) => {
                console.error('Error saving settings:', error);
            });
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{format(new Date(openMonth), 'yyyy年MM月')}のシフト募集設定</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} mt={1}>
                        <TextField
                            name="startDate"
                            label="募集開始日"
                            type="date"
                            value={setting.startDate}
                            onChange={handleChange}
                        />
                        <TextField
                            name="endDate"
                            label="募集締め切り日"
                            type="date"
                            value={setting.endDate}
                            onChange={handleChange}
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
                        <TextField
                            name="note"
                            label="備考欄"
                            multiline
                            rows={3}
                            placeholder="備考を入力してください"
                            value={setting.note}
                            onChange={handleChange}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>キャンセル</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        保存
                    </Button>
                </DialogActions>
            </Dialog>

            <HolidayCalendarDialog
                open={holidayDialogOpen}
                onClose={() => setHolidayDialogOpen(false)}
                month={openMonth}
            />
        </div>
    );
};

export default ShiftSettingsDialog;
