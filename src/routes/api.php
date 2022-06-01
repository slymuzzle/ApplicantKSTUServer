<?php

use App\Http\Controllers\ApplicantInfoTreeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FbFeedController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'fb_feed'], function () {
    Route::get('/', [FbFeedController::class, 'index']);
});

Route::group(['prefix' => 'applicant_info_tree'], function () {
    Route::get('/', [ApplicantInfoTreeController::class, 'index']);
});
