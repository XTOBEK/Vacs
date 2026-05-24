<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ClinicalFAQController extends Controller
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
     * Get list of clinical FAQs.
     */
    public function index()
    {
        $faqs = DB::table('clinical_faqs')->orderBy('sort_order', 'asc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $faqs
        ]);
    }

    /**
     * Store new clinical FAQ.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'category' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $id = DB::table('clinical_faqs')->insertGetId([
            'question' => $request->input('question'),
            'answer' => $request->input('answer'),
            'category' => $request->input('category', 'General'),
            'sort_order' => $request->input('sort_order', 0),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Clinical FAQ created successfully.',
            'faq_id' => $id
        ]);
    }

    /**
     * Update clinical FAQ.
     */
    public function update(Request $request, $id)
    {
        $faq = DB::table('clinical_faqs')->where('id', $id)->first();
        if (!$faq) {
            return response()->json([
                'status' => 'error',
                'message' => 'Clinical FAQ entry not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'category' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::table('clinical_faqs')->where('id', $id)->update([
            'question' => $request->input('question'),
            'answer' => $request->input('answer'),
            'category' => $request->input('category', 'General'),
            'sort_order' => $request->input('sort_order', 0),
            'updated_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Clinical FAQ updated successfully.'
        ]);
    }

    /**
     * Delete clinical FAQ.
     */
    public function destroy($id)
    {
        $faq = DB::table('clinical_faqs')->where('id', $id)->first();
        if (!$faq) {
            return response()->json([
                'status' => 'error',
                'message' => 'Clinical FAQ entry not found.'
            ], 404);
        }

        DB::table('clinical_faqs')->where('id', $id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Clinical FAQ deleted successfully.'
        ]);
    }
}
