<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EquipementSeeder extends Seeder
{
    public function run()
    {
        DB::table('equipements')->insert([
            ['nom' => 'Projecteur', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Microphone', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Tableau blanc', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
