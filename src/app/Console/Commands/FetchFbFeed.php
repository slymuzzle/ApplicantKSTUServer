<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\FetchFbFeedJob;

class FetchFbFeed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fb:fetch-feed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch facebook page feed';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @param  App\Jobs\FetchFbFeedJob  $job
     *
     * @return int
     */
    public function handle(FetchFbFeedJob $job)
    {
        $job->dispatch();
    }
}
