<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SliderController extends Controller
{
    /**
     * Public index for website homepage (only active sliders).
     */
    public function index(Request $request)
    {
        $locale = strtolower($request->query('locale', $request->header('X-Locale', 'en')));
        if (!in_array($locale, ['en', 'tr'])) {
            $locale = 'en';
        }

        $sliders = Slider::where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($slider) use ($locale) {
                $slider->title = $slider->getTranslatedTitle($locale);
                $slider->text = $slider->getTranslatedText($locale);
                return $slider;
            });

        return response()->json([
            'status' => true,
            'locale' => $locale,
            'sliders' => $sliders,
        ]);
    }

    /**
     * Admin index (all sliders).
     */
    public function adminIndex()
    {
        $sliders = Slider::orderBy('order', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'sliders' => $sliders,
        ]);
    }

    /**
     * Store a newly created slider.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'title_tr' => 'nullable|string|max:255',
            'text' => 'nullable|string',
            'text_en' => 'nullable|string',
            'text_tr' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:10240',
            'image_url_custom' => 'nullable|string|max:500',
            'link' => 'nullable|string|max:500',
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

        $textEn = $request->input('text_en') ?: $request->input('text');
        $textTr = $request->input('text_tr');
        if (empty($textEn) && empty($textTr)) {
            return response()->json([
                'status' => false,
                'message' => 'Lütfen en az bir dilde (İngilizce veya Türkçe) slayt metni girin.',
            ], 422);
        }

        $titleEn = $request->input('title_en') ?: $request->input('title');
        $titleTr = $request->input('title_tr');

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('sliders', 'public');
        } elseif ($request->filled('image_url_custom')) {
            $imagePath = $request->image_url_custom;
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Lütfen bir görsel dosyası yükleyin veya geçerli bir görsel URL/yolu belirtin.',
            ], 422);
        }

        $isActive = true;
        if ($request->has('is_active')) {
            $isActive = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        $slider = Slider::create([
            'title' => $titleEn ?: $titleTr,
            'title_en' => $titleEn,
            'title_tr' => $titleTr,
            'text' => $textEn ?: $textTr,
            'text_en' => $textEn,
            'text_tr' => $textTr,
            'image' => $imagePath,
            'link' => $request->link,
            'order' => $request->input('order', 0) ?? 0,
            'is_active' => $isActive,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Slider başarıyla eklendi.',
            'slider' => $slider,
        ], 201);
    }

    /**
     * Display the specified slider.
     */
    public function show(string $id)
    {
        $slider = Slider::findOrFail($id);

        return response()->json([
            'status' => true,
            'slider' => $slider,
        ]);
    }

    /**
     * Update the specified slider.
     */
    public function update(Request $request, string $id)
    {
        $slider = Slider::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'title_tr' => 'nullable|string|max:255',
            'text' => 'nullable|string',
            'text_en' => 'nullable|string',
            'text_tr' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:10240',
            'image_url_custom' => 'nullable|string|max:500',
            'link' => 'nullable|string|max:500',
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

        if ($request->hasFile('image')) {
            // Delete previous storage file if it exists and is not a default preset
            if ($slider->image && !str_starts_with($slider->image, 'http') && !str_starts_with($slider->image, '/images')) {
                Storage::disk('public')->delete($slider->image);
            }
            $slider->image = $request->file('image')->store('sliders', 'public');
        } elseif ($request->filled('image_url_custom')) {
            $slider->image = $request->image_url_custom;
        }

        $textEn = $request->has('text_en') ? $request->input('text_en') : ($request->input('text') ?: $slider->text_en);
        $textTr = $request->has('text_tr') ? $request->input('text_tr') : $slider->text_tr;
        $titleEn = $request->has('title_en') ? $request->input('title_en') : ($request->input('title') ?: $slider->title_en);
        $titleTr = $request->has('title_tr') ? $request->input('title_tr') : $slider->title_tr;

        if (empty($textEn) && empty($textTr) && empty($slider->text)) {
            return response()->json([
                'status' => false,
                'message' => 'Lütfen en az bir dilde slayt metni girin.',
            ], 422);
        }

        $slider->title_en = $titleEn;
        $slider->title_tr = $titleTr;
        $slider->title = $titleEn ?: ($titleTr ?: $slider->title);
        $slider->text_en = $textEn;
        $slider->text_tr = $textTr;
        $slider->text = $textEn ?: ($textTr ?: $slider->text);
        $slider->link = $request->link;

        if ($request->has('order')) {
            $slider->order = $request->input('order', 0) ?? 0;
        }

        if ($request->has('is_active')) {
            $slider->is_active = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        $slider->save();

        return response()->json([
            'status' => true,
            'message' => 'Slider başarıyla güncellendi.',
            'slider' => $slider,
        ]);
    }

    /**
     * Remove the specified slider.
     */
    public function destroy(string $id)
    {
        $slider = Slider::findOrFail($id);

        if ($slider->image && !str_starts_with($slider->image, 'http') && !str_starts_with($slider->image, '/images')) {
            Storage::disk('public')->delete($slider->image);
        }

        $slider->delete();

        return response()->json([
            'status' => true,
            'message' => 'Slider başarıyla silindi.',
        ]);
    }

    /**
     * Toggle active/inactive status.
     */
    public function toggleStatus(string $id)
    {
        $slider = Slider::findOrFail($id);
        $slider->is_active = !$slider->is_active;
        $slider->save();

        return response()->json([
            'status' => true,
            'message' => 'Slider durumu güncellendi.',
            'is_active' => $slider->is_active,
            'slider' => $slider,
        ]);
    }

    /**
     * Reorder sliders.
     */
    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'orders' => 'required|array',
            'orders.*.id' => 'required|integer|exists:sliders,id',
            'orders.*.order' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        foreach ($request->orders as $item) {
            Slider::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Sıralama başarıyla kaydedildi.',
        ]);
    }
}
