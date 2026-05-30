<?php
namespace App\Models;
use CodeIgniter\Model;

class HarvestScheduleModel extends Model
{
    protected $table            = 'harvest_schedules';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['product_id', 'date', 'status', 'actual_date', 'stock', 'price', 'is_preorder'];
    protected $useTimestamps    = true;
}
