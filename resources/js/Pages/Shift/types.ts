// types.ts
export type Status = "draft" | "tentative" | "confirmed";

export interface Schedule {
    work_date: string; // YYYY-MM-DD
  status: Status;
  start_time: string;
  end_time: string;
}
