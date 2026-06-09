<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use App\Models\AddressModel;

class AddressController extends ResourceController
{
    protected $modelName = AddressModel::class;
    protected $format    = 'json';

    public function index()
    {
        $userId = $this->request->getVar('user_id');
        if ($userId) {
            $addresses = $this->model->where('user_id', $userId)->orderBy('is_default', 'DESC')->orderBy('id', 'DESC')->findAll();
        } else {
            $addresses = $this->model->findAll();
        }
        return $this->respond(['status' => 200, 'data' => $addresses]);
    }

    public function show($id = null)
    {
        $address = $this->model->find($id);
        if (!$address) {
            return $this->failNotFound('Alamat tidak ditemukan.');
        }
        return $this->respond(['status' => 200, 'data' => $address]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        if (empty($data['user_id']) || empty($data['type']) || empty($data['name']) || empty($data['phone']) || empty($data['street']) || empty($data['district']) || empty($data['city'])) {
            return $this->failValidationErrors('Data alamat tidak lengkap.');
        }

        $userId = $data['user_id'];
        
        // Check if user has any existing addresses
        $existingCount = $this->model->where('user_id', $userId)->countAllResults();
        if ($existingCount === 0) {
            $data['is_default'] = true;
        } else if (!empty($data['is_default']) && ($data['is_default'] == true || $data['is_default'] == 1)) {
            // Set all other addresses for this user to is_default = 0
            $this->model->where('user_id', $userId)->set(['is_default' => 0])->update();
            $data['is_default'] = true;
        } else {
            $data['is_default'] = false;
        }

        try {
            $this->model->insert($data);
            $newId = $this->model->insertID();
            $newAddress = $this->model->find($newId);
            return $this->respondCreated(['status' => 201, 'message' => 'Alamat berhasil ditambahkan.', 'data' => $newAddress]);
        } catch (\Exception $e) {
            return $this->failServerError('Gagal menambahkan alamat.');
        }
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $address = $this->model->find($id);
        if (!$address) {
            return $this->failNotFound('Alamat tidak ditemukan.');
        }

        $userId = $address['user_id'];

        if (isset($data['is_default']) && ($data['is_default'] == true || $data['is_default'] == 1)) {
            // Set all other addresses for this user to is_default = 0
            $this->model->where('user_id', $userId)->set(['is_default' => 0])->update();
            $data['is_default'] = true;
        }

        try {
            $this->model->update($id, $data);
            $updated = $this->model->find($id);
            return $this->respond(['status' => 200, 'message' => 'Alamat berhasil diperbarui.', 'data' => $updated]);
        } catch (\Exception $e) {
            return $this->failServerError('Gagal memperbarui alamat.');
        }
    }

    public function delete($id = null)
    {
        $address = $this->model->find($id);
        if (!$address) {
            return $this->failNotFound('Alamat tidak ditemukan.');
        }

        $userId = $address['user_id'];
        $wasDefault = $address['is_default'];

        $this->model->delete($id);

        // If the deleted address was default, set the first remaining address as default
        if ($wasDefault) {
            $firstRemaining = $this->model->where('user_id', $userId)->first();
            if ($firstRemaining) {
                $this->model->update($firstRemaining['id'], ['is_default' => 1]);
            }
        }

        return $this->respond(['status' => 200, 'message' => 'Alamat berhasil dihapus.']);
    }

    public function setDefault($id = null)
    {
        $address = $this->model->find($id);
        if (!$address) {
            return $this->failNotFound('Alamat tidak ditemukan.');
        }

        $userId = $address['user_id'];

        // Set all other addresses for this user to is_default = 0
        $this->model->where('user_id', $userId)->set(['is_default' => 0])->update();
        
        // Set this address to is_default = 1
        $this->model->update($id, ['is_default' => 1]);

        return $this->respond(['status' => 200, 'message' => 'Alamat utama berhasil diubah.']);
    }
}
