<?php

namespace Database\Seeders;

use App\Models\LabMember;
use Illuminate\Database\Seeder;

class LabMemberSeeder extends Seeder
{
    public function run(): void
    {
        if (LabMember::count() === 0) {
            LabMember::create([
                'name' => 'Dr. Deniz Aksoy',
                'role_en' => 'Postdoctoral Researcher',
                'role_tr' => 'Doktora Sonrası Araştırmacı',
                'bio_en' => 'Specializes in immunoaffinity cryogels, polymeric microcarriers, and therapeutic apheresis columns.',
                'bio_tr' => 'İmmünoafinite kriyojelleri, polimerik mikrotaşıyıcılar ve terapötik aferez kolonları üzerine araştırmalar yürütmektedir.',
                'phone' => '+90 (312) 297 68 00',
                'emails' => ['deniz.aksoy@biochemreg.org', 'daksoy@hacettepe.edu.tr'],
                'avatar' => null,
                'cv_en' => null,
                'cv_tr' => null,
                'social_links' => [
                    'scholar' => 'https://scholar.google.com/citations?user=sample1',
                    'orcid' => 'https://orcid.org/0000-0002-1825-0097',
                    'linkedin' => 'https://linkedin.com/in/denizaksoy',
                    'researchgate' => 'https://researchgate.net/profile/Deniz-Aksoy',
                ],
                'order' => 1,
                'is_active' => true,
            ]);

            LabMember::create([
                'name' => 'Mert Kaya',
                'role_en' => 'Ph.D. Candidate',
                'role_tr' => 'Doktora Adayı',
                'bio_en' => 'Focuses on biocompatible electrospun nanofiber meshes and surface functionalization for stem cell differentiation.',
                'bio_tr' => 'Biyouyumlu elektroeğrilmiş nanolif ağlar ve kök hücre farklılaşması için yüzey fonksiyonelleştirmesi üzerine odaklanmaktadır.',
                'phone' => '+90 (312) 297 68 01',
                'emails' => ['mert.kaya@biochemreg.org'],
                'avatar' => null,
                'cv_en' => null,
                'cv_tr' => null,
                'social_links' => [
                    'scholar' => 'https://scholar.google.com/citations?user=sample2',
                    'github' => 'https://github.com/mertkaya',
                    'linkedin' => 'https://linkedin.com/in/mertkaya',
                ],
                'order' => 2,
                'is_active' => true,
            ]);

            LabMember::create([
                'name' => 'Selin Çelik',
                'role_en' => 'Ph.D. Candidate',
                'role_tr' => 'Doktora Adayı',
                'bio_en' => 'Researching targeted drug delivery systems, stimuli-responsive nanoparticles, and controlled release dynamics.',
                'bio_tr' => 'Hedefli ilaç salım sistemleri, uyarılara duyarlı nanopartiküller ve kontrollü salım dinamikleri üzerinde çalışmaktadır.',
                'phone' => '+90 (312) 297 68 02',
                'emails' => ['selin.celik@biochemreg.org'],
                'avatar' => null,
                'cv_en' => null,
                'cv_tr' => null,
                'social_links' => [
                    'scholar' => 'https://scholar.google.com/citations?user=sample3',
                    'orcid' => 'https://orcid.org/0000-0003-3456-7890',
                ],
                'order' => 3,
                'is_active' => true,
            ]);

            LabMember::create([
                'name' => 'Arda Yıldız',
                'role_en' => 'M.Sc. Student',
                'role_tr' => 'Yüksek Lisans Öğrencisi',
                'bio_en' => 'Synthesizing novel biomimetic polymers and studying protein-material interfacial interactions.',
                'bio_tr' => 'Yeni biyomimetik polimerler sentezlemekte ve protein-materyal arayüz etkileşimlerini incelemektedir.',
                'phone' => '+90 (312) 297 68 03',
                'emails' => ['arda.yildiz@biochemreg.org'],
                'avatar' => null,
                'cv_en' => null,
                'cv_tr' => null,
                'social_links' => [
                    'scholar' => 'https://scholar.google.com/citations?user=sample4',
                    'linkedin' => 'https://linkedin.com/in/ardayildiz',
                ],
                'order' => 4,
                'is_active' => true,
            ]);
        }
    }
}
