<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ServicesController extends Controller
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
     * Get list of all services.
     */
    public function index()
    {
        $services = DB::table('services')->orderBy('id', 'asc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $services
        ]);
    }

    /**
     * Create a new service.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'service_name' => 'required|string|max:255',
            'short_description' => 'required|string|max:500',
            'detailed_description' => 'required|string',
            'icon_or_image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'icon_or_image_path' => 'nullable|string', // Font icon name or link
            'status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $imagePath = $request->input('icon_or_image_path', 'Users'); // default matching lucide icons

        if ($request->hasFile('icon_or_image_file')) {
            $file = $request->file('icon_or_image_file');
            $path = $file->store('cms/services', 'public');
            $imagePath = asset('storage/' . $path);
        }

        $id = DB::table('services')->insertGetId([
            'service_name' => $request->input('service_name'),
            'short_description' => $request->input('short_description'),
            'detailed_description' => $request->input('detailed_description'),
            'icon_or_image_path' => $imagePath,
            'status' => $request->input('status', true),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Service track created successfully.',
            'service_id' => $id
        ], 210);
    }

    /**
     * Update an existing service, supporting image replacement.
     */
    public function update(Request $request, $id)
    {
        $service = DB::table('services')->where('id', $id)->first();
        if (!$service) {
            return response()->json([
                'status' => 'error',
                'message' => 'Service not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'service_name' => 'required|string|max:255',
            'short_description' => 'required|string|max:500',
            'detailed_description' => 'required|string',
            'icon_or_image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'icon_or_image_path' => 'nullable|string',
            'status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = [
            'service_name' => $request->input('service_name'),
            'short_description' => $request->input('short_description'),
            'detailed_description' => $request->input('detailed_description'),
            'status' => $request->input('status', true),
            'updated_at' => now(),
        ];

        if ($request->hasFile('icon_or_image_file')) {
            // Delete old file if dynamic path
            if (strpos($service->icon_or_image_path, 'storage/cms/services') !== false) {
                $oldPath = str_replace(asset('storage/'), '', $service->icon_or_image_path);
                Storage::disk('public')->delete($oldPath);
            }

            $file = $request->file('icon_or_image_file');
            $path = $file->store('cms/services', 'public');
            $data['icon_or_image_path'] = asset('storage/' . $path);
        } elseif ($request->filled('icon_or_image_path')) {
            $data['icon_or_image_path'] = $request->input('icon_or_image_path');
        }

        DB::table('services')->where('id', $id)->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Service track updated successfully.'
        ]);
    }

    /**
     * Delete a service.
     */
    public function destroy($id)
    {
        $service = DB::table('services')->where('id', $id)->first();
        if (!$service) {
            return response()->json([
                'status' => 'error',
                'message' => 'Service not found.'
            ], 404);
        }

        // Delete associated image asset safely
        if (strpos($service->icon_or_image_path, 'storage/cms/services') !== false) {
            $oldPath = str_replace(asset('storage/'), '', $service->icon_or_image_path);
            Storage::disk('public')->delete($oldPath);
        }

        DB::table('services')->where('id', $id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Service track permanently de-registered.'
        ]);
    }
}
