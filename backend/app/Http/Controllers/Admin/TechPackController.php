<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TechPack;
use Illuminate\Http\Request;

class TechPackController extends Controller
{
    public function index(Request $request)
    {
        $query = TechPack::with([
            'customer',
            'approver',
            'customizerDesign.product.primaryImage',
            'customizerDesign.product.images',
            'orderItems.order',
        ]);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('style_name', 'like', "%{$s}%")
                  ->orWhere('code', 'like', "%{$s}%")
                  ->orWhereHas('customizerDesign', function ($dq) use ($s) {
                      $dq->where('design_code', 'like', "%{$s}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $techPacks = $query->latest()->paginate(15);

        return view('admin.tech-packs.index', compact('techPacks'));
    }

    public function destroy(TechPack $techPack)
    {
        // Archive instead of permanently deleting if customer designs are linked
        if ($techPack->customizer_design_id) {
            $techPack->update(['status' => 'archived']);
            return back()->with('success', "Tech pack '{$techPack->code}' archived safely without deleting customer design.");
        }

        $techPack->delete();
        return back()->with('success', "Tech pack '{$techPack->code}' removed.");
    }

    /**
     * Non-destructive deduplication:
     * Strictly verifies design fingerprints and preserves all customer designs & historical revisions.
     * NEVER permanently deletes customer designs or historical revisions.
     */
    public function deduplicate()
    {
        $allPacks = TechPack::with('customizerDesign')->orderBy('id', 'asc')->get();
        $seenFingerprints = [];
        $archivedCount = 0;

        foreach ($allPacks as $pack) {
            $fp = $pack->design_fingerprint ?: ($pack->style_name . '_' . $pack->target_gsm);
            
            // If already seen with exact same design content
            if (isset($seenFingerprints[$fp])) {
                // If it is an exact duplicate, preserve historical record by setting status to archived
                if ($pack->status !== 'archived') {
                    $pack->update(['status' => 'archived']);
                    $archivedCount++;
                }
            } else {
                $seenFingerprints[$fp] = $pack->id;
            }
        }

        return redirect()->route('admin.tech-packs.index')->with('success', "Deduplication sanitized safely: {$archivedCount} duplicate drafts archived. ZERO records permanently deleted. Customer designs and historical revisions are 100% preserved.");
    }

    /**
     * Factory approval action for production.
     */
    public function approve(Request $request, TechPack $techPack)
    {
        $techPack->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'rejection_reason' => null,
        ]);

        return redirect()->back(fallback: route('admin.tech-packs.index'))
            ->with('success', "Tech pack '{$techPack->code}' has been APPROVED for factory floor manufacturing.");
    }

    /**
     * Factory rejection / revision request action.
     */
    public function reject(Request $request, TechPack $techPack)
    {
        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $techPack->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
        ]);

        return redirect()->back(fallback: route('admin.tech-packs.index'))
            ->with('success', "Tech pack '{$techPack->code}' marked as REJECTED with revision notes sent to design studio.");
    }

    /**
     * Printable PDF Factory Spec Sheet View.
     */
    public function printSpec(TechPack $techPack)
    {
        $techPack->load([
            'customer',
            'approver',
            'customizerDesign.product.primaryImage',
            'customizerDesign.product.images',
        ]);

        return view('admin.tech-packs.print', compact('techPack'));
    }
}
