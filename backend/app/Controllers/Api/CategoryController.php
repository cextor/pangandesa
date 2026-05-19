<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use App\Models\CategoryModel;

class CategoryController extends ResourceController
{
    protected $modelName = CategoryModel::class;
    protected $format    = 'json';

    public function index()
    {
        return $this->respond([
            'status' => 200,
            'data' => $this->model->findAll()
        ]);
    }
}
