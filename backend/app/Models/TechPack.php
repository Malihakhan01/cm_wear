<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TechPack extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'design_fingerprint',
        'status',
        'version',
        'approved_by',
        'approved_at',
        'rejection_reason',
        'revision_history',
        'customer_id',
        'customizer_design_id',
        'style_name',
        'season',
        'fabric_spec',
        'target_gsm',
        'stitching_notes',
        'pom_measurements',
        'bill_of_materials',
        'pdf_path',
        'preview_front',
        'preview_back',
        'parts_colors',
        'artwork_layers',
        'monogram_state',
        'decoration_method',
        'wash_type',
        'size_breakdown',
        'total_units',
        'trims_config',
    ];

    protected $casts = [
        'target_gsm' => 'integer',
        'total_units' => 'integer',
        'approved_at' => 'datetime',
        'revision_history' => 'array',
        'pom_measurements' => 'array',
        'bill_of_materials' => 'array',
        'parts_colors' => 'array',
        'artwork_layers' => 'array',
        'monogram_state' => 'array',
        'size_breakdown' => 'array',
        'trims_config' => 'array',
    ];

    protected $appends = [
        'product_image',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function customizerDesign(): BelongsTo
    {
        return $this->belongsTo(CustomizerDesign::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getPreviewFrontAttribute($value): ?string
    {
        return $value ?: $this->customizerDesign?->preview_front;
    }

    public function getPreviewBackAttribute($value): ?string
    {
        return $value ?: $this->customizerDesign?->preview_back;
    }

    public function getPartsColorsAttribute($value): ?array
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (is_array($decoded)) return $decoded;
        }
        return $value ?: $this->customizerDesign?->parts_colors;
    }

    public function getArtworkLayersAttribute($value): ?array
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (is_array($decoded)) return $decoded;
        }
        return $value ?: $this->customizerDesign?->artwork_layers;
    }

    public function getMonogramStateAttribute($value)
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if ($decoded !== null) return $decoded;
        }
        return $value ?: $this->customizerDesign?->monogram_state;
    }

    public function getDecorationMethodAttribute($value): ?string
    {
        return $value ?: $this->customizerDesign?->decoration_method;
    }

    public function getWashTypeAttribute($value): ?string
    {
        return $value ?: $this->customizerDesign?->wash_type;
    }

    public function getSizeBreakdownAttribute($value): ?array
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (is_array($decoded)) return $decoded;
        }
        return $value ?: $this->customizerDesign?->size_breakdown;
    }

    public function getProductImageAttribute(): ?string
    {
        return $this->getPreviewFrontAttribute($this->attributes['preview_front'] ?? null)
            ?: ($this->customizerDesign?->product?->primaryImage?->url 
            ?? $this->customizerDesign?->product?->images?->first()?->url);
    }
}
