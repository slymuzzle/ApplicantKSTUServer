<?php

namespace App\Http\Controllers;

use App\Models\ApplicantInfoTree;
use Illuminate\Http\Request;

class ApplicantInfoTreeController extends Controller
{
    public function index()
    {
        return ApplicantInfoTree::defaultOrder()->get()->makeVisible('content')->toTree();
    }
}
