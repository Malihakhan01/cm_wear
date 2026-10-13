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

        $key = $validated['key'] ?: (Str::slug($validated['category'] . '_' . $validated['name'], '_'));

        $option = CustomizerOption::updateOrCreate(
            ['key' => $key],
            [
                'category' => $validated['category'],
                'name' => $validated['name'],
                'value' => $validated['value'],
                'garment_types' => $validated['garment_types'] ?? ['all'],
                'is_active' => $request->has('is_active') ? (bool)$request->is_active : true,
                'sort_order' => $validated['sort_order'] ?? 0,
            ]
        );

        return back()->with('success', "Customizer setting '{$option->name}' saved successfully.");
    }

    /**
     * Toggle option active status.
     */
    public function toggleOption(CustomizerOption $option)
    {
        $option->update(['is_active' => !$option->is_active]);
        return back()->with('success', "Option '{$option->name}' is now " . ($option->is_active ? 'Active' : 'Disabled') . '.');
    }

    /**
     * Delete an option.
     */
    public function deleteOption(CustomizerOption $option)
    {
        $name = $option->name;
        $option->delete();
        return back()->with('success', "Option '{$name}' removed from customizer configuration.");
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
