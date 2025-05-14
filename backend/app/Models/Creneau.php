<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Creneau extends Model
{
    use HasFactory;
    protected $table = 'creneaux';

    protected $fillable = ['salle_id', 'date', 'heure_début', 'heure_fin'];

    public function salle()
    {
        return $this->belongsTo(Salle::class);
    }
}

