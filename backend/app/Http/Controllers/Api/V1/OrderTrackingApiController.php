<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;

class OrderTrackingApiController extends Controller
{
    public function track(string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->with(['currentStage', 'milestones.stage', 'items.product.primaryImage', 'customer'])
            ->first();

        if (!$order) {
            $rfq = \App\Models\Rfq::where('rfq_number', $orderNumber)->first();
            if ($rfq) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'order_number' => $rfq->rfq_number,
                        'status' => $rfq->status === 'new' ? 'received' : $rfq->status,
                        'current_stage' => 'Received',
                        'current_stage_badge' => '#D61C24',
                        'current_stage_index' => 0,
                        'total_quantity' => $rfq->quantity ?? 100,
                        'subtotal' => (float) ($rfq->target_price ?? 0),
                        'shipping_cost' => 0,
                        'total_amount' => (float) ($rfq->target_price ?? 0),
                        'incoterms' => $rfq->incoterm ?? 'FOB',
                        'tracking_number' => 'INQ-' . $rfq->id,
                        'created_at' => $rfq->created_at->toISOString(),
                        'customer' => [
                            'name' => $rfq->full_name,
                            'company' => $rfq->company ?? '',
                            'email' => $rfq->email,
                            'phone' => $rfq->phone ?? '',
                            'shipping_address' => ['country' => $rfq->country ?? 'Global'],
                        ],
                        'items' => is_array($rfq->items) ? array_map(fn($it) => [
                            'name' => $it['name'] ?? 'Custom Apparel Inquiry',
                            'sku' => $it['sku'] ?? 'INQ-ITEM',
                            'quantity' => (int) ($it['quantity'] ?? 1),
                            'unit_price' => (float) ($it['price'] ?? 0),
                            'total_price' => (float) (($it['price'] ?? 0) * ($it['quantity'] ?? 1)),
                        ], $rfq->items) : [],
                        'milestones' => [
                            ['id' => '1', 'stage' => 'Received', 'title' => 'Inquiry Received', 'description' => 'Commercial specification received.', 'is_completed' => true],
                            ['id' => '2', 'stage' => 'In Review', 'title' => 'Engineering Review', 'description' => 'Tech pack in review.', 'is_completed' => false],
                            ['id' => '3', 'stage' => 'In Production', 'title' => 'Sampling / Production', 'description' => 'Floor allocation.', 'is_completed' => false],
                            ['id' => '4', 'stage' => 'Dispatched', 'title' => 'Dispatch', 'description' => 'Order completed & dispatched.', 'is_completed' => false],
                        ],
                    ],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => "Order #{$orderNumber} not found.",
            ], 404);
        }

        $completedMilestonesCount = $order->milestones->where('is_completed', true)->count();
        $totalMilestones = max($order->milestones->count(), 1);

        return response()->json([
            'success' => true,
            'data' => [
                'order_number' => $order->order_number,
                'status' => $order->status,
                'current_stage' => $order->currentStage?->name ?? 'Pending Review',
                'current_stage_badge' => $order->currentStage?->color_badge ?? '#D61C24',
                'current_stage_index' => max(0, $completedMilestonesCount - 1),
                'total_quantity' => $order->total_quantity,
                'subtotal' => (float) $order->subtotal,
                'shipping_cost' => (float) $order->shipping_cost,
                'total_amount' => (float) $order->total_amount,
                'incoterms' => $order->incoterms ?? 'DDP',
                'tracking_number' => $order->tracking_number,
                'created_at' => $order->created_at->toISOString(),
                'customer' => [
                    'name' => $order->customer?->full_name ?? 'Client',
                    'company' => $order->customer?->company_name ?? '',
                    'email' => $order->customer?->email ?? '',
                    'phone' => $order->customer?->phone ?? '',
                    'shipping_address' => $order->shipping_address_snapshot,
                ],
                'items' => $order->items->map(fn($item) => [
                    'name' => $item->product_name,
                    'sku' => $item->sku,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'total_price' => (float) $item->total_price,
                    'size_breakdown' => $item->size_breakdown,
                ]),
                'milestones' => $order->milestones->map(fn($m, $idx) => [
                    'id' => (string) ($m->id ?? $idx + 1),
                    'stage' => $m->stage?->name ?? 'Stage',
                    'title' => $m->title,
                    'description' => $m->description,
                    'is_completed' => (bool) $m->is_completed,
                    'completed_at' => $m->completed_at?->toISOString(),
                ]),
            ],
        ]);
    }
}
