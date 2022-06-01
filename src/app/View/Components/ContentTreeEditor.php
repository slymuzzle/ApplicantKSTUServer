<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Kalnoy\Nestedset\Collection;

class ContentTreeEditor extends Component
{
    /**
     * @var string
     */
    public $tree;

    /**
     * Create a new component instance.
     *
     * @param Collection $infoTree
     */
    public function __construct(Collection $tree)
    {
        $this->tree = $tree;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.content-tree-editor');
    }
}
