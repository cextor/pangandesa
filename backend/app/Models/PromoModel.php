<?php
namespace App\Models;
use CodeIgniter\Model;

class PromoModel extends Model
{
    protected $table            = 'promos';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['code', 'title', 'description', 'discount_percent', 'min_purchase', 'image'];
}
