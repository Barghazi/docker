<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('creneaux', function (Blueprint $table) {
    $table->id();
    $table->foreignId('salle_id')->constrained('salles');
    $table->date('date');
    $table->time('heure_debut');
    $table->time('heure_fin');
    $table->boolean('disponible')->default(true); // ici
    $table->timestamps();
});


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('creneaux');
    }
};
