<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FbFeed;

class FbFeedController extends Controller
{
    public function index()
    {
        return FbFeed::orderByDesc('post_created_time')->cursorPaginate(15);
    }
}
