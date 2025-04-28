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
        User::create([
            'id' => 3,
            'name' => "田中希実",
            'email' => "3@test.com",
            'password' => Hash::make('password123')
        ]);
        User::create([
            'id' => 4,
            'name' => "後藤輝樹",
            'email' => "4@test.com",
            'password' => Hash::make('password123')
        ]);
        User::create([
            'id' => 5,
            'name' => "佐藤健",
            'email' => "5@test.com",
            'password' => Hash::make('password123')
        ]);


    }
}
