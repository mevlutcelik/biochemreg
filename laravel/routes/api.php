<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SliderController;
use App\Http\Controllers\Api\LabMemberController;

// Public routes
Route::get('/sliders', [SliderController::class, 'index']);
Route::get('/lab-members', [LabMemberController::class, 'publicIndex']);
Route::get('/lab-members/director', [LabMemberController::class, 'publicDirector']);
Route::get('/lab-members/{id}', [LabMemberController::class, 'publicShow']);

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
    Route::get('/profile', [UserController::class, 'index']);

    Route::prefix('auth')->group(function () {
        Route::get('/verify-token', [AuthController::class, 'verifyToken']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Admin routes
    Route::prefix('admin')->group(function () {
        // Slider routes
        Route::get('/sliders', [SliderController::class, 'adminIndex']);
        Route::post('/sliders', [SliderController::class, 'store']);
        Route::get('/sliders/{id}', [SliderController::class, 'show']);
        Route::match(['post', 'put'], '/sliders/{id}', [SliderController::class, 'update']);
        Route::delete('/sliders/{id}', [SliderController::class, 'destroy']);
        Route::match(['post', 'patch'], '/sliders/{id}/toggle-status', [SliderController::class, 'toggleStatus']);
        Route::post('/sliders/reorder', [SliderController::class, 'reorder']);

        // Lab Member routes
        Route::get('/lab-members', [LabMemberController::class, 'adminIndex']);
        Route::post('/lab-members', [LabMemberController::class, 'store']);
        Route::get('/lab-members/{id}', [LabMemberController::class, 'show']);
        Route::match(['post', 'put'], '/lab-members/{id}', [LabMemberController::class, 'update']);
        Route::delete('/lab-members/{id}', [LabMemberController::class, 'destroy']);
        Route::match(['post', 'patch'], '/lab-members/{id}/toggle-status', [LabMemberController::class, 'toggleStatus']);
        Route::match(['post', 'patch'], '/lab-members/{id}/toggle-director', [LabMemberController::class, 'toggleDirector']);
        Route::post('/lab-members/reorder', [LabMemberController::class, 'reorder']);
    });
});