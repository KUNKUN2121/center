<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestShifts extends Model
{
    protected $fillable = [
        'user_id',
        'work_date',
        'start_time',
        'end_time',
        'status',
    ];

    protected $casts = [
        'schedules' => 'array',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
