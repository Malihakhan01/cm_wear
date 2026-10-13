<?php

namespace App\Jobs;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DownloadProductImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;
    public int $tries = 3;

    public function __construct(
        public int $productId,
        public string $imageUrl,
        public bool $isPrimary = false,
        public int $sortOrder = 0
    ) {
    }

    public function handle(): void
    {
        $product = Product::find($this->productId);
        if (!$product || empty($this->imageUrl)) return;

        // Check if already downloaded to local storage
        $filenamePattern = basename(parse_url($this->imageUrl, PHP_URL_PATH));
        $alreadyDownloaded = ProductImage::where('product_id', $this->productId)
            ->where('file_path', 'not like', 'http%')
            ->where('file_path', 'like', '%' . $filenamePattern)
            ->first();

        if ($alreadyDownloaded) return;

        try {
            $response = Http::withoutVerifying()->timeout(30)->get($this->imageUrl);

            if ($response->successful()) {
                $extension = pathinfo(parse_url($this->imageUrl, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';
                $extension = strtolower(explode('?', $extension)[0]);
                if (!in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'])) {
                    $extension = 'jpg';
                }
                $filename = 'products/' . $product->slug . '-' . Str::random(8) . '.' . $extension;

                Storage::disk('public')->put($filename, $response->body());

                // Find existing ProductImage with remote URL and update to local path, or create
                $imageRecord = ProductImage::where('product_id', $product->id)
                    ->where('file_path', $this->imageUrl)
                    ->first();

                if ($imageRecord) {
                    $imageRecord->update([
                        'file_path' => $filename,
                        'is_primary' => $this->isPrimary,
                    ]);
                } else {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'file_path' => $filename,
                        'is_primary' => $this->isPrimary,
                        'alt_text' => $product->name,
                        'sort_order' => $this->sortOrder,
                    ]);
                }

                // Also set og_image_path if primary and not set
                if ($this->isPrimary && empty($product->og_image_path)) {
                    $product->update(['og_image_path' => $filename]);
                }
            }
        } catch (\Throwable $e) {
            logger()->warning("Failed to download image for product {$this->productId}: {$this->imageUrl} - " . $e->getMessage());
        }
    }
}
