<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function assets()
    {
        return response()->json(['message' => 'Assets OK']);
    }

    public function statistics()
    {
        return response()->json(['message' => 'Statistics OK']);
    }
}
