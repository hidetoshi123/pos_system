<?php

namespace App\Models;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $table = 'tbl_order_items';
    protected $primaryKey = 'order_item_id';
    public $timestamps = true;

    protected $fillable = [
        'order_id',
        'item_id',
        'quantity',
        'discounted_price',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }
    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'item_id');
    }
}
