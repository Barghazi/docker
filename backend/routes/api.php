<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SalleController;
use App\Http\Controllers\CreneauController;
use App\Http\Controllers\EquipementController;




Route::apiResource('equipements', EquipementController::class);

Route::apiResource('salles', SalleController::class); // Gère toutes les actions CRUD sur "salles"
Route::get('salles-recherche', [SalleController::class, 'rechercher']); // Recherche spécifique
Route::post('/salles-recherche', [SalleController::class, 'rechercher']);

Route::get('/types', [SalleController::class, 'getTypes']); // Récupération des types de salles

 // Gère toutes les actions CRUD sur "creneaux"


// routes/api.php (Laravel)
Route::get('/creneaux/disponibles', [CreneauController::class, 'disponibles']);

Route::post('/creneaux/reserver', [CreneauController::class, 'reserver']);



// routes/api.php
Route::get('/creneaux/salle/{id}', [CreneauController::class, 'getBySalle']);
Route::post('/creneaux/liberer', [CreneauController::class, 'liberer']);


