<?php
namespace App\Models;
use CodeIgniter\Model;

class ChatMessageModel extends Model
{
    protected $table            = 'chat_messages';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['order_id', 'sender_id', 'content', 'attachment_url', 'attachment_type', 'created_at'];
    protected $useTimestamps    = false; // Hanya created_at yang dibutuhkan
    
    public function getMessagesByOrderId($orderId)
    {
        $builder = $this->db->table('chat_messages cm');
        $builder->select('cm.*, u.role as sender_role, u.name as sender_name');
        $builder->join('users u', 'u.id = cm.sender_id');
        $builder->where('cm.order_id', $orderId);
        $builder->orderBy('cm.created_at', 'ASC');
        return $builder->get()->getResultArray();
    }
}
