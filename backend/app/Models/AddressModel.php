<?php
namespace App\Models;
use CodeIgniter\Model;

class AddressModel extends Model
{
    protected $table            = 'user_addresses';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['user_id', 'type', 'name', 'phone', 'street', 'district', 'city', 'is_default'];
    protected $useTimestamps    = true;
}
