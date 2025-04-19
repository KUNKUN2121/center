<?php

namespace App\Models;

use GuzzleHttp\Promise\Create;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Inertia\Inertia;

class CreateShifts extends Model
{
    //
    protected $fillable = [
        'user_id',
        'work_date',
        'start_time',
        'end_time',
    ];

}
