<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function itemSales(Request $request)
    {
        $startDate = $request->query('start_date', Carbon::now()->subMonth()->toDateString());
        $endDate = $request->query('end_date', Carbon::now()->toDateString());

        $sales = DB::table('tbl_order_items')
            ->join('tbl_items', 'tbl_order_items.item_id', '=', 'tbl_items.item_id')
            ->join('tbl_orders', 'tbl_order_items.order_id', '=', 'tbl_orders.order_id')
            ->select(
                'tbl_items.item_name',
                DB::raw('SUM(tbl_order_items.quantity) as total_quantity'),
                DB::raw('SUM(tbl_order_items.quantity * tbl_order_items.discounted_price) as total_sales')
            )
            ->whereBetween('tbl_orders.created_at', [$startDate, $endDate])
            ->groupBy('tbl_items.item_name')
            ->orderByDesc('total_sales')
            ->get();

        return response()->json($sales);
    }
}
