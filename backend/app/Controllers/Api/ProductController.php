<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use App\Models\ProductModel;

class ProductController extends ResourceController
{
    protected $modelName = ProductModel::class;
    protected $format    = 'json';

    public function index()
    {
        $model = new ProductModel();
        return $this->respond([
            'status' => 200,
            'data' => $model->getProductsWithDetails()
        ]);
    }

    public function show($id = null)
    {
        $model = new ProductModel();
        $data = $model->getProductsWithDetails($id);
        if ($data) {
            return $this->respond(['status' => 200, 'data' => $data]);
        }
        return $this->failNotFound('Product not found');
    }

    public function create()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        
        if ($this->model->insert($data)) {
            $data['id'] = $this->model->getInsertID();
            return $this->respondCreated(['status' => 201, 'message' => 'Product created', 'data' => $data]);
        }
        
        return $this->failValidationErrors($this->model->errors());
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();
        
        if ($this->model->update($id, $data)) {
            return $this->respond(['status' => 200, 'message' => 'Product updated successfully', 'data' => $data]);
        }
        
        return $this->failValidationErrors($this->model->errors());
    }

    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['status' => 200, 'message' => 'Product deleted successfully']);
        }
        
        return $this->failServerError('Failed to delete product');
    }
}
