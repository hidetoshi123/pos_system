<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function createOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_email' => 'required|email',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'orderItems' => 'required|array|min:1',
            'orderItems.*.item_id' => 'required|integer|exists:tbl_items,item_id',

            'orderItems.*.quantity' => 'required|integer|min:1',
            'orderItems.*.discounted_price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            $grandTotal = 0;
            foreach ($request->orderItems as $item) {
                $grandTotal += $item['discounted_price'] * $item['quantity'];
            }

            $order = Order::create([
                'customer_email' => $request->customer_email,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'total_price' => $grandTotal,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            foreach ($request->orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->order_id,
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                    'discounted_price' => $item['discounted_price'],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
            }

            DB::commit();

            // Http::post(config('services.webhook.url'), [
            //     'grand_total' => $grandTotal,
            //     'first_name' => $request->first_name,
            //     'last_name' => $request->last_name,
            //     'customer_email' => $request->customer_email,
            // ]);

            return response()->json([
                'message' => 'Order created successfully!',
                'order_id' => $order->order_id,
                'grand_total_saved' => $grandTotal,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => 'Failed to create order.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}
