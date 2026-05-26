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
                'village' => $user['village']
            ]
        ]);
    }
}
