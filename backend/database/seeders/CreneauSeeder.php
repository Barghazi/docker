<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Creneau;

class CreneauSeeder extends Seeder
{
    public function run()
    {
        Creneau::insert([
            [
                'salle_id' => 1,
                'date' => '2025-05-15',
                'heure_debut' => '09:00:00',
                'heure_fin' => '11:00:00',
                'disponible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'salle_id' => 2,
                'date' => '2025-05-16',
                'heure_debut' => '14:00:00',
                'heure_fin' => '16:00:00',
                'disponible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'salle_id' => 3,
                'date' => '2025-05-17',
                'heure_debut' => '08:00:00',
                'heure_fin' => '10:00:00',
                'disponible' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
