<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use App\Models\OrderModel;
use App\Models\OrderItemModel;

class OrderController extends ResourceController
{
    protected $modelName = OrderModel::class;
    protected $format    = 'json';

    public function index()
    {
        // Ideally get userId from JWT
        $userId = $this->request->getVar('user_id');
        $role = $this->request->getVar('role');
        
        if ($userId && $role) {
            $orders = $this->model->getOrdersByUserId($userId, $role);
        } else {
            $orders = $this->model->findAll();
        }

        // Attach items for each order
        $itemModel = new OrderItemModel();
        foreach ($orders as &$order) {
            $order['items'] = $itemModel->where('order_id', $order['id'])->findAll();
        }

        return $this->respond(['status' => 200, 'data' => $orders]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $orderModel = new OrderModel();
        $itemModel = new OrderItemModel();

        // Use custom generated ID from frontend or generate here
        $orderId = $data['id'] ?? uniqid('ORD-');
        
        $orderData = [
            'id' => $orderId,
            'buyer_id' => $data['buyerId'] ?? 1,
            'seller_id' => $data['sellerId'] ?? 2,
            'total_amount' => $data['totalAmount'],
            'dp_amount' => $data['dpAmount'],
            'remaining_amount' => $data['remainingAmount'],
            'status' => 'WAITING_PAYMENT_DP'
        ];

        $this->db = \Config\Database::connect();
        $this->db->transStart();

        $orderModel->insert($orderData);

        if (!empty($data['items'])) {
            foreach ($data['items'] as $item) {
                $itemData = [
                    'order_id' => $orderId,
                    'product_id' => $item['productId'] ?? 0,
                    'name' => $item['name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'unit' => $item['unit'] ?? 'kg'
                ];
                $itemModel->insert($itemData);
            }
        }

        $this->db->transComplete();

        if ($this->db->transStatus() === FALSE) {
            return $this->failServerError('Failed to create order');
        }

        return $this->respondCreated(['status' => 201, 'message' => 'Order created', 'data' => $orderData]);
    }

    public function updateStatus($id = null)
    {
        $data = $this->request->getJSON(true);
        if (!isset($data['status'])) {
            return $this->failValidationErrors('Status is required');
        }

        $db = \Config\Database::connect();
        $db->transStart();

        $this->model->update($id, ['status' => $data['status']]);

        // If status changed to WAITING_HARVEST, the buyer has paid the DP! We must reduce the product stock.
        if ($data['status'] === 'WAITING_HARVEST') {
            $orderItems = $db->table('order_items')->where('order_id', $id)->get()->getResultArray();
            foreach ($orderItems as $item) {
                $productId = $item['product_id'];
                $qty = (int)$item['quantity'];
                
                // Fetch base product
                $product = $db->table('products')->where('id', $productId)->get()->getRowArray();
                if ($product) {
                    // Update product base stock
                    $newStock = max(0, (int)$product['stock'] - $qty);
                    $db->table('products')->where('id', $productId)->update(['stock' => $newStock]);
                    
                    // Update specific harvest schedule stock if matches (extract harvest date formatted as DD-MM-YYYY)
                    if (preg_match('/\(Panen:\s*([^\)]+)\)/i', $item['name'], $matches)) {
                        $harvestDateFormatted = trim($matches[1]);
                        $parts = explode('-', $harvestDateFormatted);
                        if (count($parts) === 3) {
                            $harvestDateDb = "{$parts[2]}-{$parts[1]}-{$parts[0]}";
                            
                            $schedule = $db->table('harvest_schedules')->where([
                                'product_id' => $productId,
                                'date' => $harvestDateDb
                            ])->get()->getRowArray();
                            
                            if ($schedule) {
                                $newSchedStock = max(0, (int)$schedule['stock'] - $qty);
                                $db->table('harvest_schedules')->where([
                                    'product_id' => $productId,
                                    'date' => $harvestDateDb
                                ])->update(['stock' => $newSchedStock]);
                            }
                        }
                    }
                    
                    // Synchronize the product table's harvest_date JSON string
                    $schedules = $db->table('harvest_schedules')->where('product_id', $productId)->get()->getResultArray();
                    $db->table('products')->where('id', $productId)->update([
                        'harvest_date' => json_encode($schedules)
                    ]);
                }
            }
        }

        $db->transComplete();

        if ($db->transStatus() === FALSE) {
            return $this->failServerError('Update failed');
        }

        return $this->respond(['status' => 200, 'message' => 'Status updated successfully']);
    }
}
