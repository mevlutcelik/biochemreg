<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

// Guest routes
Route::middleware('guest')->group(function () {
    // Authentication
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
    });
});

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    //

    Route::get('/profile', [UserController::class, 'index']);

    Route::prefix('auth')->group(function () {
        Route::get('/verify-token', [AuthController::class, 'verifyToken']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});