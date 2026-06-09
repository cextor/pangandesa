<?php
namespace App\Models;
use CodeIgniter\Model;
use App\Helpers\PathHelper;

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
            $product = $builder->get()->getRowArray();
            if ($product) {
                $product = $this->attachRelations($product);
            }
            return $product;
        }
        
        $builder->orderBy('p.created_at', 'DESC');
        $products = $builder->get()->getResultArray();
        
        foreach ($products as &$p) {
            $p = $this->attachRelations($p);
        }
        return $products;
    }

    private function attachRelations($product)
    {
        $productId = $product['id'];
        
        // 1. Fetch images
        $imgBuilder = $this->db->table('product_images');
        $imgBuilder->where('product_id', $productId);
        $images = $imgBuilder->get()->getResultArray();
        
        $product['images'] = [];
        $mainImage = null;
        foreach ($images as $img) {
            $product['images'][] = [
                'id' => (string)$img['id'],
                'productId' => (string)$img['product_id'],
                'imagePath' => PathHelper::toAbsolute($img['image_path']),
                'isMain' => (int)$img['is_main'] == 1
            ];
            if ((int)$img['is_main'] == 1) {
                $mainImage = $img['image_path'];
            }
        }
        
        // Fallback main image
        if (!$mainImage && !empty($images)) {
            $mainImage = $images[0]['image_path'];
        }
        
        // Populate the main single 'image' field for backward compatibility
        if ($mainImage) {
            $product['image'] = PathHelper::toAbsolute($mainImage);
        } else if (isset($product['image'])) {
            $product['image'] = PathHelper::toAbsolute($product['image']);
        }
        
        // 2. Fetch schedules
        $schedBuilder = $this->db->table('harvest_schedules');
        $schedBuilder->where('product_id', $productId);
        $schedBuilder->orderBy('date', 'ASC');
        $schedules = $schedBuilder->get()->getResultArray();
        
        $productSchedules = [];
        foreach ($schedules as $s) {
            $productSchedules[] = [
                'date' => $s['date'],
                'status' => $s['status'],
                'actualDate' => $s['actual_date'],
                'stock' => (int)$s['stock'],
                'price' => (float)$s['price'],
                'isPreOrder' => (int)$s['is_preorder'] == 1
            ];
        }
        
        // Populate harvest_date field as JSON string for backward compatibility
        $product['harvest_date'] = json_encode($productSchedules);
        
        return $product;
    }
}
