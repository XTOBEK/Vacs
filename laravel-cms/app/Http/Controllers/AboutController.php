<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AboutController extends Controller
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
     * Display the About page dynamic settings.
     */
    public function index()
    {
        $settings = DB::table('site_settings')->first() ?? (object) [];
        return response()->json([
            'status' => 'success',
            'data' => [
                'hero_title' => $settings->about_hero_title ?? 'Pioneering Accountable Clinical Care.',
                'hero_subtitle' => $settings->about_hero_subtitle ?? 'The VACS Protocol',
                'mission_statement' => $settings->about_mission_statement ?? 'To provide every client with the security of clinical oversight.',
                'vision_statement' => $settings->about_vision_statement ?? 'Clinical Integrity: Every care log is audited by an RN.',
                'core_values' => json_decode($settings->about_core_values ?? '[]'),
                'banner_image_path' => $settings->about_banner_image_path ?? ''
            ]
        ]);
    }

    /**
     * Update the About page settings, supporting banner image upload.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'hero_title' => 'required|string|max:255',
            'hero_subtitle' => 'nullable|string|max:255',
            'mission_statement' => 'required|string',
            'vision_statement' => 'required|string',
            'core_values' => 'nullable|array',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // 2MB limit
            'banner_image_path' => 'nullable|string', // Fallback direct link
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = [
            'about_hero_title' => $request->input('hero_title'),
            'about_hero_subtitle' => $request->input('hero_subtitle'),
            'about_mission_statement' => $request->input('mission_statement'),
            'about_vision_statement' => $request->input('vision_statement'),
            'about_core_values' => json_encode($request->input('core_values', [])),
            'updated_at' => now(),
        ];

        // Safely upload and store about banner screen graphic
        if ($request->hasFile('banner_image')) {
            // Delete previous image if exists
            $current = DB::table('site_settings')->first();
            if ($current && $current->about_banner_image_path) {
                Storage::disk('public')->delete($current->about_banner_image_path);
            }
            
            $file = $request->file('banner_image');
            $path = $file->store('cms/about', 'public');
            $data['about_banner_image_path'] = asset('storage/' . $path);
        } elseif ($request->filled('banner_image_path')) {
            $data['about_banner_image_path'] = $request->input('banner_image_path');
        }

        // Check if settings row exists
        $exists = DB::table('site_settings')->exists();
        if ($exists) {
            DB::table('site_settings')->update($data);
        } else {
            $data['created_at'] = now();
            DB::table('site_settings')->insert($data);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'About Us settings dynamically updated successfully.'
        ]);
    }
}
