<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function index(Request $request)
    {
        $query = NewsletterSubscription::latest('subscribed_at');

        if ($request->filled('search')) {
            $query->where('email', 'like', "%{$request->search}%");
        }

        $subscribers = $query->paginate(20)->withQueryString();
        $totalSubscribers = NewsletterSubscription::where('is_subscribed', true)->count();

        return view('admin.inquiries.subscribers', compact('subscribers', 'totalSubscribers'));
    }

    public function destroy(NewsletterSubscription $subscriber)
    {
        $subscriber->delete();
        return back()->with('success', 'Subscriber removed.');
    }
}
