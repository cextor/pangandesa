<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use App\Models\NotificationModel;

class NotificationController extends ResourceController
{
    protected $modelName = NotificationModel::class;
    protected $format    = 'json';

    public function index()
    {
        $userId = $this->request->getVar('user_id');
        
        if ($userId) {
            $notifications = $this->model->where('user_id', $userId)
                                         ->orderBy('id', 'DESC')
                                         ->findAll();
        } else {
            $notifications = $this->model->orderBy('id', 'DESC')->findAll();
        }

        return $this->respond([
            'status' => 200,
            'data' => $notifications
        ]);
    }

    public function markAsRead($id = null)
    {
        if (!$id) {
            return $this->failValidationErrors('Notification ID is required');
        }

        $notification = $this->model->find($id);
        if (!$notification) {
            return $this->failNotFound('Notification not found');
        }

        if ($this->model->update($id, ['is_read' => 1])) {
            return $this->respond([
                'status' => 200,
                'message' => 'Notification marked as read'
            ]);
        }

        return $this->failServerError('Failed to update notification');
    }

    public function markAllAsRead()
    {
        $userId = $this->request->getVar('user_id');
        if (!$userId) {
            return $this->failValidationErrors('User ID is required');
        }

        $this->model->where('user_id', $userId)->update(null, ['is_read' => 1]);

        return $this->respond([
            'status' => 200,
            'message' => 'All notifications marked as read'
        ]);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        if (empty($data['user_id']) || empty($data['title']) || empty($data['message']) || empty($data['type'])) {
            return $this->failValidationErrors('Required fields: user_id, title, message, type');
        }

        $insertData = [
            'user_id' => $data['user_id'],
            'title'   => $data['title'],
            'message' => $data['message'],
            'type'    => $data['type'],
            'is_read' => 0
        ];

        if ($this->model->insert($insertData)) {
            $insertId = $this->model->getInsertID();
            $newNotif = $this->model->find($insertId);
            return $this->respondCreated([
                'status' => 201,
                'message' => 'Notification created successfully',
                'data' => $newNotif
            ]);
        }

        return $this->failServerError('Failed to create notification');
    }
}
