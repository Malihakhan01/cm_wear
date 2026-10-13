<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CustomizerDesign extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'product_id',
        'design_code',
        'design_fingerprint',
        'status',
        'version',
        'design_name',
        'preview_front',
        'preview_back',
        'parts_colors',
        'artwork_layers',
        'monogram_state',
        'decoration_method',
        'wash_type',
        'fabric_spec',
        'target_gsm',
        'size_breakdown',
        'total_units',
        'trims_config',
    ];

    protected $casts = [
        'parts_colors' => 'array',
        'artwork_layers' => 'array',
        'monogram_state' => 'array',
        'size_breakdown' => 'array',
        'trims_config' => 'array',
        'target_gsm' => 'integer',
        'total_units' => 'integer',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function techPack(): HasOne
    {
        return $this->hasOne(TechPack::class);
    }
}
