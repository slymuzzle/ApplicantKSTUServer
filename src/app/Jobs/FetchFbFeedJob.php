<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Xmhafiz\FbFeed\FbFeed as FbFeedFetcher;
use App\Models\FbFeed;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class FetchFbFeedJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(FbFeed $feed, FbFeedFetcher $feedFetcher)
    {
        $feedData = $feedFetcher
            ->make(config('facebook'))
            ->fields([
                'id',
                'message',
                'permalink_url',
                'full_picture',
                'attachments',
                'created_time',
                'updated_time',
            ])
            ->feedLimit(100)
            ->fetch();

        foreach ($feedData['data'] as $post) {
            $feed->updateOrCreate(
                [
                    'post_id' => $post['id']
                ],
                [
                    'post_data' => json_encode($post),
                    'post_updated_time' => date(
                        'Y-m-d H:i:s',
                        strtotime($post['updated_time'])
                    ),
                ],
            );
        }
    }
}
