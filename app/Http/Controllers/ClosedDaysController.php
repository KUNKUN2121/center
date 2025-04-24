<?php

namespace App\Http\Controllers;

use App\Models\ClosedDays;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ClosedDaysController extends Controller
{
    //
    public function index(Request $request)
    {
        $requestMonth = "202505";
        // requestMonthの休館日を取得

        // 月の最初の日と最後の日を計算
        $startDate = Carbon::createFromFormat('Ym', $requestMonth)->startOfMonth();
        $endDate = Carbon::createFromFormat('Ym', $requestMonth)->endOfMonth();
        // 休館日を取得
        $closedDays = ClosedDays::
            where('date', '>=', $startDate)
            ->where('date', '<=', $endDate)
            ->orderBy('date', 'asc')
            ->get();

        // json形式で返す
        return response()->json($closedDays);
    }

    public function store(Request $request)
    {
        // バリデーション
        $request->validate([
            'holidays' => 'array',
            'holidays.*.id' => 'nullable|integer',
            'holidays.*.date' => 'required|date:Y-m-d',
            'holidays.*.reason' => 'nullable|string|max:255',
        ]);

        $closedDays = $request->input('holidays');


        // idがある場合は更新、ない場合は新規作成
        foreach ($closedDays as $closedDay){
            if (empty($closedDay['id'])) {
                ClosedDays::updateOrCreate(
                    ['date' => $closedDay['date']],
                    [
                        'reason' => $closedDay['reason'],
                    ]
                );
            }else{
                // IDがあるため更新を行う
                ClosedDays::updateOrCreate(
                    ['id' => $closedDay['id']],
                    [
                        'date' => $closedDay['date'],
                        'reason' => $closedDay['reason'],
                    ]
                );
            }
        }

        return response()->json(['message' => '休館日が保存されました。']);
    }

    public function destroy($id)
    {
        // URLからIDを取得
        // $id = $request->input('id');
        // IDがある場合は削除
        if ($id) {
            $closedDay = ClosedDays::find($id);
            if ($closedDay) {
                $closedDay->delete();
                return response()->json(['message' => '休館日が削除されました。']);
            } else {
                return response()->json(['message' => '休館日が見つかりません。'], 404);
            }
        } else {
            return response()->json(['message' => 'IDが指定されていません。'], 400);
        }
    }
}
