<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'group',
        'key',
        'value',
        'type',
    ];

    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        if (!$setting) {
            return $default;
        }

        return match ($setting->type) {
            'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
            'number'  => is_numeric($setting->value) ? $setting->value + 0 : $setting->value,
            'json'    => json_decode($setting->value, true) ?: [],
            default   => $setting->value,
        };
    }

    public static function set(string $key, mixed $value, string $group = 'general', string $type = 'string'): static
    {
        $encoded = match ($type) {
            'json'    => is_string($value) ? $value : json_encode($value),
            'boolean' => $value ? '1' : '0',
            default   => (string) $value,
        };

        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $encoded, 'group' => $group, 'type' => $type]
        );
    }
}
