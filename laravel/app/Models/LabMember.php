<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class LabMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'role_en',
        'role_tr',
        'bio_en',
        'bio_tr',
        'body_en',
        'body_tr',
        'phone',
        'emails',
        'avatar',
        'cv_en',
        'cv_tr',
        'social_links',
        'order',
        'is_active',
        'is_director',
    ];

    protected static function booted(): void
    {
        static::saving(function ($member) {
            if (empty($member->slug) || ($member->isDirty('name') && !$member->isDirty('slug'))) {
                $baseSlug = Str::slug($member->name ?: 'member');
                $slug = $baseSlug;
                $count = 1;
                while (static::where('slug', $slug)->where('id', '!=', $member->id ?? 0)->exists()) {
                    $slug = $baseSlug . '-' . (++$count);
                }
                $member->slug = $slug;
            }
        });
    }

    protected $casts = [
        'emails' => 'array',
        'social_links' => 'array',
        'is_active' => 'boolean',
        'is_director' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = [
        'avatar_url',
        'cv_en_url',
        'cv_tr_url',
        'role_translations',
        'bio_translations',
        'body_translations',
        'cv_translations',
    ];

    public function getRoleTranslationsAttribute(): array
    {
        return [
            'en' => $this->role_en ?: '',
            'tr' => $this->role_tr ?: '',
        ];
    }

    public function getBioTranslationsAttribute(): array
    {
        return [
            'en' => $this->bio_en ?: '',
            'tr' => $this->bio_tr ?: '',
        ];
    }

    public function getBodyTranslationsAttribute(): array
    {
        return [
            'en' => $this->body_en ?: '',
            'tr' => $this->body_tr ?: '',
        ];
    }

    public function getCvTranslationsAttribute(): array
    {
        return [
            'en' => $this->cv_en ?: '',
            'tr' => $this->cv_tr ?: '',
        ];
    }

    public function getAvatarUrlAttribute(): ?string
    {
        if (empty($this->avatar)) {
            return null;
        }

        if (str_starts_with($this->avatar, 'http://') || str_starts_with($this->avatar, 'https://') || str_starts_with($this->avatar, '/')) {
            return $this->avatar;
        }

        return asset('storage/' . $this->avatar);
    }

    public function getCvEnUrlAttribute(): ?string
    {
        if (empty($this->cv_en)) {
            return null;
        }

        if (str_starts_with($this->cv_en, 'http://') || str_starts_with($this->cv_en, 'https://') || str_starts_with($this->cv_en, '/')) {
            return $this->cv_en;
        }

        return asset('storage/' . $this->cv_en);
    }

    public function getCvTrUrlAttribute(): ?string
    {
        if (empty($this->cv_tr)) {
            return null;
        }

        if (str_starts_with($this->cv_tr, 'http://') || str_starts_with($this->cv_tr, 'https://') || str_starts_with($this->cv_tr, '/')) {
            return $this->cv_tr;
        }

        return asset('storage/' . $this->cv_tr);
    }

    public function getTranslatedRole(?string $locale = null): ?string
    {
        $loc = strtolower($locale ?: app()->getLocale() ?: 'en');
        if ($loc === 'tr') {
            return $this->role_tr ?: $this->role_en;
        }
        return $this->role_en ?: $this->role_tr;
    }

    public function getTranslatedBio(?string $locale = null): ?string
    {
        $loc = strtolower($locale ?: app()->getLocale() ?: 'en');
        if ($loc === 'tr') {
            return $this->bio_tr ?: $this->bio_en;
        }
        return $this->bio_en ?: $this->bio_tr;
    }

    public function getTranslatedBody(?string $locale = null): ?string
    {
        $loc = strtolower($locale ?: app()->getLocale() ?: 'en');
        if ($loc === 'tr') {
            return $this->body_tr ?: $this->body_en;
        }
        return $this->body_en ?: $this->body_tr;
    }

    public function getTranslatedCv(?string $locale = null): ?string
    {
        $loc = strtolower($locale ?: app()->getLocale() ?: 'en');
        if ($loc === 'tr') {
            return $this->cv_tr_url ?: $this->cv_en_url;
        }
        return $this->cv_en_url ?: $this->cv_tr_url;
    }
}
