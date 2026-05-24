<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CarePlanController extends Controller
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
     * Get list of care plans.
     */
    public function index()
    {
        $plans = DB::table('care_plans')->orderBy('id', 'asc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $plans
        ]);
    }

    /**
     * Create a care plan template.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan_title' => 'required|string|max:255',
            'target_audience' => 'required|string|max:255',
            'core_features' => 'required|array',
            'status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $id = DB::table('care_plans')->insertGetId([
            'plan_title' => $request->input('plan_title'),
            'target_audience' => $request->input('target_audience'),
            'core_features' => json_encode($request->input('core_features')),
            'status' => $request->input('status', true),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Care Plan architecture created successfully.',
            'plan_id' => $id
        ]);
    }

    /**
     * Update care plan template.
     */
    public function update(Request $request, $id)
    {
        $plan = DB::table('care_plans')->where('id', $id)->first();
        if (!$plan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Care Plan tier architecture not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'plan_title' => 'required|string|max:255',
            'target_audience' => 'required|string|max:255',
            'core_features' => 'required|array',
            'status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::table('care_plans')->where('id', $id)->update([
            'plan_title' => $request->input('plan_title'),
            'target_audience' => $request->input('target_audience'),
            'core_features' => json_encode($request->input('core_features')),
            'status' => $request->input('status', true),
            'updated_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Care Plan tier architecture updated successfully.'
        ]);
    }

    /**
     * Delete care plan template.
     */
    public function destroy($id)
    {
        $plan = DB::table('care_plans')->where('id', $id)->first();
        if (!$plan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Care Plan tier architecture not found.'
            ], 404);
        }

        DB::table('care_plans')->where('id', $id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Care Plan track permanently de-registered.'
        ]);
    }
}
