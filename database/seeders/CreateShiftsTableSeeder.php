<?php

namespace Database\Seeders;

use App\Models\CreateShifts;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CreateShiftsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CreateShifts::create([
            'user_id' => 1,
            'work_date' => '2025-05-01',
            'start_time' => '09:00',
            'end_time' => '17:00',
            'status' => 'draft',
        ]);
    }
}
