<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ProductionMilestone;
use App\Models\ProductionStage;
use Illuminate\Http\Request;

class OrderKanbanController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['customer', 'currentStage', 'items']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where('order_number', 'like', "%{$s}%");
        }

        $orders = $query->latest()->paginate(15);

        return view('admin.orders.index', compact('orders'));
    }

    public function kanban()
    {
        $stages = ProductionStage::with(['orders' => fn($q) => $q->with('customer')->where('status', '!=', 'cancelled')])
            ->orderBy('sort_order')
            ->get();

        return view('admin.orders.kanban', compact('stages'));
    }

    public function show(Order $order)
    {
        $order->load(['customer', 'currentStage', 'items.product.primaryImage', 'milestones.stage']);
        $stages = ProductionStage::orderBy('sort_order')->get();

        return view('admin.orders.show', compact('order', 'stages'));
    }

    public function updateStage(Request $request, Order $order)
    {
        $request->validate([
            'stage_id' => ['required', 'exists:production_stages,id'],
        ]);

        $stage = ProductionStage::findOrFail($request->stage_id);

        $order->update([
            'current_stage_id' => $stage->id,
            'status' => $stage->slug === 'dispatched' ? 'completed' : 'in_production',
        ]);

        // Update or create milestone record
        $milestone = ProductionMilestone::firstOrNew([
            'order_id' => $order->id,
            'stage_id' => $stage->id,
        ]);
        $milestone->title = "Advanced to {$stage->name}";
        $milestone->description = "Order allocated to {$stage->name} on factory floor.";
        $milestone->is_completed = true;
        $milestone->completed_at = now();
        $milestone->save();

        // Mark all prior stages as completed
        $priorStageIds = ProductionStage::where('sort_order', '<', $stage->sort_order)->pluck('id');
        ProductionMilestone::where('order_id', $order->id)
            ->whereIn('stage_id', $priorStageIds)
            ->update([
                'is_completed' => true,
            ]);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'stage' => $stage->name]);
        }

        return back()->with('success', "Order stage updated to {$stage->name}.");
    }
}
