<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Testimonial::where('is_active', true)->orderBy('sort_order');

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $testimonials = $query->get();

        return response()->json([
            'success' => true,
            'data' => $testimonials,
        ]);
    }
}
