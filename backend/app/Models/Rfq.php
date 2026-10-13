<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rfq extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'items' => 'array',
        'requirements' => 'array',
        'files' => 'array',
        'quote' => 'array',
        'target_price' => 'decimal:2',
    ];

    protected static function booted()
    {
        static::creating(function ($rfq) {
            if (empty($rfq->rfq_number)) {
                $rfq->rfq_number = 'RFQ-' . date('Y') . '-' . strtoupper(substr(md5(uniqid()), 0, 6));
            }
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function notes()
    {
        return $this->hasMany(RfqNote::class)->orderBy('created_at', 'desc');
    }
}
