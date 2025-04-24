<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClosedDays extends Model
{
    //
    protected $table = 'closed_days';
    protected $fillable = [
        'date',
        'reason',
    ];
}
