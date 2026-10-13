<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RfqNote extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'is_internal' => 'boolean',
    ];

    public function rfq()
    {
        return $this->belongsTo(Rfq::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
