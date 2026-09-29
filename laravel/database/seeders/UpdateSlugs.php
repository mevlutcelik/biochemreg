<?php

namespace Database\Seeders;

use App\Models\LabMember;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UpdateSlugs extends Seeder
{
    public function run(): void
    {
        foreach (LabMember::all() as $m) {
            $m->slug = Str::slug($m->name);
            $m->save();
            echo $m->id . ': ' . $m->name . ' -> ' . $m->slug . PHP_EOL;
        }
    }
}
