<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'id' => 1,
            'name' => "田中太郎",
            'email' => "1@test.com",
            'password' => Hash::make('password123')
        ]);
        User::create([
            'id' => 2,
            'name' => "山田花子",
            'email' => "2@test.com",
            'password' => Hash::make('password123')
        ]);

    }
}
