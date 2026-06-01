<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use App\Models\PromoModel;

class PromoController extends ResourceController
{
    protected $modelName = PromoModel::class;
    protected $format    = 'json';

    public function index()
    {
        $promos = $this->model->orderBy('id', 'DESC')->findAll();
        return $this->respond(['status' => 200, 'data' => $promos]);
    }

    public function show($id = null)
    {
        $promo = $this->model->find($id);
        if (!$promo) {
            return $this->failNotFound('Promo tidak ditemukan.');
        }
        return $this->respond(['status' => 200, 'data' => $promo]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        
        if (empty($data['code']) || empty($data['title']) || !isset($data['discount_percent'])) {
            return $this->failValidationErrors('Data tidak lengkap (code, title, dan discount_percent wajib diisi).');
        }

        // Force uppercase for code
        $data['code'] = strtoupper(trim($data['code']));

        try {
            $this->model->insert($data);
            $newId = $this->model->insertID();
            $promo = $this->model->find($newId);
            return $this->respondCreated(['status' => 201, 'message' => 'Promo berhasil ditambahkan.', 'data' => $promo]);
        } catch (\Exception $e) {
            return $this->failServerError('Gagal menambahkan promo: Kode voucher mungkin sudah terdaftar.');
        }
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $promo = $this->model->find($id);
        if (!$promo) {
            return $this->failNotFound('Promo tidak ditemukan.');
        }

        if (isset($data['code'])) {
            $data['code'] = strtoupper(trim($data['code']));
        }

        try {
            $this->model->update($id, $data);
            $updated = $this->model->find($id);
            return $this->respond(['status' => 200, 'message' => 'Promo berhasil diperbarui.', 'data' => $updated]);
        } catch (\Exception $e) {
            return $this->failServerError('Gagal memperbarui promo.');
        }
    }

    public function delete($id = null)
    {
        $promo = $this->model->find($id);
        if (!$promo) {
            return $this->failNotFound('Promo tidak ditemukan.');
        }

        $this->model->delete($id);
        return $this->respond(['status' => 200, 'message' => 'Promo berhasil dihapus.']);
    }
}
