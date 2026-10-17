<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'wc_id',
        'sku',
        'name',
        'slug',
        'product_type',
        'status',
        'is_featured',
        'visibility',
        'short_description',
        'description',
        'regular_price',
        'sale_price',
        'wholesale_price',
        'moq',
        'default_gsm',
        'fit',
        'lead_time_days',
        'sample_available',
        'sample_price',
        'is_customizable',
        'three_d_model_path',
        'garment_parts_config',
        'manage_stock',
        'stock_quantity',
        'stock_status',
        'weight_kg',
        'length_cm',
        'width_cm',
        'height_cm',
        'meta_title',
        'meta_description',
        'canonical_url',
        'og_image_path',
    ];

    protected $casts = [
        'regular_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'wholesale_price' => 'decimal:2',
        'sample_price' => 'decimal:2',
        'moq' => 'integer',
        'default_gsm' => 'integer',
        'lead_time_days' => 'integer',
        'is_featured' => 'boolean',
        'is_customizable' => 'boolean',
        'manage_stock' => 'boolean',
        'stock_quantity' => 'integer',
        'garment_parts_config' => 'array',
    ];

    public function getDescriptionAttribute($value): string
    {
        if (!$value) return '';
        return str_replace(["\\r\\n", "\\n", "\\r"], "\n", $value);
    }

    public function getShortDescriptionAttribute($value): string
    {
        if (!$value) return '';
        return str_replace(["\\r\\n", "\\n", "\\r"], "\n", $value);
    }


    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_product')
            ->withPivot('is_primary');
    }

    public function primaryCategory()
    {
        return $this->belongsToMany(Category::class, 'category_product')
            ->wherePivot('is_primary', true);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function wholesaleTiers(): HasMany
    {
        return $this->hasMany(ProductWholesaleTier::class)->orderBy('min_quantity');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function primaryImage(): HasOne
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    public function customizerDesigns(): HasMany
    {
        return $this->hasMany(CustomizerDesign::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getEffectivePriceAttribute(): float
    {
        return (float) ($this->sale_price ?? $this->regular_price);
    }
}
