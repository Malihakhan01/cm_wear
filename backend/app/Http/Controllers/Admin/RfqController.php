<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rfq;
use App\Models\RfqNote;
use App\Models\User;
use Illuminate\Http\Request;

class RfqController extends Controller
{
    public function index(Request $request)
    {
        $query = Rfq::with(['customer', 'product', 'assignedUser'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('inquiry_type', $request->type);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('rfq_number', 'like', "%{$s}%")
                  ->orWhere('full_name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%")
                  ->orWhere('company', 'like', "%{$s}%");
            });
        }

        $rfqs = $query->paginate(15)->withQueryString();

        $counts = [
            'total' => Rfq::count(),
            'new' => Rfq::where('status', 'new')->count(),
            'in_review' => Rfq::where('status', 'in_review')->count(),
            'quoted' => Rfq::where('status', 'quoted')->count(),
            'won' => Rfq::where('status', 'won')->count(),
        ];

        return view('admin.inquiries.index', compact('rfqs', 'counts'));
    }

    public function show(Rfq $rfq)
    {
        $rfq->load(['customer', 'product', 'assignedUser', 'notes.user']);
        $users = User::all();

        return view('admin.inquiries.show', compact('rfq', 'users'));
    }

    public function updateStatus(Request $request, Rfq $rfq)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:new,in_review,quoted,negotiating,won,lost,archived',
            'assigned_user_id' => 'nullable|exists:users,id',
            'quote_unit_price' => 'nullable|numeric',
            'quote_lead_days' => 'nullable|integer',
            'quote_shipping' => 'nullable|numeric',
            'quote_notes' => 'nullable|string',
        ]);

        $quote = $rfq->quote ?? [];
        if ($request->filled('quote_unit_price')) {
            $quote['unit_price'] = $validated['quote_unit_price'];
            $quote['lead_days'] = $validated['quote_lead_days'] ?? 25;
            $quote['shipping'] = $validated['quote_shipping'] ?? 0;
            $quote['notes'] = $validated['quote_notes'] ?? '';
            $quote['updated_at'] = now()->toDateTimeString();
        }

        $rfq->update([
            'status' => $validated['status'],
            'assigned_user_id' => $validated['assigned_user_id'] ?? $rfq->assigned_user_id,
            'quote' => $quote,
        ]);

        return back()->with('success', "Inquiry {$rfq->rfq_number} updated successfully.");
    }

    public function addNote(Request $request, Rfq $rfq)
    {
        $validated = $request->validate([
            'note' => 'required|string',
        ]);

        RfqNote::create([
            'rfq_id' => $rfq->id,
            'user_id' => auth()->id(),
            'note' => $validated['note'],
            'is_internal' => true,
        ]);

        return back()->with('success', 'Internal note added to inquiry timeline.');
    }
}
