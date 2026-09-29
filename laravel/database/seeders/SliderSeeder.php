<?php

namespace Database\Seeders;

use App\Models\Slider;
use Illuminate\Database\Seeder;

class SliderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $slides = [
            [
                'title' => 'Staj Eğitimi - Kırgızistan-Türkiye Manas Üniversitesi',
                'text' => 'Students from Kyrgyz-Turkish Manas University Faculty of Engineering, Ayday TOKTOGULOVA, Ayçolpon SADIROVA and Begimay TAŞTANOVA, came to our laboratory for their internship education between 04-19 August 2025.',
                'image' => '/images/bslide1.jpg',
                'link' => null,
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Biyomedikal Protokol Entegrasyonu',
                'text' => 'Our collaborative research team successfully completed the integration of new biomedical protocols during the winter session.',
                'image' => '/images/Kirgiz-2.jpg',
                'link' => null,
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Yıllık Biyomalzemeler Konferansı',
                'text' => 'The Annual Biomaterials Conference brought together global experts to discuss future translational applications.',
                'image' => '/images/Toplu.jpg',
                'link' => null,
                'order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($slides as $slide) {
            Slider::updateOrCreate(
                ['image' => $slide['image']],
                $slide
            );
        }
    }
}
