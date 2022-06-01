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
        Schema::create('fb_feed', function (Blueprint $table) {
            $table->id();
            $table->string('post_id')->nullable();
            $table->json('post_data')->nullable();
            $table->dateTime('post_updated_time')->nullable();
            $table->timestamps();
            $table->unique(['post_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fb_feed');
    }
};
