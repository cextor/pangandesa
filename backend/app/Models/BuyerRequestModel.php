<?php
namespace App\Models;
use CodeIgniter\Model;

class BuyerRequestModel extends Model
{
    protected $table            = 'buyer_requests';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['buyer_id', 'pangan_type', 'quantity', 'unit', 'budget', 'delivery_period', 'status', 'fulfilled_by'];
    protected $useTimestamps    = true;
}
