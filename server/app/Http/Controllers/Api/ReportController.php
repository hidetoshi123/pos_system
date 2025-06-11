<?Php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function itemSaleReport(Request $request)
    {
        $orderItems = OrderItem::with(['order', 'item'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($item) {
                return [
                    'order_id' => $item->order->order_id,
                    'customer' => $item->order->first_name . ' ' . $item->order->last_name,
                    'item_name' => $item->item->name ?? 'Unknown',
                    'quantity' => $item->quantity,
                    'discounted_price' => $item->discounted_price,
                    'total' => $item->quantity * $item->discounted_price,
                    'ordered_at' => $item->created_at->toDateTimeString(),
                ];
            });

        return response()->json($orderItems);
    }
}