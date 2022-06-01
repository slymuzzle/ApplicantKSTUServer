<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FbFeed;

class FbFeedController extends Controller
{
    public function index()
    {
        return FbFeed::cursorPaginate(15);
    }
}
