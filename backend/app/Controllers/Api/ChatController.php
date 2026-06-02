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
        
        $attachmentType = $data['attachmentType'] ?? 'none';
        $attachmentUrl = $data['attachmentUrl'] ?? null;
        
        // Auto-generate high-quality sample attachments if missing but specified
        if ($attachmentType === 'image' && empty($attachmentUrl)) {
            $attachmentUrl = 'https://images.unsplash.com/photo-1605000797439-7570df7c3bf0?q=80&w=600';
        } elseif ($attachmentType === 'file' && empty($attachmentUrl)) {
            $attachmentUrl = '/files/laporan-panen.pdf';
        }

        $insertData = [
            'order_id' => $data['orderId'],
            'sender_id' => $data['senderId'] ?? 1, // Default fallback
            'content' => $data['content'],
            'attachment_url' => $attachmentUrl,
            'attachment_type' => $attachmentType
        ];

        if ($this->model->insert($insertData)) {
            $id = $this->model->getInsertID();
            // Fetch the newly inserted message with sender_role and sender_name joined
            $newMessage = $this->model->db->table('chat_messages cm')
                                       ->select('cm.*, u.role as sender_role, u.name as sender_name')
                                       ->join('users u', 'u.id = cm.sender_id')
                                       ->where('cm.id', $id)
                                       ->get()
                                       ->getRowArray();
                                       
            return $this->respondCreated(['status' => 201, 'message' => 'Message sent', 'data' => $newMessage]);
        }
        
        return $this->failServerError('Failed to send message');
    }
}

