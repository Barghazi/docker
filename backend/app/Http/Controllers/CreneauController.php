<?php

namespace App\Http\Controllers;

use App\Models\Creneau;
use Illuminate\Http\Request;

class CreneauController extends Controller
{
    public function index()
    {
        return Creneau::with('salle')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'salle_id' => 'required|exists:salles,id',
            'date' => 'required|date',
            'heure_début' => 'required',
            'heure_fin' => 'required|after:heure_début',
        ]);

        return Creneau::create($validated);
    }

    public function destroy(Creneau $creneau)
    {
        $creneau->delete();
        return response()->noContent();
    }
    // app/Http/Controllers/CreneauController.php
public function disponibles(Request $request)
{
    // Vérifiez que vous obtenez bien les créneaux disponibles
    $creneaux = Creneau::where('date', '>=', now())->get();

    // Retourner la réponse (en JSON)
    return response()->json($creneaux);
}


public function reserver(Request $request)
{
    $creneau = Creneau::find($request->creneau_id);

    // ❗ Inverser la condition
    if (!$creneau || !$creneau->disponible) {
        return response()->json(['message' => 'Créneau non disponible'], 422);
    }

    // ✅ Marquer le créneau comme réservé
    $creneau->disponible = false;
    $creneau->save();

    return response()->json(['message' => 'Créneau réservé avec succès']);
}
public function getBySalle($id)
{
    return response()->json(
        Creneau::where('salle_id', $id)
                ->where('disponible', true)
                ->get()
    );
}

}

