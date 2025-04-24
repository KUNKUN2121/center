<?php

namespace App\Http\Controllers;

use App\Models\ClosedDays;
use App\Models\CreateShifts;
use App\Models\RequestShifts;
use App\Models\User;
use Carbon\Carbon;
use GuzzleHttp\Promise\Create;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreateShiftsController extends Controller
{
    public function index() {
        return Inertia::render('Shift/Admin/AdminIndex');
    }

    public function create(){
        // 募集する月を入力
        $requestMonth = "202505";

        // 月の最初の日と最後の日を計算
        $startDate = Carbon::createFromFormat('Ym', $requestMonth)->startOfMonth();
        $endDate = Carbon::createFromFormat('Ym', $requestMonth)->endOfMonth();

        // 募集する月のシフトを取得
        $schedules = RequestShifts::
            where('work_date', '>=', $startDate)
            ->where('work_date', '<=', $endDate)
            ->orderBy('work_date', 'asc')
            ->get();

        // ユーザを取得
        $users = User::all();

        // 確定シフトを取得
        $confirmedShifts = CreateShifts::
            where('work_date', '>=', $startDate)
            ->where('work_date', '<=', $endDate)
            ->orderBy('work_date', 'asc')
            ->get();

        // 休みの日を取得
        $closedDays = ClosedDays::
            where('date', '>=', $startDate)
            ->where('date', '<=', $endDate)
            ->orderBy('date', 'asc')
            ->get();

        return Inertia::render('Shift/Admin/Create/CreateIndex', [
            'request_month' => $requestMonth,
            'schedules' => $schedules,
            'confirmed_shifts' => $confirmedShifts,
            'users' => $users,
            'closed_days' => $closedDays,
        ]);
    }


    public function settings(){
        return Inertia::render('Shift/Admin/ShiftSettings');
    }

    public function createApi(Request $request)
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

        return redirect()->route('shift.create')->with('success', 'シフトが作成されました。');
    }


    // シフトを確定
    public function confirmApi(Request $request)
    {
        $requestMonth = $request->input('request_month');
        $confirmedShifts = CreateShifts::
            where('work_date', '>=', $requestMonth . '-01')
            ->where('work_date', '<=', $requestMonth . '-31')
            ->orderBy('work_date', 'asc')
            ->get();
        // すべてのstatusをdraftからconfirmに変更


        foreach ($confirmedShifts as $shift) {
            $shift->status = 'confirm';
            $shift->save();
        }
        return redirect()->back()->with('message', 'シフトを確定しました');

    }


}

