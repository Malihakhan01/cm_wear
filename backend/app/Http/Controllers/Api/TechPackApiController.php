<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomizerDesign;
use App\Models\Product;
use App\Models\TechPack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TechPackApiController extends Controller
{
    /**
     * Store or update a factory tech pack generated from Customizer or Studio.
     * Prevents duplicate tech packs by updating existing records when matching code or recent duplicate exists.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'style_name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'tech_pack_code' => 'nullable|string|max:50',
            'season' => 'nullable|string|max:50',
            'fabric_spec' => 'nullable|string|max:500',
            'target_gsm' => 'nullable|integer',
            'stitching_notes' => 'nullable|string',
            'pom_measurements' => 'nullable|array',
            'bill_of_materials' => 'nullable|array',
            'pdf_path' => 'nullable|string|max:500',
            'design_code' => 'nullable|string',
            'customer_id' => 'nullable|exists:customers,id',
            'customer_email' => 'nullable|email|max:255',
            'customer_name' => 'nullable|string|max:255',
            'customer_company' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'product_id' => 'nullable|exists:products,id',
            'parts_colors' => 'nullable|array',
            'artwork_layers' => 'nullable|array',
            'monogram_state' => 'nullable',
            'preview_front' => 'nullable|string',
            'preview_back' => 'nullable|string',
            'decoration_method' => 'nullable|string|max:100',
            'wash_type' => 'nullable|string|max:100',
            'size_breakdown' => 'nullable|array',
            'total_units' => 'nullable|integer',
            'trims_config' => 'nullable|array',
        ]);

        $code = $validated['tech_pack_code'] ?? ($validated['code'] ?? null);

        // Process base64 data URLs in artwork and previews to permanent storage files
        $artworkLayers = $validated['artwork_layers'] ?? [];
        $previewFront = $validated['preview_front'] ?? null;
        $previewBack = $validated['preview_back'] ?? null;
        $this->processBase64Assets($artworkLayers, $previewFront, $previewBack);

        // Resolve or create Customer if email or customer_id is provided
        $customerId = $validated['customer_id'] ?? null;
        if (!$customerId && !empty($validated['customer_email'])) {
            $cName = trim($validated['customer_name'] ?? '');
            $parts = explode(' ', $cName, 2);
            $fName = $parts[0] ?: 'Client';
            $lName = $parts[1] ?? '';

            $customer = \App\Models\Customer::firstOrCreate(
                ['email' => $validated['customer_email']],
                [
                    'first_name' => $fName,
                    'last_name' => $lName,
                    'company_name' => $validated['customer_company'] ?? null,
                    'phone' => $validated['customer_phone'] ?? null,
                    'whatsapp' => $validated['customer_phone'] ?? null,
                    'status' => 'active',
                ]
            );
            if (!$customer->wasRecentlyCreated) {
                $customer->update(array_filter([
                    'first_name' => $customer->first_name ?: $fName,
                    'last_name' => $customer->last_name ?: $lName,
                    'company_name' => $customer->company_name ?: ($validated['customer_company'] ?? null),
                    'phone' => $customer->phone ?: ($validated['customer_phone'] ?? null),
                    'whatsapp' => $customer->whatsapp ?: ($validated['customer_phone'] ?? null),
                ]));
            }
            $customerId = $customer->id;
        }

        $customizerDesignId = null;

        // If design_code is provided, link to existing CustomizerDesign
        if (!empty($validated['design_code'])) {
            $existingDesign = CustomizerDesign::where('design_code', $validated['design_code'])->first();
            if ($existingDesign) {
                $customizerDesignId = $existingDesign->id;
                // Update the design with latest visual/parts data
                $existingDesign->update([
                    'customer_id' => $customerId ?: $existingDesign->customer_id,
                    'parts_colors' => $validated['parts_colors'] ?? $existingDesign->parts_colors,
                    'artwork_layers' => $artworkLayers ?: $existingDesign->artwork_layers,
                    'monogram_state' => $validated['monogram_state'] ?? $existingDesign->monogram_state,
                    'preview_front' => $previewFront ?: $existingDesign->preview_front,
                    'preview_back' => $previewBack ?: $existingDesign->preview_back,
                    'decoration_method' => $validated['decoration_method'] ?? $existingDesign->decoration_method,
                    'wash_type' => $validated['wash_type'] ?? $existingDesign->wash_type,
                    'fabric_spec' => $validated['fabric_spec'] ?? $existingDesign->fabric_spec,
                    'target_gsm' => $validated['target_gsm'] ?? $existingDesign->target_gsm,
                    'size_breakdown' => $validated['size_breakdown'] ?? $existingDesign->size_breakdown,
                ]);
            }
        }

        // If no existing design but customizer attributes provided, find or create one
        if (!$customizerDesignId && !empty($validated['product_id']) && !empty($validated['parts_colors'])) {
            $existingRecentDesign = CustomizerDesign::where('product_id', $validated['product_id'])
                ->where('design_name', 'LIKE', '%' . $validated['style_name'] . '%')
                ->where('created_at', '>=', now()->subMinutes(30))
                ->first();

            if ($existingRecentDesign) {
                $existingRecentDesign->update([
                    'customer_id' => $customerId ?: $existingRecentDesign->customer_id,
                    'parts_colors' => $validated['parts_colors'],
                    'artwork_layers' => $artworkLayers,
                    'monogram_state' => $validated['monogram_state'] ?? null,
                    'preview_front' => $previewFront,
                    'preview_back' => $previewBack,
                    'decoration_method' => $validated['decoration_method'] ?? null,
                    'wash_type' => $validated['wash_type'] ?? null,
                    'size_breakdown' => $validated['size_breakdown'] ?? null,
                ]);
                $customizerDesignId = $existingRecentDesign->id;
            } else {
                $newDesignCode = 'CD-' . strtoupper(Str::random(8));
                $createdDesign = CustomizerDesign::create([
                    'product_id' => $validated['product_id'],
                    'customer_id' => $customerId,
                    'design_code' => $newDesignCode,
                    'design_name' => $validated['style_name'],
                    'parts_colors' => $validated['parts_colors'],
                    'artwork_layers' => $artworkLayers,
                    'monogram_state' => $validated['monogram_state'] ?? null,
                    'preview_front' => $previewFront,
                    'preview_back' => $previewBack,
                    'decoration_method' => $validated['decoration_method'] ?? null,
                    'wash_type' => $validated['wash_type'] ?? null,
                    'fabric_spec' => $validated['fabric_spec'] ?? null,
                    'target_gsm' => $validated['target_gsm'] ?? null,
                    'size_breakdown' => $validated['size_breakdown'] ?? null,
                ]);
                $customizerDesignId = $createdDesign->id;
            }
        }

        // Calculate deterministic design fingerprint
        $fingerprintPayload = [
            'product_id' => $validated['product_id'] ?? null,
            'parts_colors' => $validated['parts_colors'] ?? [],
            'artwork_layers' => $artworkLayers,
            'monogram_state' => $validated['monogram_state'] ?? null,
            'decoration_method' => $validated['decoration_method'] ?? null,
        ];
        $designFingerprint = hash('sha256', json_encode($fingerprintPayload));

        // --- DEDUPLICATION LOGIC (STRICT IDENTIFIERS & FINGERPRINT ONLY) ---
        $techPack = null;
        if ($code) {
            $techPack = TechPack::where('code', $code)->first();
        }

        // If still no tech pack found by explicit code, check if linked design already has one
        if (!$techPack && $customizerDesignId) {
            $techPack = TechPack::where('customizer_design_id', $customizerDesignId)->first();
        }

        // Only match if exact content fingerprint matches in the last hour (never by style name alone)
        if (!$techPack && !empty($designFingerprint)) {
            $tpQuery = TechPack::where('design_fingerprint', $designFingerprint)
                ->where('created_at', '>=', now()->subHours(1));
            if (!empty($customerId)) {
                $tpQuery->where('customer_id', $customerId);
            }
            $techPack = $tpQuery->latest()->first();
        }

        $totalUnits = $validated['total_units'] ?? null;
        if (!$totalUnits && !empty($validated['size_breakdown'])) {
            $totalUnits = array_sum(array_map('intval', $validated['size_breakdown']));
        }

        $defaultPom = $validated['pom_measurements'] ?? [
            'grading_matrix' => [
                'XS' => ['chest_width' => 54, 'body_length' => 68, 'shoulder_drop' => 50, 'sleeve_length' => 63],
                'S' => ['chest_width' => 57, 'body_length' => 70, 'shoulder_drop' => 52, 'sleeve_length' => 64],
                'M' => ['chest_width' => 60, 'body_length' => 72, 'shoulder_drop' => 54, 'sleeve_length' => 65],
                'L' => ['chest_width' => 63, 'body_length' => 74, 'shoulder_drop' => 56, 'sleeve_length' => 66],
                'XL' => ['chest_width' => 66, 'body_length' => 76, 'shoulder_drop' => 58, 'sleeve_length' => 67],
                '2XL' => ['chest_width' => 69, 'body_length' => 78, 'shoulder_drop' => 60, 'sleeve_length' => 68],
                '3XL' => ['chest_width' => 72, 'body_length' => 80, 'shoulder_drop' => 62, 'sleeve_length' => 69],
            ],
            'breakdown' => $validated['size_breakdown'] ?? null,
            'unit' => 'cm',
            'tolerance' => '±1.0 cm',
        ];

        $fabricDesc = $validated['fabric_spec'] ?? '450 GSM 100% Combed Cotton French Terry';
        $lowerStyle = strtolower($validated['style_name'] ?? '');

        if (!empty($validated['bill_of_materials'])) {
            $defaultBom = $validated['bill_of_materials'];
        } elseif (str_contains($lowerStyle, 'varsity') || str_contains($lowerStyle, 'letterman')) {
            $defaultBom = [
                ['item' => 'Main Body Fabric', 'spec' => $fabricDesc ?: '24 oz Melton Wool (80% Wool / 20% Nylon)', 'consumption' => '1.35 meters'],
                ['item' => 'Sleeve Shell', 'spec' => 'Full-Grain Supple Cowhide Leather 1.2-1.4mm', 'consumption' => '1.10 meters'],
                ['item' => 'Interior Lining', 'spec' => '120 GSM Diamond Quilted Polyfill Satin', 'consumption' => '1.45 meters'],
                ['item' => 'Rib Knit Trim', 'spec' => '2x2 Heavy Striped Wool/Cotton Rib-Knit', 'consumption' => '0.40 meters'],
                ['item' => 'Hardware Snaps', 'spec' => 'Heavy-Duty Brass Enamel Coated Press Snaps', 'consumption' => '7 pcs'],
                ['item' => 'Sewing Thread', 'spec' => 'Bonded Heavy Nylon / Core-Spun Poly #40', 'consumption' => '180 meters'],
                ['item' => 'Neck & Care Label', 'spec' => 'High-Density Damask Woven Label', 'consumption' => '1 set'],
                ['item' => 'Packaging', 'spec' => 'Heavy-Duty Frosted Garment Polybag with Hanger Slot', 'consumption' => '1 pc'],
            ];
        } elseif (str_contains($lowerStyle, 'basketball') || str_contains($lowerStyle, 'jersey')) {
            $defaultBom = [
                ['item' => 'Main Body Fabric', 'spec' => $fabricDesc ?: '200 GSM Diamond Weave Polyester Air-Mesh', 'consumption' => '1.10 meters'],
                ['item' => 'Panel Inserts', 'spec' => '220 GSM 4-Way Stretch Interlock Mesh', 'consumption' => '0.35 meters'],
                ['item' => 'Collar & Arm Trim', 'spec' => '1x1 Jacquard Flat-Knit Rib Collar', 'consumption' => '0.25 meters'],
                ['item' => 'Drawcord & Aglets', 'spec' => 'Reinforced Flat Knitted Drawcord with Rubberized Aglets', 'consumption' => '1.20 meters'],
                ['item' => 'Sewing Thread', 'spec' => 'Microfiber Core-Spun Poly #50 Ticket 140', 'consumption' => '95 meters'],
                ['item' => 'Heat-Seal Label', 'spec' => 'Sublimated Tagless Heat-Transfer Neck Spec', 'consumption' => '1 pc'],
                ['item' => 'Packaging', 'spec' => 'Recycled Frosted Ziplock Polybag with Vent Holes', 'consumption' => '1 pc'],
            ];
        } elseif (str_contains($lowerStyle, 'equestrian') || str_contains($lowerStyle, 'riding')) {
            $defaultBom = [
                ['item' => 'Main Body Fabric', 'spec' => $fabricDesc ?: '320 GSM 4-Way Stretch Italian Softshell (DWR)', 'consumption' => '1.60 meters'],
                ['item' => 'Thermal Backing', 'spec' => 'Bonded Hydrophobic Micro-Grid Fleece Lining', 'consumption' => '1.40 meters'],
                ['item' => 'Front Zipper', 'spec' => 'Waterproof YKK AquaGuard Double-Slider Zipper', 'consumption' => '1 pc (65cm)'],
                ['item' => 'Pocket Hardware', 'spec' => 'Concealed Reverse-Coil YKK Zippers', 'consumption' => '2 pcs (18cm)'],
                ['item' => 'Seam Sealing', 'spec' => '3-Layer Heat Activated Waterproof Seam Tape', 'consumption' => '8.5 meters'],
                ['item' => 'Branding Trim', 'spec' => 'Reflective High-Density Silicone Molded Crest', 'consumption' => '1 pc'],
                ['item' => 'Packaging', 'spec' => 'Breathable Non-Woven Atelier Suit Garment Carrier', 'consumption' => '1 pc'],
            ];
        } else {
            $defaultBom = [
                ['item' => 'Main Body Fabric', 'spec' => $fabricDesc ?: '450 GSM 100% Combed Cotton French Terry', 'consumption' => '1.45 meters'],
                ['item' => 'Rib Knit 2x1', 'spec' => '95% Cotton / 5% Elastane 420 GSM Heavy Rib', 'consumption' => '0.35 meters'],
                ['item' => 'Hood Drawcord', 'spec' => 'Heavy Round Knitted 100% Cotton Cord with Metal Tips', 'consumption' => '1.30 meters'],
                ['item' => 'Drawcord Eyelets', 'spec' => 'Matte Black Powder-Coated Brass Eyelets', 'consumption' => '2 pcs'],
                ['item' => 'Sewing Thread', 'spec' => '100% Core-Spun Poly #40 Ticket 120 (Flatlock)', 'consumption' => '140 meters'],
                ['item' => 'Neck & Care Label', 'spec' => 'High-Density Damask Woven Label + Satin Care', 'consumption' => '1 set'],
                ['item' => 'Packaging', 'spec' => '80-Micron Biodegradable Frosted Ziplock Polybag', 'consumption' => '1 pc'],
            ];
        }

        $techPackData = [
            'customer_id' => $customerId,
            'customizer_design_id' => $customizerDesignId,
            'design_fingerprint' => $designFingerprint,
            'status' => $techPack ? $techPack->status : 'submitted',
            'version' => $techPack ? $this->incrementVersion($techPack->version ?? '1.0') : '1.0',
            'style_name' => $validated['style_name'],
            'season' => $validated['season'] ?? 'FW26',
            'fabric_spec' => $fabricDesc,
            'target_gsm' => $validated['target_gsm'] ?? 450,
            'stitching_notes' => $validated['stitching_notes'] ?? 'Double-needle flatlock topstitching along seams. 100% pre-shrunk wash test under AQL 2.5 protocol.',
            'pom_measurements' => $defaultPom,
            'bill_of_materials' => $defaultBom,
            'pdf_path' => $validated['pdf_path'] ?? null,
            'preview_front' => $previewFront,
            'preview_back' => $previewBack,
            'parts_colors' => $validated['parts_colors'] ?? null,
            'artwork_layers' => $artworkLayers,
            'monogram_state' => $validated['monogram_state'] ?? null,
            'decoration_method' => $validated['decoration_method'] ?? '3D Puff Embroidery / Screen Print',
            'wash_type' => $validated['wash_type'] ?? 'Clean Raw Mill Finish',
            'size_breakdown' => $validated['size_breakdown'] ?? null,
            'total_units' => $totalUnits,
            'trims_config' => $validated['trims_config'] ?? null,
        ];

        if ($techPack) {
            $techPack->update($techPackData);
        } else {
            $techPackData['code'] = $code ?: ('TP-' . date('Ymd') . '-' . strtoupper(Str::random(5)));
            $techPack = TechPack::create($techPackData);
        }

        return response()->json([
            'success' => true,
            'message' => 'Factory Tech Pack synchronized without duplication.',
            'code' => $techPack->code,
            'tech_pack_code' => $techPack->code,
            'data' => $techPack->load('customizerDesign'),
        ], 200);
    }

    /**
     * Display a specific Tech Pack by code.
     */
    public function show(string $code)
    {
        $techPack = TechPack::where('code', $code)
            ->with(['customizerDesign', 'customer'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $techPack,
        ]);
    }

    /**
     * List recent Tech Packs.
     */
    public function index(Request $request)
    {
        $query = TechPack::with(['customizerDesign', 'customer'])->latest();

        $techPacks = $query->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $techPacks->items(),
            'meta' => [
                'current_page' => $techPacks->currentPage(),
                'last_page' => $techPacks->lastPage(),
                'total' => $techPacks->total(),
            ],
        ]);
    }

    /**
     * Helper to decode any base64 images into permanent files on the public disk.
     */
    protected function processBase64Assets(array &$artworkLayers, ?string &$previewFront, ?string &$previewBack): void
    {
        foreach ($artworkLayers as &$layer) {
            if (isset($layer['url']) && is_string($layer['url']) && str_starts_with($layer['url'], 'data:image/')) {
                $savedPath = $this->saveBase64Image($layer['url'], 'customizer_artworks', 'logo_');
                if ($savedPath) {
                    $layer['url'] = $savedPath;
                }
            }
        }

        if ($previewFront && str_starts_with($previewFront, 'data:image/')) {
            $savedPath = $this->saveBase64Image($previewFront, 'customizer_previews', 'prev_front_');
            if ($savedPath) {
                $previewFront = $savedPath;
            }
        }

        if ($previewBack && str_starts_with($previewBack, 'data:image/')) {
            $savedPath = $this->saveBase64Image($previewBack, 'customizer_previews', 'prev_back_');
            if ($savedPath) {
                $previewBack = $savedPath;
            }
        }
    }

    protected function saveBase64Image(string $base64String, string $directory, string $prefix): ?string
    {
        try {
            if (!preg_match('/^data:image\/(\w+);base64,/', $base64String, $matches)) {
                return null;
            }
            $extension = strtolower($matches[1]);
            if ($extension === 'jpeg') $extension = 'jpg';
            $imageData = base64_decode(substr($base64String, strpos($base64String, ',') + 1));
            if (!$imageData) return null;

            $filename = $prefix . time() . '_' . Str::random(8) . '.' . $extension;
            $path = $directory . '/' . $filename;
            Storage::disk('public')->put($path, $imageData);
            return '/storage/' . $path;
        } catch (\Throwable $e) {
            return null;
        }
    }

    protected function incrementVersion(?string $current): string
    {
        if (!$current) return '1.0';
        $parts = explode('.', $current);
        if (count($parts) === 2) {
            return $parts[0] . '.' . ((int)$parts[1] + 1);
        }
        return '1.1';
    }
}
