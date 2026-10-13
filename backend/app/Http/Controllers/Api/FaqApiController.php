<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Faq::where('is_active', true)->orderBy('sort_order');

        if ($request->filled('topic')) {
            $query->where('topic', $request->topic);
        }

        $faqs = $query->get();

        return response()->json([
            'success' => true,
            'data' => $faqs,
        ]);
    }
}
