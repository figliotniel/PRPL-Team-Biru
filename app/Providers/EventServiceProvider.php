<?php

namespace App\Providers;

use App\Models\TanahKasDesa;
use App\Observers\TanahKasDesaObserver;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event; // Pastikan 'Event' di-import jika Anda menggunakannya

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        // ...
    ];

    /**
     * The model observers for your application.
     *
     * @var array
     */
    protected $observers = [
        TanahKasDesa::class => [TanahKasDesaObserver::class],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }
}