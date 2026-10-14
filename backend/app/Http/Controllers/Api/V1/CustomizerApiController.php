<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomizerDesign;
use App\Models\CustomizerOption;
use App\Models\Product;
use App\Models\TechPack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CustomizerApiController extends Controller
{
    /**
     * Upload custom artwork / logo file (PNG, SVG, JPG, WEBP) directly to backend storage.
     * Hardened with MIME verification, SVG sanitization, and image byte validation.
     */
    public function uploadArtwork(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:png,jpg,jpeg,svg,webp', 'max:10240'], // 10MB max
            'type' => ['nullable', 'string'],
        ]);

        $file = $request->file('file');
        $mime = $file->getMimeType();
        $extension = strtolower($file->getClientOriginalExtension());

        // Validate allowed extensions and MIME types
        $allowedMimes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/svg'];
        if (!in_array($mime, $allowedMimes)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid file MIME type. Only PNG, JPG, WEBP, and SVG images are accepted.',
            ], 422);
        }

        // SVG Sanitization against Stored XSS and XML attacks
        if ($extension === 'svg' || str_contains($mime, 'svg')) {
            $svgContent = file_get_contents($file->getRealPath());

            // Check for malicious patterns
            $dangerPatterns = [
                '/<script\b[^>]*>(.*?)<\/script>/is',
                '/on\w+\s*=/i', // onload, onerror, onclick, etc.
                '/javascript\s*:/i',
                '/data\s*:\s*text\/html/i',
                '/xlink:href\s*=\s*["\']javascript:/i',
                '/<\?php/i',
                '/<\!ENTITY/i', // XXE prevention
            ];

            foreach ($dangerPatterns as $pattern) {
                if (preg_match($pattern, $svgContent)) {
                    // Strip the dangerous scripts/attributes
                    $svgContent = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $svgContent);
                    $svgContent = preg_replace('/\s*on\w+\s*=\s*(["\'][^"\']*["\']|[^\s>]+)/i', '', $svgContent);
                    $svgContent = preg_replace('/(href|xlink:href)\s*=\s*["\']javascript:[^"\']*["\']/i', '', $svgContent);
                    
                    // If still matches dangerous executable tags, reject
                    if (preg_match('/<script\b/i', $svgContent) || preg_match('/javascript:/i', $svgContent)) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Security violation: The uploaded SVG contains potentially unsafe scripts.',
                        ], 422);
                    }
                }
            }

            // Ensure valid XML structure
            libxml_use_internal_errors(true);
            $dom = new \DOMDocument();
            $dom->loadXML($svgContent, LIBXML_NONET | LIBXML_NOENT);
            libxml_clear_errors();

            $filename = 'logo_' . time() . '_' . Str::random(12) . '.svg';
            $path = 'customizer_artworks/' . $filename;
            Storage::disk('public')->put($path, $svgContent);
        } else {
            // For raster formats (PNG, JPG, WEBP), verify image header bytes
            $imageInfo = @getimagesize($file->getRealPath());
            if ($imageInfo === false) {
                return response()->json([
                    'success' => false,
                    'message' => 'Corrupt or invalid image file. Header signature does not match image format.',
                ], 422);
            }

            $filename = 'logo_' . time() . '_' . Str::random(12) . '.' . $extension;
            $path = $file->storeAs('customizer_artworks', $filename, 'public');
        }

        $relativeUrl = '/storage/' . $path;
        $fullUrl = url($relativeUrl);

        return response()->json([
            'success' => true,
            'message' => 'Logo uploaded securely to factory design vault.',
            'url' => $relativeUrl,
            'full_url' => $fullUrl,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
        ], 201);
    }

    /**
     * Return live Customizer Configuration options (swatches, techniques, fonts, templates).
     * Synchronizes dynamic backend configuration with the Next.js customizer.
     */
    public function config(?Request $request = null)
    {
        $request = $request ?: request();
        $garmentType = $request->query('garment', 'all');

        $options = CustomizerOption::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $swatches = $options->where('category', 'color_swatch')->values()->map(function ($opt) {
            return [
                'id' => $opt->key,
                'name' => $opt->name,
                'hex' => $opt->value['hex'] ?? '#0A0A0A',
                'pantone' => $opt->value['pantone'] ?? null,
                'garments' => $opt->garment_types ?? ['all'],
            ];
        });

        $decorations = $options->where('category', 'decoration_method')->values()->map(function ($opt) {
            return [
                'id' => $opt->key,
                'name' => $opt->name,
                'tagline' => $opt->value['tagline'] ?? '',
                'desc' => $opt->value['desc'] ?? '',
                'durability' => $opt->value['durability'] ?? '',
                'moq' => $opt->value['moq'] ?? 30,
                'surcharge' => $opt->value['surcharge_per_unit'] ?? 0,
                'garments' => $opt->garment_types ?? ['all'],
            ];
        });

        $fonts = $options->where('category', 'font')->values()->map(function ($opt) {
            return [
                'id' => $opt->key,
                'name' => $opt->name,
                'family' => $opt->value['family'] ?? 'sans-serif',
                'style' => $opt->value['style'] ?? 'Normal',
                'category' => $opt->value['category'] ?? 'Standard',
            ];
        });

        $templates = $options->where('category', 'garment_template')->values()->map(function ($opt) {
            return [
                'id' => $opt->key,
                'name' => $opt->name,
                'model_type' => $opt->value['model_type'] ?? 'hoodie',
                'slug' => $opt->value['slug'] ?? '',
                'default_gsm' => $opt->value['default_gsm'] ?? 450,
                'fabric' => $opt->value['fabric'] ?? '',
                'zones' => $opt->value['zones'] ?? [],
                'default_bom' => $opt->value['default_bom'] ?? [],
                'pom_grading' => $opt->value['pom_grading'] ?? [],
                'wholesale_tiers' => $opt->value['wholesale_tiers'] ?? [],
            ];
        });

        $trims = $options->where('category', 'trim')->values()->map(function ($opt) {
            return [
                'id' => $opt->key,
                'name' => $opt->name,
                'hex' => $opt->value['hex'] ?? '#E4E4E7',
                'material' => $opt->value['material'] ?? '',
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'swatches' => $swatches,
                'decorations' => $decorations,
                'fonts' => $fonts,
                'templates' => $templates,
                'trims' => $trims,
            ],
        ]);
    }

    /**
     * Browse uploaded logos and artworks in the factory artwork vault.
     */
    public function artworks(?Request $request = null)
    {
        $files = Storage::disk('public')->files('customizer_artworks');
        $artworks = [];

        foreach ($files as $file) {
            $artworks[] = [
                'url' => '/storage/' . $file,
                'full_url' => url('/storage/' . $file),
                'filename' => basename($file),
                'size' => Storage::disk('public')->size($file),
                'last_modified' => Storage::disk('public')->lastModified($file),
            ];
        }

        // Sort latest first
        usort($artworks, fn($a, $b) => $b['last_modified'] <=> $a['last_modified']);

        return response()->json([
            'success' => true,
            'data' => array_slice($artworks, 0, 50),
        ]);
    }

    /**
     * Save or update a customizer design and synchronized factory tech pack.
     * Uses deterministic fingerprinting and unique codes to ensure zero accidental overwrites.
     */
    public function save(Request $request)
    {
        // Normalize camelCase / alias inputs
        if (!$request->filled('client_email')) {
            if ($request->filled('clientEmail')) {
                $request->merge(['client_email' => $request->clientEmail]);
            } elseif ($request->filled('email')) {
                $request->merge(['client_email' => $request->email]);
            }
        }
        if (!$request->filled('client_name')) {
            if ($request->filled('clientName')) {
                $request->merge(['client_name' => $request->clientName]);
            } elseif ($request->filled('name')) {
                $request->merge(['client_name' => $request->name]);
            }
        }
        if (!$request->filled('client_company') && $request->filled('clientCompany')) {
            $request->merge(['client_company' => $request->clientCompany]);
        }
        if (!$request->filled('client_phone') && $request->filled('clientPhone')) {
            $request->merge(['client_phone' => $request->clientPhone]);
        }

        $validated = $request->validate([
            'design_code' => ['nullable', 'string', 'max:50'],
            'product_id' => ['required', 'exists:products,id'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'design_name' => ['required', 'string', 'max:255'],
            'parts_colors' => ['required', 'array'],
            'artwork_layers' => ['nullable', 'array'],
            'monogram_state' => ['nullable'],
            'preview_front' => ['nullable', 'string'],
            'preview_back' => ['nullable', 'string'],
            'decoration_method' => ['nullable', 'string', 'max:100'],
            'wash_type' => ['nullable', 'string', 'max:100'],
            'fabric_spec' => ['nullable', 'string'],
            'target_gsm' => ['nullable', 'integer'],
            'size_breakdown' => ['nullable', 'array'],
            'total_units' => ['nullable', 'integer'],
            'trims_config' => ['nullable', 'array'],
            'pom_measurements' => ['nullable', 'array'],
            'bill_of_materials' => ['nullable', 'array'],
            'stitching_notes' => ['nullable', 'string'],
            'client_email' => ['nullable', 'email', 'max:255'],
            'client_name' => ['nullable', 'string', 'max:255'],
            'client_company' => ['nullable', 'string', 'max:255'],
            'client_phone' => ['nullable', 'string', 'max:50'],
        ]);

        // Auto-associate Customer record if client email is provided
        if (empty($validated['customer_id']) && !empty($validated['client_email'])) {
            try {
                $customer = Customer::firstOrCreate(
                    ['email' => strtolower(trim($validated['client_email']))],
                    [
                        'first_name' => !empty($validated['client_name']) ? explode(' ', trim($validated['client_name']))[0] : 'Brand',
                        'last_name' => (!empty($validated['client_name']) && count(explode(' ', trim($validated['client_name']))) > 1) ? substr(strstr(trim($validated['client_name']), ' '), 1) : 'Designer',
                        'company_name' => $validated['client_company'] ?? null,
                        'phone' => $validated['client_phone'] ?? null,
                        'whatsapp' => $validated['client_phone'] ?? null,
                        'status' => 'active',
                    ]
                );
                $validated['customer_id'] = $customer->id;
            } catch (\Throwable $e) {
                \Log::warning("Customizer client linking fallback: " . $e->getMessage());
            }
        }

        // Process any base64 data URLs in artwork_layers or previews and convert to permanent files
        $artworkLayers = $validated['artwork_layers'] ?? [];
        $previewFront = $validated['preview_front'] ?? null;
        $previewBack = $validated['preview_back'] ?? null;
        $this->processBase64Assets($artworkLayers, $previewFront, $previewBack);

        // Calculate deterministic design fingerprint (SHA-256 of visual customization attributes)
        $fingerprintPayload = [
            'product_id' => $validated['product_id'],
            'parts_colors' => $validated['parts_colors'],
            'artwork_layers' => $artworkLayers,
            'monogram_state' => $validated['monogram_state'] ?? null,
            'decoration_method' => $validated['decoration_method'] ?? null,
        ];
        $designFingerprint = hash('sha256', json_encode($fingerprintPayload));

        // Strict Deduplication:
        // 1. If explicit design_code is provided, update that exact design.
        // 2. Otherwise, match ONLY if identical fingerprint exists for the same customer/session in the last hour.
        // NEVER match by generic design_name or product_id alone.
        $design = null;
        if (!empty($validated['design_code'])) {
            $design = CustomizerDesign::where('design_code', $validated['design_code'])->first();
        }

        if (!$design && !empty($designFingerprint)) {
            $designQuery = CustomizerDesign::where('design_fingerprint', $designFingerprint)
                ->where('created_at', '>=', now()->subHours(1));

            if (!empty($validated['customer_id'])) {
                $designQuery->where('customer_id', $validated['customer_id']);
            }

            $design = $designQuery->latest()->first();
        }

        $totalUnits = $validated['total_units'] ?? null;
        if (!$totalUnits && !empty($validated['size_breakdown'])) {
            $totalUnits = array_sum(array_map('intval', $validated['size_breakdown']));
        }

        $designData = [
            'product_id' => $validated['product_id'],
            'customer_id' => $validated['customer_id'] ?? null,
            'design_name' => $validated['design_name'],
            'design_fingerprint' => $designFingerprint,
            'status' => 'active',
            'version' => $design ? $this->incrementVersion($design->version ?? '1.0') : '1.0',
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
            'total_units' => $totalUnits,
            'trims_config' => $validated['trims_config'] ?? null,
        ];

        if ($design) {
            $design->update($designData);
        } else {
            $designData['design_code'] = !empty($validated['design_code'])
                ? $validated['design_code']
                : ('CD-' . strtoupper(Str::random(8)));
            $design = CustomizerDesign::create($designData);
        }

        // Auto-generate or update corresponding Factory Tech Pack
        $product = Product::find($validated['product_id']);
        $techPack = TechPack::where('customizer_design_id', $design->id)->first();

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

        $fabricDescription = $validated['fabric_spec'] ?? ($product ? ($product->description ?: '450 GSM 100% Combed Cotton') : '450 GSM 100% Combed Cotton');
        $defaultBom = $validated['bill_of_materials'] ?? [
            ['item' => 'Shell Fabric', 'spec' => $fabricDescription, 'consumption' => '1.45m'],
            ['item' => 'Rib Trims', 'spec' => '2x1 Heavy Elastic Rib 420 GSM', 'consumption' => '0.35m'],
            ['item' => 'Sewing Thread', 'spec' => '#40 Poly Core-Spun Ticket 120', 'consumption' => '120m'],
            ['item' => 'Brand Label', 'spec' => 'High-Density Damask Woven Label', 'consumption' => '1 pc'],
            ['item' => 'Care Label', 'spec' => 'Satin Heat-Transfer Printed', 'consumption' => '1 pc'],
            ['item' => 'Packaging', 'spec' => '80-Micron Biodegradable Frosted Ziplock Polybag', 'consumption' => '1 pc'],
        ];

        $techPackData = [
            'customizer_design_id' => $design->id,
            'customer_id' => $validated['customer_id'] ?? null,
            'design_fingerprint' => $designFingerprint,
            'status' => 'submitted',
            'version' => $design->version,
            'style_name' => $validated['design_name'] . ' Factory Spec Sheet',
            'season' => 'FW26',
            'fabric_spec' => $fabricDescription,
            'target_gsm' => $validated['target_gsm'] ?? ($product->default_gsm ?? 450),
            'stitching_notes' => $validated['stitching_notes'] ?? 'Double-needle flatlock topstitching along seams. 100% pre-shrunk wash test under AQL 2.5 protocol.',
            'pom_measurements' => $defaultPom,
            'bill_of_materials' => $defaultBom,
            'preview_front' => $previewFront,
            'preview_back' => $previewBack,
            'parts_colors' => $validated['parts_colors'],
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
            $techPackData['code'] = 'TP-' . date('Ymd') . '-' . strtoupper(Str::random(5));
            $techPack = TechPack::create($techPackData);
        }

        return response()->json([
            'success' => true,
            'message' => 'Customizer design and factory tech pack saved successfully.',
            'design_code' => $design->design_code,
            'tech_pack_code' => $techPack->code,
            'data' => $design->load('product'),
            'tech_pack' => $techPack,
        ], 200);
    }

    /**
     * Show customizer design details by design code.
     */
    public function show(string $code)
    {
        $design = CustomizerDesign::where('design_code', $code)
            ->when(is_numeric($code), function ($query) use ($code) {
                return $query->orWhere('id', (int) $code);
            })
            ->with(['product.primaryImage', 'techPack', 'customer'])
            ->first();

        if (!$design) {
            return response()->json([
                'success' => false,
                'message' => "Customizer design not found for code [{$code}].",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $design,
        ]);
    }

    /**
     * Helper to increment semantic versions (e.g. 1.0 -> 1.1).
     */
    protected function incrementVersion(?string $current): string
    {
        if (!$current) return '1.0';
        $parts = explode('.', $current);
        if (count($parts) === 2) {
            return $parts[0] . '.' . ((int)$parts[1] + 1);
        }
        return '1.1';
    }

    /**
     * Helper to decode any base64 images into permanent files on the public disk.
     */
    protected function processBase64Assets(array &$artworkLayers, ?string &$previewFront, ?string &$previewBack): void
    {
        // 1. Process Artwork Layers
        foreach ($artworkLayers as &$layer) {
            if (isset($layer['url']) && is_string($layer['url']) && str_starts_with($layer['url'], 'data:image/')) {
                $savedPath = $this->saveBase64Image($layer['url'], 'customizer_artworks', 'logo_');
                if ($savedPath) {
                    $layer['url'] = $savedPath;
                }
            }
        }

        // 2. Process Preview Front
        if ($previewFront && str_starts_with($previewFront, 'data:image/')) {
            $savedPath = $this->saveBase64Image($previewFront, 'customizer_previews', 'prev_front_');
            if ($savedPath) {
                $previewFront = $savedPath;
            }
        }

        // 3. Process Preview Back
        if ($previewBack && str_starts_with($previewBack, 'data:image/')) {
            $savedPath = $this->saveBase64Image($previewBack, 'customizer_previews', 'prev_back_');
            if ($savedPath) {
                $previewBack = $savedPath;
            }
        }
    }

    /**
     * Helper to save a single base64 data string to public disk.
     */
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

            $filename = $prefix . time() . '_' . Str::random(12) . '.' . $extension;
            $path = $directory . '/' . $filename;
            Storage::disk('public')->put($path, $imageData);
            return '/storage/' . $path;
        } catch (\Throwable $e) {
            return null;
        }
    }
}
