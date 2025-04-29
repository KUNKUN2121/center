<?php

namespace App\Http\Controllers;

use App\Models\ClosedDays;
use App\Models\CreateShifts;
use App\Models\RequestShifts;
use App\Models\ShiftRequestSettings;
use App\Models\User;
use Carbon\Carbon;
use GuzzleHttp\Promise\Create;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreateShiftsController extends Controller
{

    // API　
    // 現在の状態を取得
    public function getApi(){
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
        return response()->json([
            'request_month' => $requestMonth,
            'schedules' => $schedules,
            'confirmed_shifts' => $confirmedShifts,
            'users' => $users,
            'closed_days' => $closedDays,
        ]);
    }


    public function deleteApi($id){
        $schedule = CreateShifts::find($id);
        if (!$schedule) {
            return response()->json(['error' => 'Schedule not found'], 404);
        }
        $schedule->delete();
        return response()->json(['message' => 'Schedule deleted successfully']);
    }




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


    public function settingsPage(){
        return Inertia::render('Shift/Admin/ShiftSettings');
    }


    public function settingsPostApi(Request $request)
    {
        // バリデーション
        $request->validate([
            'year' => 'required|integer|date_format:Y',
            'month' => 'required|date_format:m',
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d',
            'note' => 'nullable|string|max:255',
        ]);

        ShiftRequestSettings::updateOrCreate(
            [
                'year' => $request->input('year'),
                'month' => $request->input('month'),
            ],
            [
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
                'note' => $request->input('note'),
            ]
        );

        return response()->json(['message' => 'シフト設定が保存されました。']);

    }

    public function settingsGetApi(Request $request)
    {
        // バリデーション
        $request->validate([
            'year' => 'required|integer|date_format:Y',
            'month' => 'required|date_format:m',
        ]);

        // シフト設定を取得
        $shiftRequestSettings = ShiftRequestSettings::
            where('year', $request->input('year'))
            ->where('month', $request->input('month'))
            ->first();

        if ($shiftRequestSettings) {
            return response()->json($shiftRequestSettings);
        } else {
            return response()->json(['message' => 'シフト設定が見つかりません。'], 204);
        }
    }


    public function createApi(Request $request)
    {
        // バリデーション
        $request->validate([
            'schedules' => 'nullable|array',
            'schedules.user_id' => 'required|exists:users,id',
            'schedules.work_date' => 'required|date',
            'schedules.start_time' => 'required|date_format:H:i',
            'schedules.end_time' => 'required|date_format:H:i',
            'deleted_ids' => 'nullable|array',
            'deleted_ids' => 'integer|exists:create_shifts,id',
        ]);

        // 登録処理（新しい確定シフト）
        $scheduleData = $request->input('schedules');

        $result = CreateShifts::updateOrCreate(
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

        $schedules = $request->input('schedules');

        return response()->json([
            'message' => 'シフトを保存しました',
            'schedule' => $result,
        ]);
    }





    // シフトを確定
    public function confirmApi(Request $request)
    {
        $requestMonth = $request->input('request_month');

        $startDate = Carbon::createFromFormat('Ym', $requestMonth)->startOfMonth();
        $endDate = Carbon::createFromFormat('Ym', $requestMonth)->endOfMonth();

        $confirmedShifts = CreateShifts::
            where('work_date', '>=', $startDate)
            ->where('work_date', '<=', $endDate)
            ->orderBy('work_date', 'asc')
            ->get();

        foreach ($confirmedShifts as $shift) {
            $shift->status = 'confirm';
            $shift->save();
        }
        return response()->json([
            'message' => 'シフトを確定しました',
            'confirmed_shifts' => $confirmedShifts,
        ]);

    }






}

