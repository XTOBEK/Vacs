<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCarePlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('care_plans', function (Blueprint $table) {
            $table->id();
            $table->string('plan_title');
            $table->string('target_audience'); // e.g. 'Elderly', 'Post-Op'
            $table->json('core_features'); // array of bullet points
            $table->boolean('status')->default(true); // true = Active, false = Hidden
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
        Schema::dropIfExists('care_plans');
    }
}
