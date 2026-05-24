<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SuperAdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if user is authenticated and is a Super Admin
        // Sovereign Admin defined as 'princewill.iwuoha@gmail.com'
        $user = Auth::user();

        if (!$user || $user->role !== 'ADMIN' || $user->email !== 'princewill.iwuoha@gmail.com') {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Access Denied: Super Admin Authority Required'
                ], 403);
            }

            return redirect()->route('admin.login')->with('error', 'Super Admin privileges required.');
        }

        return $next($request);
    }
}
