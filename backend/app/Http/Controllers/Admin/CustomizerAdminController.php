<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomizerDesign;
use App\Models\CustomizerOption;
use App\Models\Product;
use App\Models\TechPack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CustomizerAdminController extends Controller
{
    /**
     * Display Saved Customizer Designs gallery & approval hub.
     */
    public function designs(Request $request)
    {
        $query = CustomizerDesign::with([
            'product.primaryImage',
            'product.images',
            'customer',
            'techPack',
        ]);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('design_code', 'like', "%{$s}%")
                  ->orWhere('design_name', 'like', "%{$s}%")
                  ->orWhereHas('product', function ($pq) use ($s) {
                      $pq->where('name', 'like', "%{$s}%");
                  })
                  ->orWhereHas('customer', function ($cq) use ($s) {
                      $cq->where('email', 'like', "%{$s}%")
                        ->orWhere('first_name', 'like', "%{$s}%")
                        ->orWhere('last_name', 'like', "%{$s}%")
                        ->orWhere('company_name', 'like', "%{$s}%")
                        ->orWhere('phone', 'like', "%{$s}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $designs = $query->latest()->paginate(16);

        return view('admin.customizer.designs', compact('designs'));
    }

    /**
     * Show single design details.
     */
    public function showDesign(CustomizerDesign $design)
    {
        $design->load(['product.primaryImage', 'product.images', 'customer', 'techPack']);
        return response()->json([
            'success' => true,
            'data' => $design,
        ]);
    }

    /**
     * Display Customizer Configuration Hub (Swatches, Decorations, Fonts, Templates, Size Charts, Artworks).
     */
    public function settings(?Request $request = null)
    {
        $request = $request ?: request();
        $tab = $request->query('tab', 'swatches');

        $swatches = CustomizerOption::where('category', 'color_swatch')
            ->orderBy('sort_order')
            ->get();

        $decorations = CustomizerOption::where('category', 'decoration_method')
            ->orderBy('sort_order')
            ->get();

        $fonts = CustomizerOption::where('category', 'font')
            ->orderBy('sort_order')
            ->get();

        $templates = CustomizerOption::where('category', 'garment_template')
            ->orderBy('sort_order')
            ->get();

        $trims = CustomizerOption::where('category', 'trim')
            ->orderBy('sort_order')
            ->get();

        // Get uploaded artworks from disk
        $files = Storage::disk('public')->files('customizer_artworks');
        $artworks = [];
        foreach ($files as $file) {
            $artworks[] = [
                'filename' => basename($file),
                'url' => '/storage/' . $file,
                'size' => Storage::disk('public')->size($file),
                'last_modified' => Storage::disk('public')->lastModified($file),
            ];
        }
        usort($artworks, fn($a, $b) => $b['last_modified'] <=> $a['last_modified']);

        return view('admin.customizer.settings', compact(
            'tab',
            'swatches',
            'decorations',
            'fonts',
            'templates',
            'trims',
            'artworks'
        ));
    }

    /**
     * Store or update a CustomizerOption item (swatch, technique, font, trim, template).
     */
    public function storeOption(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|in:color_swatch,decoration_method,font,garment_template,trim,size_chart',
            'name' => 'required|string|max:255',
            'key' => 'nullable|string|max:100',
            'value' => 'required|array',
            'garment_types' => 'nullable|array',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $id = $request->input('id');
        $tab = $request->input('tab', 'swatches');

        if ($id && ($existing = CustomizerOption::find($id))) {
            $mergedValue = is_array($existing->value) ? array_merge($existing->value, $validated['value']) : $validated['value'];
            $existing->update([
                'category' => $validated['category'],
                'name' => $validated['name'],
                'value' => $mergedValue,
                'garment_types' => $validated['garment_types'] ?? ($existing->garment_types ?? ['all']),
                'is_active' => $request->has('is_active') ? (bool)$request->is_active : $existing->is_active,
                'sort_order' => $validated['sort_order'] ?? $existing->sort_order,
            ]);
            $option = $existing;
        } else {
            $baseKey = !empty($validated['key']) 
                ? Str::slug($validated['key'], '_') 
                : Str::slug($validated['category'] . '_' . $validated['name'], '_');

            $key = $baseKey;
            $counter = 1;
            while (CustomizerOption::where('key', $key)->exists()) {
                $key = $baseKey . '_' . $counter;
                $counter++;
            }

            $option = CustomizerOption::create([
                'key' => $key,
                'category' => $validated['category'],
                'name' => $validated['name'],
                'value' => $validated['value'],
                'garment_types' => $validated['garment_types'] ?? ['all'],
                'is_active' => $request->has('is_active') ? (bool)$request->is_active : true,
                'sort_order' => $validated['sort_order'] ?? 0,
            ]);
        }

        return redirect()->route('admin.customizer.settings', ['tab' => $tab])
            ->with('success', "Customizer setting '{$option->name}' saved successfully.");
    }

    /**
     * Update Point of Measure (POM) grading matrix for a template.
     */
    public function updatePomGrading(Request $request, CustomizerOption $template)
    {
        $grading = $request->input('pom_grading', []);
        
        $val = $template->value;
        $val['pom_grading'] = $grading;
        $template->value = $val;
        $template->save();

        return redirect()->route('admin.customizer.settings', ['tab' => 'size_charts'])
            ->with('success', "POM grading matrix for '{$template->name}' updated successfully.");
    }

    /**
     * Update Wholesale Tier Pricing matrix for a garment template.
     */
    public function updateWholesaleTiers(Request $request, CustomizerOption $template)
    {
        $tiersInput = $request->input('wholesale_tiers', []);
        $formattedTiers = [];

        foreach ($tiersInput as $row) {
            $minQty = isset($row['min_qty']) && $row['min_qty'] !== '' ? (int)$row['min_qty'] : 50;
            $maxQty = isset($row['max_qty']) && $row['max_qty'] !== '' ? (int)$row['max_qty'] : null;
            $unitPrice = isset($row['unit_price']) ? (float)$row['unit_price'] : 0.0;
            $savings = trim($row['savings'] ?? '');

            $formattedTiers[] = [
                'min_qty' => $minQty,
                'max_qty' => $maxQty,
                'unit_price' => $unitPrice,
                'savings' => $savings,
            ];
        }

        $val = $template->value;
        $val['wholesale_tiers'] = $formattedTiers;
        $template->value = $val;
        $template->save();

        return redirect()->route('admin.customizer.settings', ['tab' => 'pricing'])
            ->with('success', "Wholesale tier pricing for '{$template->name}' updated successfully.");
    }

    /**
     * Toggle option active status.
     */
    public function toggleOption(CustomizerOption $option)
    {
        $option->update(['is_active' => !$option->is_active]);
        $tab = request()->input('tab', 'swatches');
        return redirect()->route('admin.customizer.settings', ['tab' => $tab])
            ->with('success', "Option '{$option->name}' is now " . ($option->is_active ? 'Active' : 'Disabled') . '.');
    }

    /**
     * Delete an option.
     */
    public function deleteOption(CustomizerOption $option)
    {
        $name = $option->name;
        $tab = request()->input('tab', 'swatches');
        $option->delete();
        return redirect()->route('admin.customizer.settings', ['tab' => $tab])
            ->with('success', "Option '{$name}' removed from customizer configuration.");
    }

    /**
     * Upload an artwork / brand crest into the permanent artwork vault.
     */
    public function uploadArtwork(Request $request)
    {
        $request->validate([
            'artwork' => 'required|file|mimes:png,jpg,jpeg,svg,webp|max:10240',
        ]);

        $file = $request->file('artwork');
        $ext = strtolower($file->getClientOriginalExtension());
        $filename = 'preset_' . time() . '_' . Str::random(8) . '.' . $ext;

        $path = $file->storeAs('customizer_artworks', $filename, 'public');

        return back()->with('success', "Artwork '{$filename}' uploaded to factory design library.");
    }

    /**
     * Delete artwork from vault.
     */
    public function deleteArtwork(Request $request)
    {
        $filename = $request->input('filename');
        if ($filename && Storage::disk('public')->exists('customizer_artworks/' . $filename)) {
            Storage::disk('public')->delete('customizer_artworks/' . $filename);
            return back()->with('success', "Artwork '{$filename}' removed from library.");
        }
        return back()->with('error', "Artwork file not found.");
    }
}
