<?php
namespace App\Models;
use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table            = 'users';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['name', 'email', 'password', 'role', 'phone', 'address', 'village', 'rating'];
    protected $useTimestamps    = true;
    
    // Custom method to get users with specific role
    public function getUsersByRole($role)
    {
        return $this->where('role', $role)->findAll();
    }
}
