<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class AuthController extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $rules = [
            'email' => 'required|valid_email',
            'password' => 'required'
        ];

        // For demo purposes, we will accept a 'role' parameter to just simulate login
        // If 'role' is passed without email, we auto login as demo user
        $role = $this->request->getVar('role');
        $userModel = new UserModel();

        if ($role) {
            $user = $userModel->where('role', $role)->first();
        } else {
            $email = $this->request->getVar('email');
            $password = $this->request->getVar('password');
            $user = $userModel->where('email', $email)->first();
            
            if (!$user || !password_verify($password, $user['password'])) {
                return $this->failUnauthorized('Invalid credentials');
            }
        }

        if (!$user) {
            return $this->failUnauthorized('Invalid credentials');
        }

        // Mock JWT generation
        $token = base64_encode(json_encode([
            'id' => $user['id'],
            'role' => $user['role'],
            'exp' => time() + 3600
        ]));

        return $this->respond([
            'status' => 200,
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'village' => $user['village'],
                'avatar' => $user['avatar']
            ]
        ]);
    }

    public function register()
    {
        try {
            $userModel = new UserModel();

            $rules = [
                'email'    => 'required|valid_email|is_unique[users.email]',
                'password' => 'required|min_length[6]',
                'role'     => 'required|in_list[buyer,seller]',
                'phone'    => 'required'
            ];

            if (!$this->validate($rules)) {
                $errors = $this->validator->getErrors();
                $friendlyErrors = [];
                foreach ($errors as $field => $err) {
                    if ($field === 'email') {
                        if (strpos($err, 'is_unique') !== false) {
                            $friendlyErrors[] = 'Alamat email ini sudah terdaftar. Silakan gunakan email lain atau langsung masuk ke akun Anda.';
                        } else {
                            $friendlyErrors[] = 'Format alamat email tidak valid.';
                        }
                    } else if ($field === 'password') {
                        $friendlyErrors[] = 'Kata sandi harus minimal 6 karakter.';
                    } else {
                        $friendlyErrors[] = $err;
                    }
                }
                return $this->failValidationErrors(['message' => implode(' ', $friendlyErrors)]);
            }

            $role = $this->request->getVar('role');
            $email = $this->request->getVar('email');
            $password = $this->request->getVar('password');
            $phone = $this->request->getVar('phone');
            
            // Dynamic inputs based on role
            $companyName = $this->request->getVar('company_name'); 
            $picName     = $this->request->getVar('pic_name');
            $address     = $this->request->getVar('address');
            $nib         = $this->request->getVar('nib');
            $npwp        = $this->request->getVar('npwp');
            $bankAccount = $this->request->getVar('bank_account');

            // Prepare data to insert
            $data = [
                'name'         => $picName ?? $companyName, 
                'email'        => $email,
                'password'     => password_hash($password, PASSWORD_BCRYPT),
                'role'         => $role,
                'phone'        => $phone,
                'address'      => $address,
                'company_name' => $companyName,
                'pic_name'     => $picName,
                'nib'          => $nib,
                'npwp'         => $npwp,
                'bank_account' => $role === 'seller' ? $bankAccount : null,
                'rating'       => 0.00
            ];

            if ($role === 'seller') {
                $data['village'] = $this->request->getVar('village') ?? 'Sukamaju';
            }

            if ($userModel->insert($data)) {
                $insertId = $userModel->getInsertID();
                $user = $userModel->find($insertId);

                // Mock JWT token
                $token = base64_encode(json_encode([
                    'id'   => $user['id'],
                    'role' => $user['role'],
                    'exp'  => time() + 3600
                ]));

                return $this->respondCreated([
                    'status'  => 201,
                    'message' => 'Registration successful',
                    'token'   => $token,
                    'user'    => [
                        'id'      => $user['id'],
                        'name'    => $user['name'],
                        'email'   => $user['email'],
                        'role'    => $user['role'],
                        'village' => $user['village'],
                        'avatar'  => $user['avatar']
                    ]
                ]);
            }

            return $this->failServerError('Gagal mendaftarkan akun. Silakan coba beberapa saat lagi.');

        } catch (\Throwable $e) {
            log_message('error', 'Registration error: ' . $e->getMessage());
            
            // Periksa jika error disebabkan karena kolom database belum diperbarui
            if (strpos($e->getMessage(), "Unknown column 'company_name'") !== false || strpos($e->getMessage(), "Unknown column") !== false) {
                return $this->respond([
                    'status'  => 500,
                    'error'   => 'Database Migration Required',
                    'message' => 'Sistem mendeteksi database Anda belum diperbarui. Harap klik atau buka alamat http://localhost:8081/setup_db.php di browser Anda sekali untuk memperbarui database secara otomatis, lalu coba mendaftar kembali.'
                ], 500);
            }

            return $this->respond([
                'status'  => 500,
                'error'   => 'Internal Server Error',
                'message' => 'Terjadi masalah teknis pada server database. Pastikan Anda sudah mengklik tautan berikut untuk memperbarui database: http://localhost:8081/setup_db.php.'
            ], 500);
        }
    }

    public function checkEmail()
    {
        $email = $this->request->getVar('email');
        if (!$email) {
            return $this->fail('Email is required');
        }

        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

        return $this->respond([
            'status' => 200,
            'exists' => $user ? true : false,
            'message' => $user ? 'Email sudah terdaftar.' : 'Email tersedia.'
        ]);
    }

    public function updateProfile($id)
    {
        $userModel = new UserModel();
        $user = $userModel->find($id);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $input = $this->request->getRawInput();
        
        $data = [];
        if (isset($input['name'])) $data['name'] = $input['name'];
        if (isset($input['email'])) $data['email'] = $input['email'];
        if (isset($input['phone'])) $data['phone'] = $input['phone'];
        if (isset($input['address'])) $data['address'] = $input['address'];
        if (isset($input['company_name'])) $data['company_name'] = $input['company_name'];
        if (isset($input['pic_name'])) $data['pic_name'] = $input['pic_name'];
        if (isset($input['bank_account'])) $data['bank_account'] = $input['bank_account'];
        if (isset($input['avatar'])) $data['avatar'] = $input['avatar'];
        if (isset($input['village'])) $data['village'] = $input['village'];

        if (!empty($data)) {
            $userModel->update($id, $data);
            $user = $userModel->find($id);
        }

        return $this->respond([
            'status' => 200,
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'village' => $user['village'],
                'phone' => $user['phone'],
                'address' => $user['address'],
                'company_name' => $user['company_name'],
                'pic_name' => $user['pic_name'],
                'bank_account' => $user['bank_account'],
                'avatar' => $user['avatar']
            ]
        ]);
    }
}
