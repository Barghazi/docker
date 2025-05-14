<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Salle;
use Illuminate\Support\Facades\Storage;

class SalleSeeder extends Seeder
{
    public function run()
    {
        Salle::insert([
            [
                'nom' => 'Salle de réunion A',
                'type' => 'Réunion',
                'capacité' => 10,
                'équipement' => 'vidéoprojecteur, tableau blanc',
                'localisation' => 'Bâtiment A, 1er étage',
                'image' => $this->storeImage('salle1.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Salle de cours B',
                'type' => 'Classe',
                'capacité' => 25,
                'équipement' => 'écran, wifi',
                'localisation' => 'Bâtiment B, 2e étage',
                'image' => $this->storeImage('salle2.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Bureau 101',
                'type' => 'Bureau',
                'capacité' => 3,
                'équipement' => 'PC, imprimante',
                'localisation' => 'Bâtiment C, RDC',
                'image' => $this->storeImage('salle3.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Salle informatique',
                'type' => 'Informatique',
                'capacité' => 20,
                'équipement' => 'ordinateurs, projecteur, wifi',
                'localisation' => 'Bâtiment D, 3e étage',
                'image' => $this->storeImage('salle4.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Laboratoire de chimie',
                'type' => 'Laboratoire',
                'capacité' => 15,
                'équipement' => 'paillasses, hottes, verrerie',
                'localisation' => 'Bâtiment E, 2e étage',
                'image' => $this->storeImage('salle5.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Amphithéâtre Z',
                'type' => 'Amphithéâtre',
                'capacité' => 100,
                'équipement' => 'micros, grand écran, sono',
                'localisation' => 'Bâtiment F, RDC',
                'image' => $this->storeImage('salle6.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Salle de réunion B',
                'type' => 'Réunion',
                'capacité' => 8,
                'équipement' => 'TV, paperboard',
                'localisation' => 'Bâtiment A, 2e étage',
                'image' => $this->storeImage('salle7.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Open Space',
                'type' => 'Espace partagé',
                'capacité' => 30,
                'équipement' => 'wifi, bureaux modulables',
                'localisation' => 'Bâtiment G, 1er étage',
                'image' => $this->storeImage('salle8.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Salle de visioconférence',
                'type' => 'Réunion',
                'capacité' => 12,
                'équipement' => 'caméra HD, micro, écran',
                'localisation' => 'Bâtiment H, RDC',
                'image' => $this->storeImage('salle9.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Salle de détente',
                'type' => 'Loisir',
                'capacité' => 15,
                'équipement' => 'canapés, baby-foot, machine à café',
                'localisation' => 'Bâtiment I, sous-sol',
                'image' => $this->storeImage('salle10.jpg'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    private function storeImage($filename)
    {
        return Storage::disk('public')->putFileAs(
            'images',
            new \Illuminate\Http\File(public_path('images/' . $filename)),
            $filename
        );
    }
}
