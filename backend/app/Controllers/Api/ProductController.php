<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use App\Models\ProductModel;

class ProductController extends ResourceController
{
    protected $modelName = ProductModel::class;
    protected $format    = 'json';

    public function index()
    {
        $model = new ProductModel();
        return $this->respond([
            'status' => 200,
            'data' => $model->getProductsWithDetails()
        ]);
    }

    public function show($id = null)
    {
        $model = new ProductModel();
        $data = $model->getProductsWithDetails($id);
        if ($data) {
            return $this->respond(['status' => 200, 'data' => $data]);
        }
        return $this->failNotFound('Product not found');
    }

    public function create()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        
        $db = \Config\Database::connect();
        $db->transStart();
        
        // Base product fields
        $productData = [
            'seller_id' => $data['seller_id'] ?? 2,
            'category_id' => $data['category_id'] ?? 2,
            'name' => $data['name'] ?? '',
            'description' => $data['description'] ?? '',
            'price' => $data['price'] ?? 0,
            'unit' => $data['unit'] ?? 'kg',
            'stock' => $data['stock'] ?? 0,
            'is_preorder' => $data['is_preorder'] ?? 0,
            'image' => $data['image'] ?? '',
            'harvest_date' => $data['harvest_date'] ?? '',
            'rating' => $data['rating'] ?? 0,
            'review_count' => $data['review_count'] ?? 0
        ];
        
        if ($this->model->insert($productData)) {
            $productId = $this->model->getInsertID();
            
            // Handle harvest schedules
            $schedules = [];
            $harvestDateStr = $data['harvest_date'] ?? '';
            if ($harvestDateStr !== '') {
                $parsed = json_decode($harvestDateStr, true);
                if (is_array($parsed)) {
                    $schedules = $parsed;
                }
            }
            
            if (!empty($schedules)) {
                $schedBuilder = $db->table('harvest_schedules');
                foreach ($schedules as $s) {
                    $schedBuilder->insert([
                        'product_id' => $productId,
                        'date' => $s['date'],
                        'status' => $s['status'] ?? 'READY',
                        'actual_date' => $s['actualDate'] ?? $s['actual_date'] ?? null,
                        'stock' => (int)($s['stock'] ?? 0),
                        'price' => (float)($s['price'] ?? 0),
                        'is_preorder' => (int)($s['isPreOrder'] ?? $s['is_preorder'] ?? 0)
                    ]);
                }
            }
            
            // Handle multiple images
            $images = $data['images'] ?? [];
            $imgBuilder = $db->table('product_images');
            
            if (!empty($images) && is_array($images)) {
                foreach ($images as $img) {
                    $imgBuilder->insert([
                        'product_id' => $productId,
                        'image_path' => $img['imagePath'] ?? $img['image_path'] ?? '',
                        'is_main' => (int)($img['isMain'] ?? $img['is_main'] ?? 0)
                    ]);
                }
            } else if (!empty($productData['image'])) {
                // Fallback to single main image if images array is empty
                $imgBuilder->insert([
                    'product_id' => $productId,
                    'image_path' => $productData['image'],
                    'is_main' => 1
                ]);
            }
            
            $db->transComplete();
            
            if ($db->transStatus() === false) {
                return $this->failServerError('Failed to create product transactions');
            }
            
            $fullProduct = $this->model->getProductsWithDetails($productId);
            return $this->respondCreated(['status' => 201, 'message' => 'Product created', 'data' => $fullProduct]);
        }
        
        return $this->failValidationErrors($this->model->errors());
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();
        
        $db = \Config\Database::connect();
        $db->transStart();
        
        // Base product fields to update
        $productData = [];
        if (isset($data['category_id'])) $productData['category_id'] = $data['category_id'];
        if (isset($data['name'])) $productData['name'] = $data['name'];
        if (isset($data['description'])) $productData['description'] = $data['description'];
        if (isset($data['price'])) $productData['price'] = $data['price'];
        if (isset($data['unit'])) $productData['unit'] = $data['unit'];
        if (isset($data['stock'])) $productData['stock'] = $data['stock'];
        if (isset($data['is_preorder'])) $productData['is_preorder'] = $data['is_preorder'];
        if (isset($data['image'])) $productData['image'] = $data['image'];
        if (isset($data['harvest_date'])) $productData['harvest_date'] = $data['harvest_date'];
        
        if ($this->model->update($id, $productData)) {
            // Handle harvest schedules
            if (isset($data['harvest_date'])) {
                // Clear old schedules
                $schedBuilder = $db->table('harvest_schedules');
                $schedBuilder->where('product_id', $id)->delete();
                
                $schedules = [];
                $parsed = json_decode($data['harvest_date'], true);
                if (is_array($parsed)) {
                    $schedules = $parsed;
                }
                
                foreach ($schedules as $s) {
                    $schedBuilder->insert([
                        'product_id' => $id,
                        'date' => $s['date'],
                        'status' => $s['status'] ?? 'READY',
                        'actual_date' => $s['actualDate'] ?? $s['actual_date'] ?? null,
                        'stock' => (int)($s['stock'] ?? 0),
                        'price' => (float)($s['price'] ?? 0),
                        'is_preorder' => (int)($s['isPreOrder'] ?? $s['is_preorder'] ?? 0)
                    ]);
                }
            }
            
            // Handle multiple images
            if (isset($data['images']) && is_array($data['images'])) {
                // Clear old images
                $imgBuilder = $db->table('product_images');
                $imgBuilder->where('product_id', $id)->delete();
                
                foreach ($data['images'] as $img) {
                    $imgBuilder->insert([
                        'product_id' => $id,
                        'image_path' => $img['imagePath'] ?? $img['image_path'] ?? '',
                        'is_main' => (int)($img['isMain'] ?? $img['is_main'] ?? 0)
                    ]);
                }
            } else if (isset($data['image']) && !empty($data['image'])) {
                // If only single image provided, update in relation table too
                $imgBuilder = $db->table('product_images');
                $existing = $imgBuilder->where(['product_id' => $id, 'is_main' => 1])->get()->getRowArray();
                if ($existing) {
                    $imgBuilder->where(['product_id' => $id, 'is_main' => 1])->update(['image_path' => $data['image']]);
                } else {
                    $imgBuilder->insert([
                        'product_id' => $id,
                        'image_path' => $data['image'],
                        'is_main' => 1
                    ]);
                }
            }
            
            $db->transComplete();
            
            if ($db->transStatus() === false) {
                return $this->failServerError('Failed to update product transactions');
            }
            
            $fullProduct = $this->model->getProductsWithDetails($id);
            return $this->respond(['status' => 200, 'message' => 'Product updated successfully', 'data' => $fullProduct]);
        }
        
        return $this->failValidationErrors($this->model->errors());
    }

    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['status' => 200, 'message' => 'Product deleted successfully']);
        }
        
        return $this->failServerError('Failed to delete product');
    }
}
