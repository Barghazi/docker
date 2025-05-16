<?php

namespace App\Http\Controllers;

use App\Models\Equipement;
use Illuminate\Http\Request;

class EquipementController extends Controller
{
    // Affiche la liste de tous les équipements
    public function index()
    {
        $equipements = Equipement::all();
        return response()->json($equipements);
    }

    // Crée un nouvel équipement
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $equipement = Equipement::create($validated);

        return response()->json([
            'message' => 'Équipement créé avec succès',
            'equipement' => $equipement
        ], 201);
    }

    // Affiche un équipement en particulier
    public function show($id)
    {
        $equipement = Equipement::find($id);

        if (!$equipement) {
            return response()->json(['message' => 'Équipement non trouvé'], 404);
        }

        return response()->json($equipement);
    }

    // Met à jour un équipement existant
    public function update(Request $request, $id)
    {
        $equipement = Equipement::find($id);

        if (!$equipement) {
            return response()->json(['message' => 'Équipement non trouvé'], 404);
        }

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $equipement->update($validated);

        return response()->json([
            'message' => 'Équipement mis à jour avec succès',
            'equipement' => $equipement
        ]);
    }

    // Supprime un équipement
    public function destroy($id)
    {
        $equipement = Equipement::find($id);

        if (!$equipement) {
            return response()->json(['message' => 'Équipement non trouvé'], 404);
        }

        $equipement->delete();

        return response()->json(['message' => 'Équipement supprimé avec succès']);
    }
}
