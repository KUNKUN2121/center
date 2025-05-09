<?php

namespace App\Http\Controllers;

use App\Models\ClosedDays;
use App\Models\RequestShifts;
use App\Models\ShiftRequestSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class RequestShiftsController extends Controller
{
    //
    public function index()
    {
        // 募集している月を取得
        $getData = ShiftRequestSettings::where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->orderBy('start_date', 'asc')
            ->first();
        // "2025-05"

        if(!$getData) {
            return "募集中のシフトがありません";
        }
        $requestMonth = $getData->year . '-' . $getData->month;



        $userId = auth()->id();
        // 募集する月のシフトを取得
        $schedules = RequestShifts::where('user_id', $userId)
            ->where('work_date', '>=', $requestMonth . '-01')
            ->where('work_date', '<=', $requestMonth . '-31')
            ->orderBy('work_date', 'asc')
            ->get();

        // ClosedDaysを取得
        $closedDays = ClosedDays::where('date', '>=', $requestMonth . '-01')
            ->where('date', '<=', $requestMonth . '-31')
            ->orderBy('date', 'asc')
            ->get();


        return Inertia::render('Shift/Request', [
            'request_month' => $requestMonth,
            'schedules' => $schedules,
            'closed_days' => $closedDays,
            'note' => $getData->note,
            'end_date' => $getData->end_date,
        ]);
    }

    public function store(Request $request)
    {
        $userId = auth()->id();

        $request->validate([
            'schedules' => 'required|array',
            'schedules.*.work_date' => 'required|date',
            'schedules.*.start_time' => 'required|date_format:H:i',
            'schedules.*.end_time' => 'required|date_format:H:i|after:schedules.*.start_time',
        ]);

        try {

            // 一つ一つ保存する
            foreach ($request->input('schedules') as $schedule) {

                // すでに同じ日付のシフトがある場合は上書きする
                $existingShift = RequestShifts::where('user_id', $userId)
                    ->where('work_date', $schedule['work_date'])
                    ->first();
                if ($existingShift) {
                    $existingShift->update([
                        'start_time' => $schedule['start_time'],
                        'end_time' => $schedule['end_time'],
                        'status' => $schedule['status'] ?? 'draft',
                    ]);
                    continue;
                }


                // 新しいシフトを作成
                RequestShifts::create([
                    'user_id' => $userId,
                    'work_date' => $schedule['work_date'],
                    'start_time' => $schedule['start_time'],
                    'end_time' => $schedule['end_time'],
                ]);

            }
            return response()->json([
                'success' => true,
                'message' => 'シフトを登録しました',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'シフトの登録に失敗しました',
            ], 500);
        }
    }

    // シフトの削除
    public function destroy(Request $request)
{
    $userId = auth()->id();

    $request->validate([
        'work_date' => 'required|date',
    ]);

    try{
        RequestShifts::where('user_id', $userId)
        ->where('work_date', $request->work_date)
        ->delete();

        return response()->json([
            'success' => true,
            'message' => 'シフトを削除しました',
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'シフトの削除に失敗しました',
        ], 500);
    }


}

    public function path(Request $request) {
        $userId = auth()->id();
        // draftを確定させる

        $schedules = RequestShifts::where('user_id', $userId)
            ->orderBy('work_date', 'asc')
            ->get();

        return Inertia::render('Shift/Request', [
            'schedules' => $schedules,
        ]);

    }
}
