<?php

namespace App\Http\Controllers;

use App\Models\ClosedDays;
use App\Models\CreateShifts;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserViewShiftController extends Controller
{
    public function index(){
        return Inertia::render('Shift/User/UserViewShift');
    }

    public function getApi(Request $request){
        // $requestMonth = "2025-05";
        $requestMonth = $request->input('month');
        // 確定シフトを取得
        $startDate = $requestMonth . '-01';
        $endDate = $requestMonth . '-31';
        $confirmedShifts = CreateShifts::
            where('work_date', '>=', $startDate)
            ->where('work_date', '<=', $endDate)
            ->orderBy('work_date', 'asc')
            ->latest('version')
            ->get();

        // すべてのユーザを取得
        $users = DB::table('users')
            ->select('id', 'name')
            ->get();

        // 休みの日を取得
        $closedDays = ClosedDays::
            where('date', '>=', $startDate)
            ->where('date', '<=', $endDate)
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'confirmedShifts' => $confirmedShifts,
            'users' => $users,
            'closedDays' => $closedDays,
        ]);
    }
}
