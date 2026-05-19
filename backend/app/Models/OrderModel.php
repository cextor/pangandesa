<?php
namespace App\Models;
use CodeIgniter\Model;

class OrderModel extends Model
{
    protected $table            = 'orders';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false; // Karena id menggunakan string (UUID/custom format)
    protected $returnType       = 'array';
    protected $allowedFields    = ['id', 'buyer_id', 'seller_id', 'total_amount', 'dp_amount', 'remaining_amount', 'status', 'payment_method', 'tracking_number', 'bast_url', 'harvest_confirmed_seller', 'purchase_confirmed_buyer'];
    protected $useTimestamps    = true;
    
    public function getOrdersByUserId($userId, $role)
    {
        $column = ($role === 'seller') ? 'seller_id' : 'buyer_id';
        return $this->where($column, $userId)->orderBy('created_at', 'DESC')->findAll();
    }
}
