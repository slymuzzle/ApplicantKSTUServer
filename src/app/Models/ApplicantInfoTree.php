<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

class ApplicantInfoTree extends Model
{
    use HasFactory, NodeTrait;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'applicant_info_tree';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'content',
        'description',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['content'];
}
