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

        $customizerDesignId = null;

        // If design_code is provided, link to existing CustomizerDesign
        if (!empty($validated['design_code'])) {
            $existingDesign = CustomizerDesign::where('design_code', $validated['design_code'])->first();
            if ($existingDesign) {
                $customizerDesignId = $existingDesign->id;
                // Update the design with latest visual/parts data
                $existingDesign->update([
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
                    'customer_id' => $validated['customer_id'] ?? null,
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
            if (!empty($validated['customer_id'])) {
                $tpQuery->where('customer_id', $validated['customer_id']);
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
        $defaultBom = $validated['bill_of_materials'] ?? [
            ['item' => 'Main Body Fabric', 'spec' => $fabricDesc, 'consumption' => '1.45 meters'],
            ['item' => 'Rib Knit 2x1', 'spec' => '95% Cotton / 5% Elastane 420 GSM', 'consumption' => '0.35 meters'],
            ['item' => 'Sewing Thread', 'spec' => '100% Core-Spun Poly #40 Ticket 120', 'consumption' => '120 meters'],
            ['item' => 'Neck Label', 'spec' => 'High-Density Damask Woven Label', 'consumption' => '1 pc'],
            ['item' => 'Care Label', 'spec' => 'Satin Heat-Transfer / Printed', 'consumption' => '1 pc'],
            ['item' => 'Packaging', 'spec' => '80-Micron Biodegradable Frosted Ziplock Polybag', 'consumption' => '1 pc'],
        ];

        $techPackData = [
            'customer_id' => $validated['customer_id'] ?? null,
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
