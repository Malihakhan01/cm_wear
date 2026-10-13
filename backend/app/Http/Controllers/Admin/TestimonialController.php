<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::orderBy('sort_order')->latest()->paginate(15);
        return view('admin.testimonials.index', compact('testimonials'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_role' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:100',
            'country_flag' => 'nullable|string|max:10',
            'avatar' => 'nullable|string|max:500',
            'quote' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'sort_order' => 'nullable|integer',
            'is_featured' => 'nullable|boolean',
        ]);

        Testimonial::create([
            'client_name' => $validated['client_name'],
            'client_role' => $validated['client_role'] ?? null,
            'company' => $validated['company'] ?? null,
            'country' => $validated['country'] ?? null,
            'country_flag' => $validated['country_flag'] ?? null,
            'avatar' => $validated['avatar'] ?? null,
            'quote' => $validated['quote'],
            'rating' => $validated['rating'],
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_featured' => $request->boolean('is_featured'),
            'is_active' => true,
        ]);

        return back()->with('success', 'Testimonial added successfully.');
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return back()->with('success', 'Testimonial removed.');
    }
}
