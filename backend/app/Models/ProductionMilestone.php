<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductionMilestone extends Model
{
    protected $fillable = [
        'order_id',
        'stage_id',
        'title',
        'description',
        'photos',
        'is_completed',
        'completed_at',
    ];

    protected $casts = [
        'photos' => 'array',
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function stage(): BelongsTo
    {
        return $this->belongsTo(ProductionStage::class, 'stage_id');
    }
}
