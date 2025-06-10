<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'tbl_orders'; // if not already set
    protected $primaryKey = 'order_id'; // important!
    public $timestamps = true;

    protected $fillable = [
        'customer_email',
        'first_name',
        'last_name',
        'total_price',
        'order_date',
    ];
}
