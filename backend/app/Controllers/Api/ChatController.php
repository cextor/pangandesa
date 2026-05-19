<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use App\Models\ChatMessageModel;

class ChatController extends ResourceController
{
    protected $modelName = ChatMessageModel::class;
    protected $format    = 'json';

    public function getByOrder($orderId)
    {
        $messages = $this->model->getMessagesByOrderId($orderId);
        return $this->respond(['status' => 200, 'data' => $messages]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $insertData = [
            'order_id' => $data['orderId'],
            'sender_id' => $data['senderId'] ?? 1, // Default fallback
            'content' => $data['content'],
            'attachment_url' => $data['attachmentUrl'] ?? null,
            'attachment_type' => $data['attachmentType'] ?? 'none'
        ];

        if ($this->model->insert($insertData)) {
            $insertData['id'] = $this->model->getInsertID();
            $insertData['created_at'] = date('Y-m-d H:i:s');
            return $this->respondCreated(['status' => 201, 'message' => 'Message sent', 'data' => $insertData]);
        }
        
        return $this->failServerError('Failed to send message');
    }
}
