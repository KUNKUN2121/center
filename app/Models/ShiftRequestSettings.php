<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShiftRequestSettings extends Model
{
    //
    protected $fillable = [
        'year',
        'month',
        'start_date',
        'end_date',
        'note',
    ];
}
