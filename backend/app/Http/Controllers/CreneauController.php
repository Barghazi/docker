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



public function getBySalle($id)
{
    return response()->json(
        Creneau::where('salle_id', $id)
                ->where('disponible', true)
                ->get()
    );
}
public function reserver(Request $request)
    {
        $creneauId = $request->input('creneau_id');
        $creneau = Creneau::find($creneauId);

        if (!$creneau) {
            return response()->json(['message' => 'Créneau non trouvé.'], 404);
        }

        $creneau->disponible = false;
        $creneau->save(); // Assure-toi de bien appeler save() ici

        return response()->json(['message' => 'Créneau marqué comme indisponible.']);
    }
    public function liberer(Request $request)
{
    $creneauId = $request->input('creneau_id');

    $creneau = Creneau::find($creneauId);

    if (!$creneau) {
        return response()->json(['message' => 'Créneau introuvable.'], 404);
    }

    $creneau->disponible = true;
    $creneau->save();

    return response()->json(['message' => 'Créneau libéré avec succès.']);
}

}





