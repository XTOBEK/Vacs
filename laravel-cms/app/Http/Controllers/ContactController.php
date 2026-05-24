<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Create a new controller instance.
     * Enforces the SuperAdmin RBAC middleware.
     */
    public function __construct()
    {
        $this->middleware('superadmin');
    }

    /**
     * Get contact settings.
     */
    public function index()
    {
        $settings = DB::table('site_settings')->first() ?? (object) [];
        return response()->json([
            'status' => 'success',
            'data' => [
                'primary_phone' => $settings->contact_primary_phone ?? '+234 803 123 4567',
                'emergency_phone' => $settings->contact_emergency_phone ?? '+234 900 VACS EMERGENCY',
                'general_email' => $settings->contact_general_email ?? 'admissions@vacs-registry.io',
                'physical_address' => $settings->contact_physical_address ?? 'Lekki Phase 1, Lagos, Nigeria',
                'Maps_embed_url' => $settings->contact_maps_embed_url ?? '',
                'social_media_links' => json_decode($settings->contact_social_media_links ?? '[]')
            ]
        ]);
    }

    /**
     * Update contact settings.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'primary_phone' => 'required|string|max:255',
            'emergency_phone' => 'required|string|max:255',
            'general_email' => 'required|email|max:255',
            'physical_address' => 'required|string',
            'Maps_embed_url' => 'nullable|string',
            'social_media_links' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = [
            'contact_primary_phone' => $request->input('primary_phone'),
            'contact_emergency_phone' => $request->input('emergency_phone'),
            'contact_general_email' => $request->input('general_email'),
            'contact_physical_address' => $request->input('physical_address'),
            'contact_maps_embed_url' => $request->input('Maps_embed_url'),
            'contact_social_media_links' => json_encode($request->input('social_media_links', [])),
            'updated_at' => now(),
        ];

        $exists = DB::table('site_settings')->exists();
        if ($exists) {
            DB::table('site_settings')->update($data);
        } else {
            $data['created_at'] = now();
            DB::table('site_settings')->insert($data);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Contact details updated successfully.'
        ]);
    }
}
