<?php
namespace App\Models;
use CodeIgniter\Model;

class OrderModel extends Model
{
    protected $table            = 'orders';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false; // Karena id menggunakan string (UUID/custom format)
    protected $returnType       = 'array';
    protected $allowedFields    = ['id', 'buyer_id', 'seller_id', 'total_amount', 'dp_amount', 'remaining_amount', 'status', 'payment_method', 'tracking_number', 'bast_url', 'harvest_confirmed_seller', 'purchase_confirmed_buyer', 'payment_proof'];
    protected $useTimestamps    = true;
    
    public function getOrdersByUserId($userId, $role)
    {
        if ($role === 'admin') {
            return $this->select('orders.*, b.name as buyer_name, b.village as buyer_village, b.address as buyer_address, s.name as seller_name, s.village as seller_village, s.address as seller_address')
                        ->join('users b', 'orders.buyer_id = b.id', 'left')
                        ->join('users s', 'orders.seller_id = s.id', 'left')
                        ->orderBy('orders.created_at', 'DESC')
                        ->findAll();
        } else if ($role === 'seller') {
            return $this->select('orders.*, users.name as buyer_name, users.village as buyer_village, users.address as buyer_address')
                        ->join('users', 'orders.buyer_id = users.id', 'left')
                        ->where('orders.seller_id', $userId)
                        ->orderBy('orders.created_at', 'DESC')
                        ->findAll();
        } else {
            return $this->select('orders.*, users.name as seller_name, users.village as seller_village, users.address as seller_address')
                        ->join('users', 'orders.seller_id = users.id', 'left')
                        ->where('orders.buyer_id', $userId)
                        ->orderBy('orders.created_at', 'DESC')
                        ->findAll();
        }
    }
}
