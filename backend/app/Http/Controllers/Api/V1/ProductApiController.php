<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('status', 'published')
            ->select([
                'id',
                'name',
                'slug',
                'sku',
                'short_description',
                'regular_price',
                'sale_price',
                'wholesale_price',
                'moq',
                'lead_time_days',
                'default_gsm',
                'fit',
                'is_featured',
                'product_type',
            ])
            ->with(['categories', 'primaryImage', 'images']);

        if ($request->filled('category')) {
            $catSlug = $request->category;
            $cat = \App\Models\Category::where('slug', $catSlug)->first();
            if ($cat) {
                $catIds = $cat->children()->pluck('id')->push($cat->id);
                $query->whereHas('categories', fn($q) => $q->whereIn('categories.id', $catIds));
            } else {
                $query->whereHas('categories', fn($q) => $q->where('slug', $catSlug));
            }
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('sku', 'like', "%{$s}%");
            });
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $perPage = min($request->integer('per_page', 250), 1000);
        $products = $query->latest()->paginate($perPage);

        $products->getCollection()->transform(function ($product) {
            $product->meta = [
                'wholesale_price' => $product->wholesale_price,
                'moq' => $product->moq,
                'fit' => $product->fit,
                'default_gsm' => $product->default_gsm,
                'lead_time_days' => $product->lead_time_days,
            ];
            return $product;
        });

        return response()->json($products);
    }

    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->where('status', 'published')
            ->with(['categories', 'images', 'wholesaleTiers', 'variants.attributeValues'])
            ->firstOrFail();

        return response()->json([
            'data' => $product,
        ]);
    }

    public function importCsv(Request $request)
    {
        $request->validate([
            'csv_file' => ['required', 'file', 'mimes:csv,txt', 'max:51200'],
        ]);

        $file = $request->file('csv_file');
        $fileName = $file->getClientOriginalName();
        $storedPath = $file->store('csv_imports', 'local');
        $absolutePath = \Illuminate\Support\Facades\Storage::disk('local')->path($storedPath);

        $job = \App\Models\ImportJob::create([
            'user_id' => auth()->id() ?? null,
            'file_name' => $fileName,
            'file_path' => $absolutePath,
            'status' => 'pending',
        ]);

        $parser = new \App\Services\WooCommerceCsvParserService();
        $parser->process($job);
        $job->refresh();

        return response()->json([
            'success' => true,
            'message' => "CSV '{$fileName}' processed successfully",
            'job' => $job,
            'total_products' => Product::count(),
        ]);
    }
}
