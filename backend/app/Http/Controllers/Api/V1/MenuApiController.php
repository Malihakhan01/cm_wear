<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class MenuApiController extends Controller
{
    public function header(): JsonResponse
    {
        $menu = Setting::get('header_mega_menu');

        if (empty($menu) || !is_array($menu)) {
            $menu = MenuController::getDefaultMegaMenu();
        }

        return response()->json([
            'success' => true,
            'data' => $menu,
        ]);
    }
}
