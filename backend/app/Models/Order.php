<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'customer_id',
        'current_stage_id',
        'order_type',
        'status',
        'total_quantity',
        'subtotal',
        'surcharges',
        'shipping_cost',
        'total_amount',
        'currency',
        'incoterms',
        'shipping_address_snapshot',
        'tracking_number',
        'notes',
    ];

    protected $casts = [
        'total_quantity' => 'integer',
        'subtotal' => 'decimal:2',
        'surcharges' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'shipping_address_snapshot' => 'array',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function currentStage(): BelongsTo
    {
        return $this->belongsTo(ProductionStage::class, 'current_stage_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(ProductionMilestone::class)->orderBy('created_at');
    }
}
