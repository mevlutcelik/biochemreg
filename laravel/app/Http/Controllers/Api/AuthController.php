<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Başarılı bir şekilde kayıt olundu.',
            'token' => $token,
        ]);
    }

    public function login(Request $request)
    {
        if (!auth()->attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => false,
                'message' => 'E-posta veya şifre hatalı.'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Başarılı bir şekilde giriş yapıldı.',
            'token' => $token,
        ]);
    }

    public function logout()
    {
        $user = Auth::guard('sanctum')->user();

        if ($user) {
            // Kullanıcının mevcut tokenini sil
            $user->currentAccessToken()->delete();

            return response()->json([
                'status' => true,
                'message' => 'Başarılı bir şekilde çıkış yapıldı.'
            ]);
        }

        // Kullanıcı yoksa hata mesajı döndür
        return response()->json([
            'status' => false,
            'message' => 'Kullanıcı bulunamadı veya oturum açılmamış.'
        ], 401);
    }

    public function verifyToken(Request $request)
    {
        $token = $request->bearerToken(); // Bearer token'ı al

        if (!$token) {
            return response()->json(['status' => false]);
        }

        //gelen tokenin geçerliliğini kontrol et
        if (!Auth::user()->tokens->contains('id', $request->user()->currentAccessToken()->id)) {
            return response()->json(['status' => false]);
        }

        return response()->json(['status' => true]);
    }
}
