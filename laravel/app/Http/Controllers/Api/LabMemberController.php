<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LabMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class LabMemberController extends Controller
{
    /**
     * Public index for frontend visitors (with localization support).
     */
    public function publicIndex(Request $request)
    {
        $locale = strtolower($request->query('locale', 'en'));
        if (!in_array($locale, ['en', 'tr'])) {
            $locale = 'en';
        }

        $members = LabMember::where('is_active', true)
            ->where('is_director', false)
            ->orderBy('order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        $formatted = $members->map(function ($member) use ($locale) {
            $data = $member->toArray();
            $data['role'] = $member->getTranslatedRole($locale);
            $data['bio'] = $member->getTranslatedBio($locale);
            $data['body'] = $member->getTranslatedBody($locale);
            $data['cv_url'] = $member->getTranslatedCv($locale);
            return $data;
        });

        return response()->json([
            'status' => true,
            'locale' => $locale,
            'members' => $formatted,
        ]);
    }

    /**
     * Public director endpoint for /director page.
     */
    public function publicDirector(Request $request)
    {
        $locale = strtolower($request->query('locale', 'en'));
        if (!in_array($locale, ['en', 'tr'])) {
            $locale = 'en';
        }

        $director = LabMember::where('is_active', true)
            ->where('is_director', true)
            ->first();

        if (!$director) {
            return response()->json([
                'status' => false,
                'message' => 'Henüz direktör belirlenmemiş.',
            ], 404);
        }

        $data = $director->toArray();
        $data['role'] = $director->getTranslatedRole($locale);
        $data['bio'] = $director->getTranslatedBio($locale);
        $data['body'] = $director->getTranslatedBody($locale);
        $data['cv_url'] = $director->getTranslatedCv($locale);

        return response()->json([
            'status' => true,
            'locale' => $locale,
            'director' => $data,
        ]);
    }

    /**
     * Public show for a single member profile page (supports slug or id).
     */
    public function publicShow($identifier, Request $request)
    {
        $locale = strtolower($request->query('locale', 'en'));
        if (!in_array($locale, ['en', 'tr'])) {
            $locale = 'en';
        }

        $member = LabMember::where('is_active', true)
            ->where(function ($q) use ($identifier) {
                $q->where('slug', $identifier)
                  ->orWhere('id', $identifier);
            })
            ->first();

        if (!$member) {
            return response()->json([
                'status' => false,
                'message' => 'Üye bulunamadı.',
            ], 404);
        }

        $data = $member->toArray();
        $data['role'] = $member->getTranslatedRole($locale);
        $data['bio'] = $member->getTranslatedBio($locale);
        $data['body'] = $member->getTranslatedBody($locale);
        $data['cv_url'] = $member->getTranslatedCv($locale);

        return response()->json([
            'status' => true,
            'locale' => $locale,
            'member' => $data,
        ]);
    }

    /**
     * Admin index (returns all members).
     */
    public function adminIndex(Request $request)
    {
        $query = LabMember::query();

        if ($request->filled('search')) {
            $search = '%' . $request->input('search') . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                  ->orWhere('role_en', 'like', $search)
                  ->orWhere('role_tr', 'like', $search)
                  ->orWhere('bio_en', 'like', $search)
                  ->orWhere('bio_tr', 'like', $search)
                  ->orWhere('phone', 'like', $search);
            });
        }

        $members = $query->orderBy('order', 'asc')->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => true,
            'members' => $members,
        ]);
    }

    /**
     * Store a newly created lab member.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'role_en' => 'nullable|string|max:255',
            'role_tr' => 'nullable|string|max:255',
            'bio_en' => 'nullable|string',
            'bio_tr' => 'nullable|string',
            'body_en' => 'nullable|string',
            'body_tr' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'emails' => 'nullable',
            'avatar' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,svg|max:10240',
            'avatar_url_custom' => 'nullable|string|max:500',
            'cv_en' => 'nullable|file|mimes:pdf,doc,docx|max:20480',
            'cv_tr' => 'nullable|file|mimes:pdf,doc,docx|max:20480',
            'cv_en_custom' => 'nullable|string|max:500',
            'cv_tr_custom' => 'nullable|string|max:500',
            'social_links' => 'nullable',
            'order' => 'nullable|integer',
            'is_active' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        // Process avatar
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('members/avatars', 'public');
        } elseif ($request->filled('avatar_url_custom')) {
            $avatarPath = $request->input('avatar_url_custom');
        }

        // Process CV EN
        $cvEnPath = null;
        if ($request->hasFile('cv_en')) {
            $cvEnPath = $request->file('cv_en')->store('members/cv', 'public');
        } elseif ($request->filled('cv_en_custom')) {
            $cvEnPath = $request->input('cv_en_custom');
        }

        // Process CV TR
        $cvTrPath = null;
        if ($request->hasFile('cv_tr')) {
            $cvTrPath = $request->file('cv_tr')->store('members/cv', 'public');
        } elseif ($request->filled('cv_tr_custom')) {
            $cvTrPath = $request->input('cv_tr_custom');
        }

        // Parse emails
        $emails = $this->normalizeArrayField($request->input('emails'));

        // Parse social links
        $socialLinks = $this->normalizeJsonField($request->input('social_links'));

        // Determine order
        $order = $request->input('order');
        if ($order === null || $order === '') {
            $maxOrder = LabMember::max('order') ?? 0;
            $order = $maxOrder + 1;
        }

        $isDirector = filter_var($request->input('is_director', false), FILTER_VALIDATE_BOOLEAN);
        if ($isDirector) {
            LabMember::query()->update(['is_director' => false]);
        }

        $memberData = [
            'name' => $request->input('name'),
            'role_en' => $request->input('role_en'),
            'role_tr' => $request->input('role_tr'),
            'bio_en' => $request->input('bio_en'),
            'bio_tr' => $request->input('bio_tr'),
            'body_en' => $request->input('body_en'),
            'body_tr' => $request->input('body_tr'),
            'phone' => $request->input('phone'),
            'emails' => $emails,
            'avatar' => $avatarPath,
            'cv_en' => $cvEnPath,
            'cv_tr' => $cvTrPath,
            'social_links' => $socialLinks,
            'order' => (int) $order,
            'is_active' => $isActive,
            'is_director' => $isDirector,
        ];

        if ($request->filled('slug')) {
            $memberData['slug'] = Str::slug($request->input('slug'));
        }

        $member = LabMember::create($memberData);

        return response()->json([
            'status' => true,
            'message' => 'Laboratuvar üyesi başarıyla eklendi.',
            'member' => $member,
        ], 201);
    }

    /**
     * Show member detail.
     */
    public function show($id)
    {
        $member = LabMember::find($id);
        if (!$member) {
            return response()->json([
                'status' => false,
                'message' => 'Üye bulunamadı.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'member' => $member,
        ]);
    }

    /**
     * Update an existing member.
     */
    public function update(Request $request, $id)
    {
        $member = LabMember::find($id);
        if (!$member) {
            return response()->json([
                'status' => false,
                'message' => 'Üye bulunamadı.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'role_en' => 'nullable|string|max:255',
            'role_tr' => 'nullable|string|max:255',
            'bio_en' => 'nullable|string',
            'bio_tr' => 'nullable|string',
            'body_en' => 'nullable|string',
            'body_tr' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'emails' => 'nullable',
            'avatar' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,svg|max:10240',
            'avatar_url_custom' => 'nullable|string|max:500',
            'cv_en' => 'nullable|file|mimes:pdf,doc,docx|max:20480',
            'cv_tr' => 'nullable|file|mimes:pdf,doc,docx|max:20480',
            'cv_en_custom' => 'nullable|string|max:500',
            'cv_tr_custom' => 'nullable|string|max:500',
            'social_links' => 'nullable',
            'order' => 'nullable|integer',
            'is_active' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        // Update avatar if provided
        if ($request->hasFile('avatar')) {
            if ($member->avatar && Storage::disk('public')->exists($member->avatar)) {
                Storage::disk('public')->delete($member->avatar);
            }
            $member->avatar = $request->file('avatar')->store('members/avatars', 'public');
        } elseif ($request->filled('avatar_url_custom')) {
            $member->avatar = $request->input('avatar_url_custom');
        } elseif ($request->has('remove_avatar') && filter_var($request->input('remove_avatar'), FILTER_VALIDATE_BOOLEAN)) {
            if ($member->avatar && Storage::disk('public')->exists($member->avatar)) {
                Storage::disk('public')->delete($member->avatar);
            }
            $member->avatar = null;
        }

        // Update CV EN
        if ($request->hasFile('cv_en')) {
            if ($member->cv_en && Storage::disk('public')->exists($member->cv_en)) {
                Storage::disk('public')->delete($member->cv_en);
            }
            $member->cv_en = $request->file('cv_en')->store('members/cv', 'public');
        } elseif ($request->filled('cv_en_custom')) {
            $member->cv_en = $request->input('cv_en_custom');
        } elseif ($request->has('remove_cv_en') && filter_var($request->input('remove_cv_en'), FILTER_VALIDATE_BOOLEAN)) {
            if ($member->cv_en && Storage::disk('public')->exists($member->cv_en)) {
                Storage::disk('public')->delete($member->cv_en);
            }
            $member->cv_en = null;
        }

        // Update CV TR
        if ($request->hasFile('cv_tr')) {
            if ($member->cv_tr && Storage::disk('public')->exists($member->cv_tr)) {
                Storage::disk('public')->delete($member->cv_tr);
            }
            $member->cv_tr = $request->file('cv_tr')->store('members/cv', 'public');
        } elseif ($request->filled('cv_tr_custom')) {
            $member->cv_tr = $request->input('cv_tr_custom');
        } elseif ($request->has('remove_cv_tr') && filter_var($request->input('remove_cv_tr'), FILTER_VALIDATE_BOOLEAN)) {
            if ($member->cv_tr && Storage::disk('public')->exists($member->cv_tr)) {
                Storage::disk('public')->delete($member->cv_tr);
            }
            $member->cv_tr = null;
        }

        // Update basic fields
        $member->name = $request->input('name');
        if ($request->filled('slug')) {
            $member->slug = Str::slug($request->input('slug'));
        }
        $member->role_en = $request->input('role_en');
        $member->role_tr = $request->input('role_tr');
        $member->bio_en = $request->input('bio_en');
        $member->bio_tr = $request->input('bio_tr');
        $member->body_en = $request->input('body_en');
        $member->body_tr = $request->input('body_tr');
        $member->phone = $request->input('phone');

        if ($request->has('emails')) {
            $member->emails = $this->normalizeArrayField($request->input('emails'));
        }

        if ($request->has('social_links')) {
            $member->social_links = $this->normalizeJsonField($request->input('social_links'));
        }

        if ($request->has('order') && $request->input('order') !== null && $request->input('order') !== '') {
            $member->order = (int) $request->input('order');
        }

        if ($request->has('is_active')) {
            $member->is_active = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->has('is_director')) {
            $isDirector = filter_var($request->input('is_director'), FILTER_VALIDATE_BOOLEAN);
            if ($isDirector) {
                LabMember::where('id', '!=', $member->id)->update(['is_director' => false]);
            }
            $member->is_director = $isDirector;
        }

        $member->save();

        return response()->json([
            'status' => true,
            'message' => 'Laboratuvar üyesi başarıyla güncellendi.',
            'member' => $member,
        ]);
    }

    /**
     * Delete a member.
     */
    public function destroy($id)
    {
        $member = LabMember::find($id);
        if (!$member) {
            return response()->json([
                'status' => false,
                'message' => 'Üye bulunamadı.',
            ], 404);
        }

        // Remove files
        if ($member->avatar && Storage::disk('public')->exists($member->avatar)) {
            Storage::disk('public')->delete($member->avatar);
        }
        if ($member->cv_en && Storage::disk('public')->exists($member->cv_en)) {
            Storage::disk('public')->delete($member->cv_en);
        }
        if ($member->cv_tr && Storage::disk('public')->exists($member->cv_tr)) {
            Storage::disk('public')->delete($member->cv_tr);
        }

        $member->delete();

        return response()->json([
            'status' => true,
            'message' => 'Laboratuvar üyesi silindi.',
        ]);
    }

    /**
     * Toggle member active status.
     */
    public function toggleStatus($id)
    {
        $member = LabMember::find($id);
        if (!$member) {
            return response()->json([
                'status' => false,
                'message' => 'Üye bulunamadı.',
            ], 404);
        }

        $member->is_active = !$member->is_active;
        $member->save();

        return response()->json([
            'status' => true,
            'message' => $member->is_active ? 'Üye yayına alındı.' : 'Üye pasife alındı.',
            'is_active' => $member->is_active,
        ]);
    }

    /**
     * Toggle director status (only one member can be director at a time).
     */
    public function toggleDirector($id)
    {
        $member = LabMember::find($id);
        if (!$member) {
            return response()->json([
                'status' => false,
                'message' => 'Üye bulunamadı.',
            ], 404);
        }

        $newDirectorState = !$member->is_director;
        if ($newDirectorState) {
            LabMember::where('id', '!=', $member->id)->update(['is_director' => false]);
        }

        $member->is_director = $newDirectorState;
        $member->save();

        return response()->json([
            'status' => true,
            'message' => $newDirectorState ? 'Üye laboratuvar direktörü olarak atandı.' : 'Direktörlük görevi kaldırıldı.',
            'is_director' => $member->is_director,
        ]);
    }

    /**
     * Reorder members.
     */
    public function reorder(Request $request)
    {
        $items = $request->input('items', []);
        if (is_array($items)) {
            foreach ($items as $index => $item) {
                if (is_array($item) && isset($item['id'])) {
                    LabMember::where('id', $item['id'])->update(['order' => $item['order'] ?? $index]);
                } elseif (is_numeric($item)) {
                    LabMember::where('id', $item)->update(['order' => $index + 1]);
                }
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Sıralama güncellendi.',
        ]);
    }

    /**
     * Helper to normalize array fields (e.g. emails).
     */
    private function normalizeArrayField($value): ?array
    {
        if (empty($value)) {
            return null;
        }

        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return array_values(array_filter(array_map('trim', $decoded)));
            }
            // Comma or newline separated
            $parts = preg_split('/[\r\n,]+/', $value);
            return array_values(array_filter(array_map('trim', $parts)));
        }

        if (is_array($value)) {
            return array_values(array_filter(array_map('trim', $value)));
        }

        return null;
    }

    /**
     * Helper to normalize JSON fields (e.g. social_links).
     */
    private function normalizeJsonField($value): ?array
    {
        if (empty($value)) {
            return null;
        }

        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return $decoded;
            }
            return null;
        }

        if (is_array($value)) {
            return $value;
        }

        return null;
    }
}
