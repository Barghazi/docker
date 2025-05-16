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
    $request->validate([
    'nom' => 'required|string|max:255',
    'type' => 'required|string',
    'capacité' => 'required|integer',
    'équipement' => 'required|string',
    'localisation' => 'required|string',
    'image' => 'nullable|image|max:2048', // taille max 2 Mo
]);

    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $imageName = time() . '.' . $image->getClientOriginalExtension();
        $image->move(public_path('images/salles'), $imageName);
    } else {
        $imageName = null;
    }

    Salle::create([
        'nom' => $request->nom,
        'capacite' => $request->capacite,
        'type' => $request->type,
        'etat' => $request->etat,
        'image' => $imageName,
    ]);

    return response()->json(['message' => 'Salle ajoutée avec succès'], 201);
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
