<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductionMilestone;
use App\Models\ProductionStage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderApiController extends Controller
{
    /**
     * Store a new production / commercial order from frontend checkout.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_number' => 'nullable|string|max:50',
            'first_name' => 'nullable|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'full_name' => 'nullable|string|max:200',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:100',
            'order_type' => 'nullable|string|max:50',
            'incoterm' => 'nullable|string|max:20',
            'payment_method' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'subtotal' => 'nullable|numeric|min:0',
            'shipping_cost' => 'nullable|numeric|min:0',
            'total_amount' => 'nullable|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.name' => 'nullable|string|max:255',
            'items.*.sku' => 'nullable|string|max:100',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'nullable|numeric|min:0',
            'items.*.sizeBreakdown' => 'nullable|array',
            'items.*.tech_pack_code' => 'nullable|string|max:100',
            'items.*.customDesignId' => 'nullable|string|max:100',
            'items.*.fabric' => 'nullable|string|max:255',
            'items.*.gsm' => 'nullable|integer',
            'items.*.isCustomized' => 'nullable|boolean',
        ]);

        return DB::transaction(function () use ($validated) {
            // 1. Resolve Customer name
            $firstName = $validated['first_name'] ?? '';
            $lastName = $validated['last_name'] ?? '';
            if (empty($firstName) && !empty($validated['full_name'])) {
                $parts = explode(' ', trim($validated['full_name']), 2);
                $firstName = $parts[0] ?? 'Client';
                $lastName = $parts[1] ?? '';
            }
            if (empty($firstName)) {
                $firstName = 'Valued';
                $lastName = 'Client';
            }

            // 2. Find or create Customer
            $customer = Customer::firstOrCreate(
                ['email' => $validated['email']],
                [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'phone' => $validated['phone'] ?? null,
                    'whatsapp' => $validated['phone'] ?? null,
                    'company_name' => $validated['company'] ?? null,
                    'status' => 'active',
                ]
            );

            // Update details if customer already existed but fields were empty
            if (!$customer->wasRecentlyCreated) {
                $customer->update(array_filter([
                    'first_name' => $customer->first_name ?: $firstName,
                    'last_name' => $customer->last_name ?: $lastName,
                    'phone' => $customer->phone ?: ($validated['phone'] ?? null),
                    'whatsapp' => $customer->whatsapp ?: ($validated['phone'] ?? null),
                    'company_name' => $customer->company_name ?: ($validated['company'] ?? null),
                ]));
            }

            // 3. Save Address if provided
            if (!empty($validated['street'])) {
                CustomerAddress::firstOrCreate(
                    [
                        'customer_id' => $customer->id,
                        'address_line_1' => $validated['street'],
                        'postal_code' => $validated['postal_code'] ?? null,
                    ],
                    [
                        'type' => 'shipping',
                        'city' => $validated['city'] ?? '',
                        'state' => $validated['state'] ?? '',
                        'country' => $validated['country'] ?? 'Pakistan',
                        'is_default' => true,
                    ]
                );
            }

            // 4. Resolve Order Number (Ensure TI- prefix)
            $orderNumber = $validated['order_number'] ?? null;
            if (!$orderNumber || str_starts_with($orderNumber, 'SF-')) {
                $orderNumber = 'TI-' . rand(100000, 999999);
            }
            // Ensure uniqueness in database
            while (Order::where('order_number', $orderNumber)->exists()) {
                $orderNumber = 'TI-' . rand(100000, 999999);
            }

            // 5. Initial Stage
            $initialStage = ProductionStage::orderBy('sort_order')->first();

            // 6. Calculate totals
            $itemsData = $validated['items'];
            $calculatedSubtotal = 0;
            $totalQuantity = 0;

            foreach ($itemsData as $item) {
                $qty = (int) ($item['quantity'] ?? 1);
                $price = (float) ($item['price'] ?? 0);
                $calculatedSubtotal += ($qty * $price);
                $totalQuantity += $qty;
            }

            $subtotal = $validated['subtotal'] ?? $calculatedSubtotal;
            $shippingCost = $validated['shipping_cost'] ?? 0;
            $totalAmount = $validated['total_amount'] ?? ($subtotal + $shippingCost);

            // 7. Create Order
            $order = Order::create([
                'order_number' => $orderNumber,
                'customer_id' => $customer->id,
                'current_stage_id' => $initialStage?->id,
                'order_type' => $validated['order_type'] ?? 'bulk_commercial',
                'status' => 'in_production',
                'total_quantity' => $totalQuantity,
                'subtotal' => $subtotal,
                'surcharges' => 0,
                'shipping_cost' => $shippingCost,
                'total_amount' => $totalAmount,
                'currency' => 'USD',
                'incoterms' => $validated['incoterm'] ?? 'DDP',
                'shipping_address_snapshot' => [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'company' => $validated['company'] ?? '',
                    'address_line_1' => $validated['street'] ?? '',
                    'city' => $validated['city'] ?? '',
                    'state' => $validated['state'] ?? '',
                    'postal_code' => $validated['postal_code'] ?? '',
                    'country' => $validated['country'] ?? '',
                    'phone' => $validated['phone'] ?? '',
                ],
                'tracking_number' => 'AWB-TI' . rand(10000000, 99999999),
                'notes' => $validated['notes'] ?? ('Direct web checkout. Payment: ' . ($validated['payment_method'] ?? 'credit_card')),
            ]);

            // 8. Create Order Items & Link Tech Packs & Designs
            foreach ($itemsData as $item) {
                $productName = $item['name'] ?? 'Custom Apparel Item';
                $sku = $item['sku'] ?? ('TI-' . strtoupper(Str::random(6)));
                $qty = (int) ($item['quantity'] ?? 1);
                $unitPrice = (float) ($item['price'] ?? 0);
                $sizeBreakdown = $item['sizeBreakdown'] ?? null;
                $isCustomized = !empty($item['isCustomized']) || str_contains($productName, 'Custom') || str_contains($productName, 'Spec');

                // Try to find matching Product
                $product = null;
                if (!empty($item['sku'])) {
                    $product = Product::where('sku', $item['sku'])->first();
                }
                if (!$product && !empty($item['name'])) {
                    $product = Product::where('name', $item['name'])->first();
                }

                // If customized item, find corresponding TechPack or CustomizerDesign
                $matchedTechPack = null;
                $matchedDesign = null;

                if (!empty($item['tech_pack_code'])) {
                    $matchedTechPack = \App\Models\TechPack::where('code', $item['tech_pack_code'])->first();
                }
                if (!$matchedTechPack && !empty($item['customDesignId'])) {
                    $matchedDesign = \App\Models\CustomizerDesign::where('design_code', $item['customDesignId'])->first();
                    if ($matchedDesign) {
                        $matchedTechPack = \App\Models\TechPack::where('customizer_design_id', $matchedDesign->id)->first();
                    }
                }

                // If still not matched and is customized item, find recent unlinked tech pack (last 3 hours)
                if (!$matchedTechPack && $isCustomized) {
                    $cleanName = trim(explode('(', $productName)[0]);
                    $matchedTechPack = \App\Models\TechPack::where(function ($q) use ($customer) {
                        $q->whereNull('customer_id')
                          ->orWhere('customer_id', $customer->id);
                    })
                    ->where('created_at', '>=', now()->subHours(3))
                    ->where(function ($q) use ($cleanName) {
                        $q->where('style_name', 'LIKE', "%{$cleanName}%")
                          ->orWhere('style_name', 'LIKE', '%Spec%')
                          ->orWhere('style_name', 'LIKE', '%Hoodie%');
                    })
                    ->latest()
                    ->first();
                }

                // Associate tech pack and customizer design with this customer and exact order quantity
                if ($matchedTechPack) {
                    $matchedTechPack->update([
                        'customer_id' => $customer->id,
                        'total_units' => $qty,
                        'size_breakdown' => $sizeBreakdown ?: $matchedTechPack->size_breakdown,
                    ]);

                    if ($matchedTechPack->customizerDesign) {
                        $matchedTechPack->customizerDesign->update([
                            'customer_id' => $customer->id,
                            'size_breakdown' => $sizeBreakdown ?: $matchedTechPack->customizerDesign->size_breakdown,
                        ]);
                        $matchedDesign = $matchedTechPack->customizerDesign;
                    }
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product?->id,
                    'tech_pack_id' => $matchedTechPack?->id,
                    'customizer_design_id' => $matchedDesign?->id,
                    'sku' => $sku,
                    'product_name' => $productName,
                    'unit_price' => $unitPrice,
                    'quantity' => $qty,
                    'size_breakdown' => $sizeBreakdown,
                    'total_price' => $unitPrice * $qty,
                ]);
            }

            // 9. Initialize Production Milestones
            $allStages = ProductionStage::orderBy('sort_order')->get();
            foreach ($allStages as $index => $stage) {
                $isFirst = ($index === 0);
                ProductionMilestone::create([
                    'order_id' => $order->id,
                    'stage_id' => $stage->id,
                    'title' => $isFirst ? "Commercial Spec Approved & CAD Pattern Graded" : $stage->name,
                    'description' => $isFirst 
                        ? "Tech pack approved and CAD grading queued on automated cutting tables." 
                        : "Scheduled production phase at Sialkot manufacturing floor.",
                    'is_completed' => $isFirst,
                    'completed_at' => $isFirst ? now() : null,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Commercial order confirmed and queued for manufacturing.',
                'data' => [
                    'order_number' => $order->order_number,
                    'id' => $order->id,
                    'total_amount' => (float) $order->total_amount,
                    'total_quantity' => $order->total_quantity,
                    'current_stage' => $initialStage?->name ?? 'CAD Pattern & Precision Cutting',
                    'status' => $order->status,
                    'created_at' => $order->created_at->toISOString(),
                ],
            ], 201);
        });
    }

    /**
     * Show single order details by order_number.
     */
    public function show(string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->with(['customer', 'currentStage', 'items.product.primaryImage', 'milestones.stage'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => "Order #{$orderNumber} not found.",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }
}
