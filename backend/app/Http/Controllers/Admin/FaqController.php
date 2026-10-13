<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        $query = Faq::orderBy('sort_order')->latest();

        if ($request->filled('topic')) {
            $query->where('topic', $request->topic);
        }

        $faqs = $query->paginate(20)->withQueryString();
        $topics = Faq::select('topic')->distinct()->pluck('topic');

        return view('admin.faqs.index', compact('faqs', 'topics'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'topic' => 'required|string|max:50',
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'sort_order' => 'nullable|integer',
        ]);

        Faq::create([
            'topic' => $validated['topic'],
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => true,
        ]);

        return back()->with('success', 'FAQ item created.');
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();
        return back()->with('success', 'FAQ item deleted.');
    }
}
