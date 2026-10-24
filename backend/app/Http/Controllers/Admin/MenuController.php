<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Setting;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public static function getDefaultMegaMenu(): array
    {
        return [
            [
                'id' => 'team-sports-wear',
                'slug' => 'team-sports-wear',
                'name' => 'Team Sports Wear',
                'number' => '01',
                'image' => '/categories/teamsports_wear.png',
                'tagline' => 'High-performance team uniforms, match jerseys, and technical kits for professional athletics.',
                'subcategories' => [
                    'Ice Hockey',
                    'Soccer & Football',
                    'American Football',
                    'Basketball',
                    'Baseball & Softball',
                    'Cricket',
                    'Rugby',
                    'Lacrosse',
                    'Volleyball',
                    'Tennis & Golf',
                ],
            ],
            [
                'id' => 'martial-arts-combat-wear',
                'slug' => 'martial-arts-combat-wear',
                'name' => 'Martial Arts & Combat Wear',
                'number' => '02',
                'image' => '/categories/martial arts.png',
                'tagline' => 'Championship BJJ gis, fight rash guards, compression singlets, and combat apparel.',
                'subcategories' => [
                    'BJJ & Grappling',
                    'MMA',
                    'Boxing & Muay Thai',
                    'Karate',
                    'Judo',
                    'Taekwondo',
                    'Wrestling',
                ],
            ],
            [
                'id' => 'activewear-fitness',
                'slug' => 'activewear-fitness',
                'name' => 'Activewear & Fitness',
                'number' => '03',
                'image' => '/categories/activewear.png',
                'tagline' => 'Engineered 4-way stretch gym wear, compression layers, and women’s performance activewear.',
                'subcategories' => [
                    'Gym & Training Wear',
                    'Compression Wear',
                    'Women’s Activewear',
                    'Running & Athletics',
                    'Cycling Wear',
                ],
            ],
            [
                'id' => 'casual-lifestyle-wear',
                'slug' => 'casual-lifestyle-wear',
                'name' => 'Casual & Lifestyle Wear',
                'number' => '04',
                'image' => '/categories/casualwear.png',
                'tagline' => 'Heavyweight 450 GSM French terry hoodies, crewnecks, oversized tees, and tailored tracksuits.',
                'subcategories' => [
                    'T-Shirts & Polo Shirts',
                    'Hoodies & Sweatshirts',
                    'Tracksuits & Matching Sets',
                    'Pants & Shorts',
                ],
            ],
            [
                'id' => 'jackets-outerwear',
                'slug' => 'jackets-outerwear',
                'name' => 'Jackets & Outerwear',
                'number' => '05',
                'image' => '/categories/jacket wear.png',
                'tagline' => 'Authentic wool & leather varsity jackets, technical softshells, windbreakers, and weather armor.',
                'subcategories' => [
                    'Varsity Jackets',
                    'Leather Jackets',
                    'Softshell Jackets',
                    'Windbreakers',
                    'Winter Wear',
                    'Rainwear',
                ],
            ],
            [
                'id' => 'kids-youth-wear',
                'slug' => 'kids-youth-wear',
                'name' => 'Kids & Youth Wear',
                'number' => '06',
                'image' => '/categories/kids wear.png',
                'tagline' => 'Durable, junior-cut athletic teamwear, activewear, training hoodies, and tracksuits.',
                'subcategories' => [
                    'Youth Team Uniforms',
                    'Kids’ Activewear',
                    'Kids’ T-Shirts',
                    'Kids’ Hoodies',
                    'Kids’ Tracksuits',
                ],
            ],
            [
                'id' => 'workwear-medical-wear',
                'slug' => 'workwear-medical-wear',
                'name' => 'Workwear & Medical Wear',
                'number' => '07',
                'image' => '/categories/work wear.png',
                'tagline' => 'Antimicrobial medical scrubs, industrial work uniforms, and corporate utility polo shirts.',
                'subcategories' => [
                    'Medical Scrubs',
                    'Work Uniforms',
                    'Work Polo Shirts',
                ],
            ],
            [
                'id' => 'sports-accessories',
                'slug' => 'sports-accessories',
                'name' => 'Sports Accessories',
                'number' => '08',
                'image' => '/categories/Vibrant Multisport Gear Court Flat Lay.png',
                'tagline' => 'Essential on-field gear: high-density team socks, reversible training bibs, caps, and bands.',
                'subcategories' => [
                    'Team Socks',
                    'Training Bibs',
                    'Caps',
                    'Headbands',
                    'Wristbands',
                ],
            ],
            [
                'id' => 'gloves',
                'slug' => 'gloves',
                'name' => 'Gloves',
                'number' => '09',
                'image' => '/categories/gloves.png',
                'tagline' => 'Specialized performance gloves for ice hockey, boxing, MMA, goalkeeper, batting, and cycling.',
                'subcategories' => [
                    'Ice Hockey Gloves',
                    'Goalkeeper Gloves',
                    'Cricket Batting Gloves',
                    'Baseball Batting Gloves',
                    'Boxing Gloves',
                    'MMA Gloves',
                    'Gym & Weightlifting Gloves',
                    'Cycling Gloves',
                    'Winter Gloves',
                    'Work Gloves',
                ],
            ],
        ];
    }

    public function index()
    {
        $currentMenu = Setting::get('header_mega_menu');
        if (empty($currentMenu) || !is_array($currentMenu)) {
            $currentMenu = self::getDefaultMegaMenu();
        }

        // Fetch parent categories with children and product counts
        $dbParentCategories = Category::whereNull('parent_id')
            ->with(['children' => fn($q) => $q->withCount('products')->orderBy('name')])
            ->withCount('products')
            ->orderBy('name')
            ->get();

        // Also fetch all subcategories flat
        $dbAllCategories = Category::withCount('products')->orderBy('name')->get();

        return view('admin.menus.index', compact('currentMenu', 'dbParentCategories', 'dbAllCategories'));
    }

    public function update(Request $request)
    {
        $rawMenu = $request->input('menu');
        if (is_string($rawMenu)) {
            $menu = json_decode($rawMenu, true);
        } else {
            $menu = $rawMenu;
        }

        if (!is_array($menu)) {
            return redirect()->back()->with('error', 'Invalid menu data provided.');
        }

        // Clean and format items
        $sanitized = [];
        $index = 1;
        foreach ($menu as $item) {
            if (empty($item['name'])) continue;

            $slug = !empty($item['slug']) ? \Illuminate\Support\Str::slug($item['slug']) : \Illuminate\Support\Str::slug($item['name']);
            $number = !empty($item['number']) ? str_pad($item['number'], 2, '0', STR_PAD_LEFT) : str_pad((string)$index, 2, '0', STR_PAD_LEFT);

            $subcategories = [];
            if (!empty($item['subcategories'])) {
                if (is_array($item['subcategories'])) {
                    $subcategories = array_values(array_filter(array_map('trim', $item['subcategories'])));
                } else if (is_string($item['subcategories'])) {
                    $subcategories = array_values(array_filter(array_map('trim', explode(',', $item['subcategories']))));
                }
            }

            $sanitized[] = [
                'id' => $item['id'] ?? $slug,
                'slug' => $slug,
                'name' => trim($item['name']),
                'number' => $number,
                'image' => !empty($item['image']) ? trim($item['image']) : '/categories/Casual wear (1).png',
                'tagline' => !empty($item['tagline']) ? trim($item['tagline']) : 'Premium private label garment manufacturing and custom export production.',
                'subcategories' => $subcategories,
                'groups' => !empty($item['groups']) && is_array($item['groups']) ? $item['groups'] : [],
            ];

            $index++;
        }

        Setting::set('header_mega_menu', $sanitized, 'appearance', 'json');

        return redirect()->route('admin.menus.index')
            ->with('success', 'Header Products Mega Menu updated successfully! All changes are live on the website.');
    }

    public function syncFromDb()
    {
        $parents = Category::whereNull('parent_id')
            ->with('children')
            ->withCount('products')
            ->orderByDesc('products_count')
            ->take(12)
            ->get();

        $menu = [];
        $idx = 1;
        foreach ($parents as $cat) {
            $subs = $cat->children->pluck('name')->toArray();
            if (empty($subs)) {
                $subs = [$cat->name . ' Blanks', 'Custom ' . $cat->name, 'Private Label ' . $cat->name];
            }

            $menu[] = [
                'id' => $cat->slug,
                'slug' => $cat->slug,
                'name' => $cat->name,
                'number' => str_pad((string)$idx, 2, '0', STR_PAD_LEFT),
                'image' => $cat->hero_image ?: '/categories/Casual wear (1).png',
                'tagline' => $cat->tagline ?: 'Specialized export manufacturing for private labels & international brands.',
                'subcategories' => $subs,
            ];
            $idx++;
        }

        Setting::set('header_mega_menu', $menu, 'appearance', 'json');

        return redirect()->route('admin.menus.index')
            ->with('success', 'Mega menu synchronized successfully from database category pillars.');
    }

    public function reset()
    {
        $default = self::getDefaultMegaMenu();
        Setting::set('header_mega_menu', $default, 'appearance', 'json');

        return redirect()->route('admin.menus.index')
            ->with('success', 'Mega menu reset to factory default pillars successfully.');
    }
}
