<?php

namespace App\Http\Controllers;

use App\Models\CreateShifts;
use App\Models\RequestShifts;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreateShiftsController extends Controller
{

    public function index(){
        // 募集する月を入力
        $requestMonth = "2025/05";

        // 募集する月のシフトを取得
        $schedules = RequestShifts::
            where('work_date', '>=', $requestMonth . '-01')
            ->where('work_date', '<=', $requestMonth . '-31')
            ->orderBy('work_date', 'asc')
            ->get();

        // ユーザを取得
        $users = User::all();

        // 確定シフトを取得
        $confirmedShifts = CreateShifts::
            where('work_date', '>=', $requestMonth . '-01')
            ->where('work_date', '<=', $requestMonth . '-31')
            ->orderBy('work_date', 'asc')
            ->get();

        return Inertia::render('Shift/Create/Index', [
            'request_month' => $requestMonth,
            'schedules' => $schedules,
            'confirmed_shifts' => $confirmedShifts,
            'users' => $users,
        ]);
    }

    public function create(Request $request)
    {

        // バリデーション
        $request->validate([
            'schedules' => 'nullable|array',
            'schedules.*.user_id' => 'required|exists:users,id',
            'schedules.*.work_date' => 'required|date',
            'schedules.*.start_time' => 'required|date_format:H:i',
            'schedules.*.end_time' => 'required|date_format:H:i',
            'deleted_ids' => 'nullable|array',
            'deleted_ids.*' => 'integer|exists:create_shifts,id',
        ]);
        $deletedIds = $request->input('deleted_ids');

        // 登録処理（新しい確定シフト）
        foreach ($request->schedules as $scheduleData) {
            CreateShifts::updateOrCreate(
                [
                    'user_id' => $scheduleData['user_id'],
                    'work_date' => $scheduleData['work_date'],
                ],
                [
                    'start_time' => $scheduleData['start_time'],
                    'end_time' => $scheduleData['end_time'],
                    'status' => $scheduleData['status'],
                ]
            );
        }

        // 削除処理
        if (!empty($request->deleted_ids)) {
            CreateShifts::whereIn('id', $request->deleted_ids)->delete();
        }

        return redirect()->back()->with('message', 'シフトを保存しました');


        $schedules = $request->input('schedules');

        // foreach ($schedules as $schedule) {
        //     // シフトの作成
        //     // 既存のシフトがある場合は更新
        //     $existingShift = CreateShifts::where('user_id', $schedule['user_id'])->where('work_date', $schedule['work_date'])->first();
        //     if ($existingShift) {
        //         $existingShift->update([
        //             'start_time' => $schedule['start_time'],
        //             'end_time' => $schedule['end_time'],
        //         ]);
        //     } else {
        //         CreateShifts::create([
        //             'user_id' => $schedule['user_id'],
        //             'work_date' => $schedule['work_date'],
        //             'start_time' => $schedule['start_time'],
        //             'end_time' => $schedule['end_time'],
        //         ]);
        //     }


        // }
        return redirect()->route('shift.create')->with('success', 'シフトが作成されました。');
    }
}

