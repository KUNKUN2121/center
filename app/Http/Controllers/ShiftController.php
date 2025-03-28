<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ShiftController extends Controller
{
    //
    public function index()
    {
        return Inertia::render('Shift/Index');
    }

    public function create()
    {
        return Inertia::render('Shift/Create');
    }
}
