<?php

namespace App\Http\Controllers;

use App\Models\Salle;
use Illuminate\Http\Request;

class SalleController extends Controller
{
    public function index()
    {
        return Salle::all();
        foreach ($salles as $salle) {
        $salle->image = asset('images/' . $salle->image); // Assurez-vous que le chemin de l'image est correctement retourné
    }
    return response()->json($salles);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required',
            'type' => 'required',
            'capacité' => 'required|integer',
            'équipement' => 'nullable',
            'localisation' => 'required',
        ]);

        return Salle::create($validated);
    }

    public function show(Salle $salle)
    {
        return $salle;
    }

    public function update(Request $request, Salle $salle)
    {
        $salle->update($request->all());
        return $salle;
    }

    public function destroy(Salle $salle)
    {
        $salle->delete();
        return response()->noContent();
    }

  public function rechercher(Request $request)
{
    $type = $request->input('type');
    $date = $request->input('date');
    $heureDebut = $request->input('heure_debut');
    $heureFin = $request->input('heure_fin');

    $salles = Salle::where('type', $type)
        ->whereDoesntHave('creneaux', function ($query) use ($date, $heureDebut, $heureFin) {
            if ($date) {
                $query->where('date', $date);
            }

            // Vérifie que les deux heures sont bien présentes
            if ($heureDebut && $heureFin) {
                $query->where(function ($q) use ($heureDebut, $heureFin) {
                    $q->whereBetween('heure_debut', [$heureDebut, $heureFin])
                      ->orWhereBetween('heure_fin', [$heureDebut, $heureFin])
                      ->orWhere(function ($q) use ($heureDebut, $heureFin) {
                          $q->where('heure_debut', '<=', $heureDebut)
                            ->where('heure_fin', '>=', $heureFin);
                      });
                });
            }
        })
        ->get();

    return response()->json($salles);
}

public function getTypes()
{
    // Utilisation d'un simple pluck pour récupérer les types distincts
    $types = Salle::distinct()->pluck('type');
    return response()->json($types);
}
}
