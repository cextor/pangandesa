<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use App\Models\BuyerRequestModel;

class BuyerRequestController extends ResourceController
{
    protected $modelName = BuyerRequestModel::class;
    protected $format    = 'json';

    public function index()
    {
        return $this->respond([
            'status' => 200,
            'data' => $this->model->orderBy('created_at', 'DESC')->findAll()
        ]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        if ($this->model->insert($data)) {
            $data['id'] = $this->model->getInsertID();
            return $this->respondCreated(['status' => 201, 'message' => 'Request created', 'data' => $data]);
        }
        return $this->failValidationErrors($this->model->errors());
    }

    public function updateStatus($id = null)
    {
        $data = $this->request->getJSON(true);
        if ($this->model->update($id, ['status' => $data['status'], 'fulfilled_by' => $data['fulfilledBy'] ?? null])) {
            return $this->respond(['status' => 200, 'message' => 'Status updated']);
        }
        return $this->failServerError('Failed to update request');
    }
}
