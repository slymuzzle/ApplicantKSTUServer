<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ApplicantInfoTree;


class ApplicantInfoTreeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $parentNodes = ApplicantInfoTree::factory()
            ->count(5)
            ->create(
                [
                    'title' => 'TestName',
                    'md_content' => 'Test',
                    'description' => 'Test',
                ]
            );

        for ($i = 0; $i <= 2; $i++) {
            $node = $parentNodes[$i]->children()->create(
                [
                    'title' => 'TestName',
                    'md_content' => 'Child Test',
                    'description' => 'Child Test',
                ]
            );

            if ($i === 0) {
                $node->children()->create(
                    [
                        'title' => 'TestName',
                        'md_content' => 'Child Test',
                        'description' => 'Child Test',
                    ]
                );
            }
        }
    }
}
