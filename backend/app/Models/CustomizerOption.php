<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomizerOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'key',
        'name',
        'value',
        'garment_types',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'value' => 'array',
        'garment_types' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Scope for active options.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for specific category.
     */
    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope for options applicable to a garment type.
     */
    public function scopeForGarment($query, string $garmentType)
    {
        return $query->where(function ($q) use ($garmentType) {
            $q->whereNull('garment_types')
              ->orWhereJsonContains('garment_types', 'all')
              ->orWhereJsonContains('garment_types', $garmentType);
        });
    }
}
