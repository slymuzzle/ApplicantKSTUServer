<?php

namespace App\Orchid\Screens\ContentTreeEditor;

use App\View\Components\ContentTreeEditor;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Illuminate\Http\Request;
use App\Models\ApplicantInfoTree;
use App\Models\File;
use Illuminate\Support\Facades\Storage;

class ContentTreeEditorMainScreen extends Screen
{
    /**
     * @var ApplicantInfoTree
     */
    public $infoTree;

    /**
     * Query data.
     *
     * @return array
     */
    public function query(ApplicantInfoTree $infoTree): array
    {
        return [
            'tree' => $infoTree->defaultOrder()->withDepth()->get()->toTree(),
        ];
    }

    /**
     * Display header name.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return 'Контент';
    }

    /**
     * Display header description.
     *
     * @return string|null
     */
    public function description(): ?string
    {
        return 'Управление контентом';
    }

    /**
     * Button commands.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): iterable
    {
        return [];
    }

    /**
     * Views.
     *
     * @return \Orchid\Screen\Layout[]|string[]
     */
    public function layout(): iterable
    {
        return [
            Layout::component(ContentTreeEditor::class),
        ];
    }

    public function saveTree(ApplicantInfoTree $infoTree, Request $request)
    {
        $tree = $request->all();
        $infoTree->rebuildTree($tree);

        return [
            'tree' => $infoTree->defaultOrder()->withDepth()->get()->toTree(),
        ];
    }

    public function createNode(ApplicantInfoTree $infoTree, Request $request)
    {
        $data = $request->all();

        $parentNodeId = $data['parentNode']['id'] ?? null;

        $parentNode = [];
        if ($parentNodeId) {
            $parentNode = $infoTree->find($parentNodeId);
        }

        if (!empty($parentNode)) {
            $createdNode = $infoTree->create($data['nodeForm'], $parentNode);
        } else {
            $createdNode = $infoTree->create($data['nodeForm']);
        }

        return [
            'createdNode' => $createdNode,
            'tree' => $infoTree->defaultOrder()->withDepth()->get()->toTree(),
        ];
    }

    public function saveNode(ApplicantInfoTree $infoTree, Request $request)
    {
        $data = $request->all();

        $node = $infoTree->find($data['node']['id']) ?? null;
        if ($node) {
            $node->title = $data['nodeForm']['title'];
            $node->description = $data['nodeForm']['description'];
            if (isset($data['nodeForm']['content'])) {
                $node->content = $data['nodeForm']['content'];
            }
            $node->save();
        }

        return [
            'tree' => $infoTree->defaultOrder()->withDepth()->get()->toTree(),
        ];
    }

    public function deleteNode(ApplicantInfoTree $infoTree, Request $request)
    {
        $data = $request->all();

        $node = $infoTree->find($data['nodeId']);
        if ($node) {
            $node->delete();
        }

        return [
            'tree' => $infoTree->defaultOrder()->withDepth()->get()->toTree(),
        ];
    }

    public function getNodeContent(ApplicantInfoTree $infoTree, Request $request)
    {
        $data = $request->all();

        $node = $infoTree->find($data['nodeId']);

        return [
            'content' => $node['content'],
        ];
    }

    public function uploadFile(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf,jpg,jpeg,png',
        ]);

        $fileModel = new File;
        if ($request->file()) {
            $fileName = time() . '_' . $request->file->hashName();
            $filePath = $request->file('file')->storeAs('uploads', $fileName, 'public');
            $fileModel->name = time() . '_' . $request->file->getClientOriginalName();
            $fileModel->file_path = '/storage/' . $filePath;
            $fileModel->save();

            $originalName = $request->file->getClientOriginalName();

            $file = [
                'title' => substr($originalName, 0, strrpos($originalName, ".")),
                'name' => $fileName,
                'size' => $request->file->getSize(),
                'extension' => $request->file->getClientOriginalExtension(),
                'url' => asset(Storage::url($filePath)),
            ];

            return compact('file');
        }
    }
}
