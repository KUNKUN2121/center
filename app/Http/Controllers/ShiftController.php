<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ShiftController extends Controller
{
    //


    public function create()
    {
        return Inertia::render('Shift/Request');
    }
}
