<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Creneau;
use Carbon\Carbon;

class CreneauSeeder extends Seeder
{
    public function run()
    {
        $jours = 5; // Nombre de jours à générer
        $heures = [
            ['09:00:00', '11:00:00'],
            ['11:30:00', '13:30:00'],
            ['14:00:00', '16:00:00'],
            ['16:30:00', '18:30:00']
        ];

        $salleIds = range(1, 10); // IDs des 10 salles
        $today = Carbon::now();

        $creneaux = [];

        foreach ($salleIds as $salleId) {
            for ($j = 0; $j < $jours; $j++) {
                $date = $today->copy()->addDays($j)->format('Y-m-d');
                foreach ($heures as $plage) {
                    $creneaux[] = [
                        'salle_id' => $salleId,
                        'date' => $date,
                        'heure_debut' => $plage[0],
                        'heure_fin' => $plage[1],
                        'disponible' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        Creneau::insert($creneaux);
    }
}
