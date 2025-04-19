// types.ts
export type Status = "draft" | "tentative" | "confirm";

export interface Schedule {
    id?: number;
    user_id?: number;
    work_date: string; // YYYY-MM-DD
    status: Status;
    start_time: string;
    end_time: string;
}

export interface SelectedItem {
    date: Date;
    userId: number | null;
    schedule: Schedule | null;
    confirmedShift: Schedule | null;

}
