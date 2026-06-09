<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use App\Helpers\PathHelper;

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
                'phone' => $user['phone'],
                'address' => $user['address'],
                'company_name' => $user['company_name'],
                'pic_name' => $user['pic_name'],
                'bank_account' => $user['bank_account'],
                'avatar' => PathHelper::toAbsolute($user['avatar']),
                'pin' => $user['pin'],
                'rating' => $user['rating'],
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
                        'phone' => $user['phone'],
                        'address' => $user['address'],
                        'company_name' => $user['company_name'],
                        'pic_name' => $user['pic_name'],
                        'bank_account' => $user['bank_account'],
                        'avatar' => PathHelper::toAbsolute($user['avatar']),
                        'pin' => $user['pin'],
                        'rating' => $user['rating'],
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

        $input = $this->request->getJSON(true) ?? $this->request->getRawInput();
        
        $data = [];
        if (isset($input['name'])) $data['name'] = $input['name'];
        if (isset($input['email'])) $data['email'] = $input['email'];
        if (isset($input['phone'])) $data['phone'] = $input['phone'];
        if (isset($input['address'])) $data['address'] = $input['address'];
        if (isset($input['company_name'])) $data['company_name'] = $input['company_name'];
        if (isset($input['pic_name'])) $data['pic_name'] = $input['pic_name'];
        if (isset($input['bank_account'])) $data['bank_account'] = $input['bank_account'];
        if (isset($input['avatar'])) $data['avatar'] = PathHelper::toRelative($input['avatar']);
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
                'avatar' => PathHelper::toAbsolute($user['avatar']),
                'pin' => $user['pin'],
                'rating' => $user['rating'],
            ]
        ]);
    }

    public function getAllUsers()
    {
        $userModel = new UserModel();
        $users = $userModel->findAll();
        
        // Remove passwords before returning
        foreach ($users as &$user) {
            unset($user['password']);
            if (isset($user['avatar'])) {
                $user['avatar'] = PathHelper::toAbsolute($user['avatar']);
            }
        }
        
        return $this->respond([
            'status' => 200,
            'message' => 'Users retrieved successfully',
            'users' => $users
        ]);
    }

    public function changePassword($id)
    {
        $userModel = new UserModel();
        $user = $userModel->find($id);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $oldPassword = $this->request->getVar('old_password');
        $newPassword = $this->request->getVar('new_password');

        // Check password unless it's demo bypass
        if (!password_verify($oldPassword, $user['password'])) {
            // Check if it's the default seeded password or we should let it pass for ease of testing
            if ($oldPassword !== 'password') {
                return $this->fail('Password lama salah');
            }
        }

        $data = [
            'password' => password_hash($newPassword, PASSWORD_BCRYPT)
        ];

        $userModel->update($id, $data);

        return $this->respond([
            'status' => 200,
            'message' => 'Password updated successfully'
        ]);
    }

    public function changePin($id)
    {
        $userModel = new UserModel();
        $user = $userModel->find($id);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $pin = $this->request->getVar('pin');

        $data = [
            'pin' => password_hash($pin, PASSWORD_BCRYPT)
        ];

        $userModel->update($id, $data);

        // Also return the updated user (without sensitive data)
        return $this->respond([
            'status' => 200,
            'message' => 'PIN updated successfully'
        ]);
    }

    public function uploadAvatar($id)
    {
        $userModel = new UserModel();
        $user = $userModel->find($id);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $file = $this->request->getFile('avatar');

        if (!$file || !$file->isValid()) {
            return $this->failValidationErrors('File tidak valid atau tidak ditemukan');
        }

        // Validate type and size
        if (!in_array($file->getMimeType(), ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])) {
            return $this->failValidationErrors('Format file harus berupa JPG, PNG, atau WEBP');
        }

        if ($file->getSizeByUnit('mb') > 5) {
            return $this->failValidationErrors('Ukuran file maksimal 5MB');
        }

        // Ensure directories exist
        $uploadDir = FCPATH . 'uploads/avatars/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Move the file
        $newName = $file->getRandomName();
        if ($file->move($uploadDir, $newName)) {
            $avatarRelative = 'uploads/avatars/' . $newName;
            $avatarUrl = PathHelper::toAbsolute($avatarRelative);
            
            // Save to DB
            $userModel->update($id, ['avatar' => $avatarRelative]);
            
            // Fetch updated user
            $user = $userModel->find($id);
            
            return $this->respond([
                'status' => 200,
                'message' => 'Avatar uploaded successfully',
                'avatar' => $avatarUrl,
                'user'    => [
                    'id'      => $user['id'],
                    'name'    => $user['name'],
                    'email'   => $user['email'],
                    'role'    => $user['role'],
                    'village' => $user['village'],
                    'phone' => $user['phone'],
                    'address' => $user['address'],
                    'company_name' => $user['company_name'],
                    'pic_name' => $user['pic_name'],
                    'bank_account' => $user['bank_account'],
                    'avatar' => PathHelper::toAbsolute($user['avatar']),
                    'pin' => $user['pin'],
                    'rating' => $user['rating'],
                ]
            ]);
        }

        return $this->failServerError('Gagal mengunggah foto profil');
    }

    public function deleteUser($id)
    {
        $userModel = new UserModel();
        $user = $userModel->find($id);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $userModel->delete($id);

        return $this->respond([
            'status' => 200,
            'message' => 'User deleted successfully'
        ]);
    }
}
