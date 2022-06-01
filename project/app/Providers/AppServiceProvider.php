<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Orchid\Platform\Dashboard;
use Orchid\Icons\IconFinder;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(Dashboard $dashboard, IconFinder $iconFinder)
    {
        $dashboard->registerResource('scripts', '/js/dashboard.js');
        $dashboard->registerResource('stylesheets', '/css/dashboard.css');

        $iconFinder->registerIconDirectory('assets', resource_path('assets'));
    }
}
