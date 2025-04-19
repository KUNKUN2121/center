<?php

namespace Database\Seeders;

use App\Models\RequestShifts;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RequestShiftsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        RequestShifts::create([
            'user_id' => 1,
            'work_date' => '2025-05-01',
            'start_time' => '09:00',
            'end_time' => '17:00',
            'status' => 'draft',
        ]);
        RequestShifts::create([
            'user_id' => 1,
            'work_date' => '2025-05-02',
            'start_time' => '16:30',
            'end_time' => '21:00',
            'status' => 'draft',
        ]);
        RequestShifts::create([
            'user_id' => 2,
            'work_date' => '2025-05-03',
            'start_time' => '09:00',
            'end_time' => '17:00',
            'status' => 'draft',
        ]);
    }
}
