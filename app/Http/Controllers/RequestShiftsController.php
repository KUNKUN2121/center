<?php

namespace App\Http\Controllers;

use App\Models\RequestShifts;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RequestShiftsController extends Controller
{
    //
    public function index()
    {
         // 募集する月を入力
         $requestMonth = "2025/05";



        $userId = auth()->id();
        // 募集する月のシフトを取得
        $schedules = RequestShifts::where('user_id', $userId)
            ->where('work_date', '>=', $requestMonth . '-01')
            ->where('work_date', '<=', $requestMonth . '-31')
            ->orderBy('work_date', 'asc')
            ->get();



        return Inertia::render('Shift/Request', [
            'request_month' => $requestMonth,
            'schedules' => $schedules,
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
    }

    // シフトの削除
    public function destroy(Request $request)
{
    $userId = auth()->id();

    $request->validate([
        'work_date' => 'required|date',
    ]);

    RequestShifts::where('user_id', $userId)
        ->where('work_date', $request->work_date)
        ->delete();

    return response()->json(['message' => 'Deleted']);
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
