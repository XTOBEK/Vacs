<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAboutContactSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            // About Section
            $table->string('about_hero_title')->nullable();
            $table->string('about_hero_subtitle')->nullable();
            $table->text('about_mission_statement')->nullable();
            $table->text('about_vision_statement')->nullable();
            $table->json('about_core_values')->nullable();
            $table->string('about_banner_image_path')->nullable();
            
            // Contact Section
            $table->string('contact_primary_phone')->nullable();
            $table->string('contact_emergency_phone')->nullable();
            $table->string('contact_general_email')->nullable();
            $table->text('contact_physical_address')->nullable();
            $table->text('contact_maps_embed_url')->nullable();
            $table->json('contact_social_media_links')->nullable();
            
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
        Schema::dropIfExists('site_settings');
    }
}
