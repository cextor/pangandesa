<?php
namespace App\Models;
use CodeIgniter\Model;

class ProductModel extends Model
{
    protected $table            = 'products';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['seller_id', 'category_id', 'name', 'description', 'price', 'unit', 'stock', 'is_preorder', 'harvest_date', 'image', 'rating', 'review_count'];
    protected $useTimestamps    = true;
    
    public function getProductsWithDetails($id = null)
    {
        $builder = $this->db->table('products p');
        $builder->select('p.*, u.name as farmer, u.village, c.name as category');
        $builder->join('users u', 'u.id = p.seller_id');
        $builder->join('categories c', 'c.id = p.category_id', 'left');
        
        if ($id) {
            $builder->where('p.id', $id);
            return $builder->get()->getRowArray();
        }
        
        $builder->orderBy('p.created_at', 'DESC');
        return $builder->get()->getResultArray();
    }
}
