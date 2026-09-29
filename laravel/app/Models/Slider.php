<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'title_en',
        'title_tr',
        'text',
        'text_en',
        'text_tr',
        'image',
        'link',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = [
        'image_url',
        'title_translations',
        'text_translations',
    ];

    public function getTitleTranslationsAttribute(): array
    {
        return [
            'en' => $this->title_en ?: ($this->title ?: ''),
            'tr' => $this->title_tr ?: '',
        ];
    }

    public function getTextTranslationsAttribute(): array
    {
        return [
            'en' => $this->text_en ?: ($this->text ?: ''),
            'tr' => $this->text_tr ?: '',
        ];
    }

    public function getTranslatedTitle(?string $locale = null): ?string
    {
        $loc = strtolower($locale ?: app()->getLocale() ?: 'en');
        if ($loc === 'tr') {
            return $this->title_tr ?: $this->title_en ?: $this->title;
        }
        return $this->title_en ?: $this->title ?: $this->title_tr;
    }

    public function getTranslatedText(?string $locale = null): string
    {
        $loc = strtolower($locale ?: app()->getLocale() ?: 'en');
        if ($loc === 'tr') {
            return $this->text_tr ?: $this->text_en ?: $this->text ?: '';
        }
        return $this->text_en ?: $this->text ?: $this->text_tr ?: '';
    }

    public function getImageUrlAttribute(): ?string
    {
        if (empty($this->image)) {
            return null;
        }

        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
            return $this->image;
        }

        if (str_starts_with($this->image, '/')) {
            return $this->image;
        }

        return asset('storage/' . $this->image);
    }
}
