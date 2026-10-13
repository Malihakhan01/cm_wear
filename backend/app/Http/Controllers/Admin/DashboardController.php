<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Customer;
use App\Models\NewsletterSubscription;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductionStage;
use App\Models\Rfq;
use App\Models\Setting;
use App\Models\TechPack;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $currencySymbol = Setting::get('currency_symbol', '$');

        // Current 30-day window and Previous 30-day window for comparison
        $now = Carbon::now();
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        $sixtyDaysAgo = Carbon::now()->subDays(60);

        // 1. Core KPIs
        $totalRevenue = (float) Order::where('status', '!=', 'cancelled')->sum('total_amount');
        $prevRevenue = (float) Order::where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [$sixtyDaysAgo, $thirtyDaysAgo])
            ->sum('total_amount');
        $revenueDiffPct = $prevRevenue > 0 ? round((($totalRevenue - $prevRevenue) / $prevRevenue) * 100, 1) : 0;

        $totalOrders = Order::count();
        $prevOrders = Order::whereBetween('created_at', [$sixtyDaysAgo, $thirtyDaysAgo])->count();
        $ordersDiffPct = $prevOrders > 0 ? round((($totalOrders - $prevOrders) / $prevOrders) * 100, 1) : 0;

        $confirmedOrdersCount = Order::where('status', '!=', 'cancelled')->count();
        $avgOrderValue = $confirmedOrdersCount > 0 ? round($totalRevenue / $confirmedOrdersCount, 2) : 0.00;

        $newRfqsCount = Rfq::where('created_at', '>=', $thirtyDaysAgo)->count();
        $totalRfqs = Rfq::count();
        $prevRfqs = Rfq::whereBetween('created_at', [$sixtyDaysAgo, $thirtyDaysAgo])->count();
        $rfqsDiffPct = $prevRfqs > 0 ? round((($newRfqsCount - $prevRfqs) / $prevRfqs) * 100, 1) : 0;

        $totalCustomers = Customer::count();
        $newCustomersCount = Customer::where('created_at', '>=', $thirtyDaysAgo)->count();
        $prevCustomers = Customer::whereBetween('created_at', [$sixtyDaysAgo, $thirtyDaysAgo])->count();
        $customersDiffPct = $prevCustomers > 0 ? round((($newCustomersCount - $prevCustomers) / $prevCustomers) * 100, 1) : 0;

        $activeProductsCount = Product::where('status', 'published')->count();
        $featuredProductsCount = Product::where('is_featured', true)->count();
        $totalProducts = Product::count();

        // 2. Revenue Trend (Daily for the last 30 days)
        $revenueTrendDates = [];
        $revenueTrendValues = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dateStr = $date->format('Y-m-d');
            $label = $date->format('M j');

            $dailySum = (float) Order::where('status', '!=', 'cancelled')
                ->whereDate('created_at', $dateStr)
                ->sum('total_amount');

            $revenueTrendDates[] = $label;
            $revenueTrendValues[] = $dailySum;
        }

        // 3. Orders by Status / Stage
        $stages = ProductionStage::withCount('orders')
            ->orderBy('sort_order')
            ->get();

        $stageLabels = [];
        $stageCounts = [];
        foreach ($stages as $stg) {
            $stageLabels[] = $stg->name;
            $stageCounts[] = $stg->orders_count;
        }

        // 4. RFQs by Status
        $rfqStatuses = [
            'new' => 'New',
            'reviewing' => 'In Review',
            'quoted' => 'Quoted',
            'won' => 'Won',
            'lost' => 'Lost',
            'closed' => 'Closed',
        ];
        $rfqLabels = array_values($rfqStatuses);
        $rfqCounts = [];
        foreach ($rfqStatuses as $statusKey => $statusLabel) {
            $rfqCounts[] = Rfq::where('status', $statusKey)->count();
        }

        // 5. Top Categories by Catalog Volume
        $topCategories = Category::withCount('products')
            ->orderByDesc('products_count')
            ->take(5)
            ->get();

        $categoryLabels = [];
        $categorySeries = [];
        foreach ($topCategories as $cat) {
            $categoryLabels[] = $cat->name;
            $categorySeries[] = $cat->products_count;
        }

        // 6. Newsletter Subscribers Growth (Last 12 Months)
        $newsletterMonths = [];
        $newsletterSeries = [];
        for ($i = 11; $i >= 0; $i--) {
            $monthDate = Carbon::now()->subMonths($i);
            $monthLabel = $monthDate->format('M Y');
            $subCount = NewsletterSubscription::whereYear('created_at', $monthDate->year)
                ->whereMonth('created_at', $monthDate->month)
                ->count();

            $newsletterMonths[] = $monthLabel;
            $newsletterSeries[] = $subCount;
        }

        // 7. Top Selling Products
        $topSoldItems = OrderItem::select('product_id', DB::raw('SUM(quantity) as total_sold'), DB::raw('SUM(total_price) as total_earned'))
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        $productIds = $topSoldItems->pluck('product_id');
        $loadedProducts = Product::with(['primaryImage', 'images'])->whereIn('id', $productIds)->get()->keyBy('id');

        $topProducts = $topSoldItems->map(function ($item) use ($loadedProducts) {
            $product = $loadedProducts->get($item->product_id);
            if ($product) {
                $product->total_sold = (int) $item->total_sold;
                $product->total_earned = (float) $item->total_earned;
                return $product;
            }
            return null;
        })->filter();

        // 8. Top Customers
        $topCustomers = Customer::withCount('orders')
            ->withSum('orders', 'total_amount')
            ->orderByDesc('orders_sum_total_amount')
            ->take(5)
            ->get();

        // 9. Recent Manufacturing Orders
        $recentOrders = Order::with(['customer', 'currentStage'])
            ->latest()
            ->take(8)
            ->get();

        return view('admin.dashboard.index', compact(
            'currencySymbol',
            'totalRevenue',
            'revenueDiffPct',
            'totalOrders',
            'ordersDiffPct',
            'avgOrderValue',
            'newRfqsCount',
            'totalRfqs',
            'rfqsDiffPct',
            'totalCustomers',
            'newCustomersCount',
            'customersDiffPct',
            'activeProductsCount',
            'featuredProductsCount',
            'totalProducts',
            'revenueTrendDates',
            'revenueTrendValues',
            'stageLabels',
            'stageCounts',
            'stages',
            'rfqLabels',
            'rfqCounts',
            'categoryLabels',
            'categorySeries',
            'newsletterMonths',
            'newsletterSeries',
            'topProducts',
            'topCustomers',
            'recentOrders'
        ));
    }
}
