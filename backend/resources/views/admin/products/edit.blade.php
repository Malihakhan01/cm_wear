@extends('layouts.admin')

@section('title', "Edit Product: {$product->name}")
@section('header_title', 'Edit Product')

@section('content')
<div class="space-y-6">
    
    <div class="flex items-center justify-between">
        <a href="{{ route('admin.products.index') }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Back to Catalog
        </a>

        <div class="flex items-center gap-3">
            <span class="text-xs font-mono text-slate-400">ID: #{{ $product->id }} | Slug: {{ $product->slug }}</span>
        </div>
    </div>

    @php
        $primaryImg = $product->primaryImage ?? $product->images->where('is_primary', true)->first() ?? $product->images->first();
        $galleryImgs = $product->images->where('id', '!=', optional($primaryImg)->id);
        $tiers = $product->wholesaleTiers->sortBy('sort_order')->values();
        
        $tier1 = $tiers->get(0);
        $tier2 = $tiers->get(1);
        $tier3 = $tiers->get(2);
        $tier4 = $tiers->get(3);
    @endphp

    <form method="POST" 
          action="{{ route('admin.products.update', $product->id) }}" 
          enctype="multipart/form-data"
          x-data="{
              name: {{ Js::from(old('name', $product->name ?? '')) }},
              shortDesc: {{ Js::from(old('short_description', $product->short_description ?? '')) }},
              metaTitle: {{ Js::from(old('meta_title', $product->meta_title ?? '')) }},
              metaDescription: {{ Js::from(old('meta_description', $product->meta_description ?? '')) }},
              metaTitleManuallyEdited: {{ (old('meta_title', $product->meta_title) ? 'true' : 'false') }},
              metaDescManuallyEdited: {{ (old('meta_description', $product->meta_description) ? 'true' : 'false') }},
              primaryImagePreview: null,
              galleryPreviews: [],

              onNameInput() {
                  if (!this.metaTitleManuallyEdited || this.metaTitle.trim() === '') {
                      this.metaTitle = this.name;
                  }
              },
              previewPrimaryImage(event) {
                  const file = event.target.files[0];
                  if (file) {
                      this.primaryImagePreview = URL.createObjectURL(file);
                  }
              },
              previewGalleryImages(event) {
                  this.galleryPreviews = [];
                  const files = event.target.files;
                  if (files) {
                      for (let i = 0; i < files.length; i++) {
                          this.galleryPreviews.push({
                              name: files[i].name,
                              url: URL.createObjectURL(files[i])
                          });
                      }
                  }
              }
          }"
          class="space-y-8">
        @csrf
        @method('PUT')

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Left Column: Core Garment Info & Pricing (2 Cols) -->
            <div class="lg:col-span-2 space-y-6">
                
                <!-- Basic Info Card -->
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Product Identification</h3>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Product Title *</label>
                        <input type="text" name="name" x-model="name" @input="onNameInput()" value="{{ old('name', $product->name) }}" required class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">SKU</label>
                            <input type="text" name="sku" value="{{ old('sku', $product->sku) }}" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                        </div>

                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Product Type</label>
                            <select name="product_type" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                                <option value="customizable_apparel" {{ $product->product_type === 'customizable_apparel' ? 'selected' : '' }}>Customizable Garment</option>
                                <option value="simple" {{ $product->product_type === 'simple' ? 'selected' : '' }}>Simple Apparel Blank</option>
                                <option value="variable" {{ $product->product_type === 'variable' ? 'selected' : '' }}>Variable Product ({{ $product->variants->count() }} Variants)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Short Description</label>
                        <x-wysiwyg name="short_description" :value="old('short_description', $product->short_description)" placeholder="Brief summary of fabric, fit, and key features..." height="110px" :compact="true" />
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Full Specifications & Description</label>
                        <x-wysiwyg name="description" :value="old('description', $product->description)" placeholder="Full garment specifications, material breakdown, GSM, washing instructions, and customization details..." height="240px" />
                    </div>
                </div>

                <!-- Pricing, Retail & Alibaba-Style 4-Tier MOQ Matrix Card -->
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
                    <div>
                        <h3 class="text-base font-bold text-slate-900 dark:text-white">Pricing & Production Specifications</h3>
                        <p class="text-xs text-slate-400 mt-0.5">Retail pricing and factory tiered volume MOQ wholesale discounts.</p>
                    </div>

                    <!-- Retail Price Row -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Retail Price ($) *</label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm font-bold">$</span>
                                <input type="number" step="0.01" name="regular_price" value="{{ old('regular_price', $product->regular_price) }}" required class="w-full pl-8 rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Sale Price ($) <span class="text-slate-400 font-normal lowercase">(optional)</span></label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm font-bold">$</span>
                                <input type="number" step="0.01" name="sale_price" value="{{ old('sale_price', $product->sale_price) }}" placeholder="Optional discount" class="w-full pl-8 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Rapid Sample Price ($)</label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm font-bold">$</span>
                                <input type="number" step="0.01" name="sample_price" value="{{ old('sample_price', $product->sample_price ?? '75.00') }}" placeholder="75.00" class="w-full pl-8 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                            </div>
                        </div>
                    </div>

                    <!-- Alibaba-Style 4-Tier Wholesale MOQ Pricing Matrix -->
                    <div class="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-950/60 space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                    Alibaba-Style 4-Tier Wholesale MOQ Pricing
                                </h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tiered wholesale unit prices automatically decreasing for higher batch production runs.</p>
                            </div>
                            <span class="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">4 Volume Tiers</span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                            <!-- Tier 1 (Base MOQ) -->
                            <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded">Tier 1 (Base MOQ)</span>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Quantity Range (Pcs) *</label>
                                    <div class="flex items-center gap-1.5">
                                        <input type="number" name="wholesale_tiers[0][min_quantity]" value="{{ old('wholesale_tiers.0.min_quantity', optional($tier1)->min_quantity ?? $product->moq ?? '50') }}" required class="w-1/2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                        <span class="text-slate-400 text-xs">-</span>
                                        <input type="number" name="wholesale_tiers[0][max_quantity]" value="{{ old('wholesale_tiers.0.max_quantity', optional($tier1)->max_quantity ?? '99') }}" class="w-1/2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Wholesale / Pc ($) *</label>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs text-slate-400 font-bold">$</span>
                                        <input type="number" step="0.01" name="wholesale_tiers[0][unit_price]" value="{{ old('wholesale_tiers.0.unit_price', optional($tier1)->unit_price ?? $product->wholesale_price ?? '38.00') }}" required class="w-full pl-6 rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-blue-400">
                                    </div>
                                </div>
                            </div>

                            <!-- Tier 2 -->
                            <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-[11px] font-bold uppercase text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/80 px-2 py-0.5 rounded">Tier 2 (Batch)</span>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Quantity Range (Pcs)</label>
                                    <div class="flex items-center gap-1.5">
                                        <input type="number" name="wholesale_tiers[1][min_quantity]" value="{{ old('wholesale_tiers.1.min_quantity', optional($tier2)->min_quantity ?? '100') }}" placeholder="100" class="w-1/2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                        <span class="text-slate-400 text-xs">-</span>
                                        <input type="number" name="wholesale_tiers[1][max_quantity]" value="{{ old('wholesale_tiers.1.max_quantity', optional($tier2)->max_quantity ?? '499') }}" placeholder="499" class="w-1/2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Wholesale / Pc ($)</label>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs text-slate-400 font-bold">$</span>
                                        <input type="number" step="0.01" name="wholesale_tiers[1][unit_price]" value="{{ old('wholesale_tiers.1.unit_price', optional($tier2)->unit_price ?? '32.00') }}" placeholder="32.00" class="w-full pl-6 rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                    </div>
                                </div>
                            </div>

                            <!-- Tier 3 -->
                            <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded">Tier 3 (Bulk)</span>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Quantity Range (Pcs)</label>
                                    <div class="flex items-center gap-1.5">
                                        <input type="number" name="wholesale_tiers[2][min_quantity]" value="{{ old('wholesale_tiers.2.min_quantity', optional($tier3)->min_quantity ?? '500') }}" placeholder="500" class="w-1/2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                        <span class="text-slate-400 text-xs">-</span>
                                        <input type="number" name="wholesale_tiers[2][max_quantity]" value="{{ old('wholesale_tiers.2.max_quantity', optional($tier3)->max_quantity ?? '999') }}" placeholder="999" class="w-1/2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Wholesale / Pc ($)</label>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs text-slate-400 font-bold">$</span>
                                        <input type="number" step="0.01" name="wholesale_tiers[2][unit_price]" value="{{ old('wholesale_tiers.2.unit_price', optional($tier3)->unit_price ?? '26.00') }}" placeholder="26.00" class="w-full pl-6 rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                    </div>
                                </div>
                            </div>

                            <!-- Tier 4 -->
                            <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded">Tier 4 (High Volume)</span>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Quantity Range (Pcs)</label>
                                    <div class="flex items-center gap-1.5">
                                        <input type="number" name="wholesale_tiers[3][min_quantity]" value="{{ old('wholesale_tiers.3.min_quantity', optional($tier4)->min_quantity ?? '1000') }}" placeholder="1000" class="w-1/2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                        <span class="text-slate-400 text-xs">+</span>
                                        <input type="number" name="wholesale_tiers[3][max_quantity]" value="{{ old('wholesale_tiers.3.max_quantity', optional($tier4)->max_quantity) }}" placeholder="Unlimited" class="w-1/2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Wholesale / Pc ($)</label>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs text-slate-400 font-bold">$</span>
                                        <input type="number" step="0.01" name="wholesale_tiers[3][unit_price]" value="{{ old('wholesale_tiers.3.unit_price', optional($tier4)->unit_price ?? '21.50') }}" placeholder="21.50" class="w-full pl-6 rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-emerald-600 dark:border-slate-800 dark:bg-slate-950 dark:text-emerald-400">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Factory & Production Parameters -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Factory MOQ (Units) *</label>
                            <input type="number" name="moq" value="{{ old('moq', $product->moq) }}" required class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                        </div>

                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Fabric Weight (GSM)</label>
                            <input type="number" name="default_gsm" value="{{ old('default_gsm', $product->default_gsm) }}" placeholder="e.g. 450" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                        </div>

                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Lead Time (Days) *</label>
                            <input type="number" name="lead_time_days" value="{{ old('lead_time_days', $product->lead_time_days) }}" required class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Fit Profile</label>
                        <input type="text" name="fit" value="{{ old('fit', $product->fit) }}" placeholder="e.g. Oversized Drop-Shoulder, Boxy Fit" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                    </div>
                </div>

                <!-- Product Variations Table (If Variable Product) -->
                @if($product->product_type === 'variable' && $product->variants->isNotEmpty())
                    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-base font-bold text-slate-900 dark:text-white">WooCommerce Variations ({{ $product->variants->count() }})</h3>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs">
                                <thead>
                                    <tr class="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider dark:border-slate-800">
                                        <th class="pb-2">Variant SKU</th>
                                        <th class="pb-2">Attributes</th>
                                        <th class="pb-2 text-right">Wholesale</th>
                                        <th class="pb-2 text-right">Regular Price</th>
                                        <th class="pb-2 text-center">Stock</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                    @foreach($product->variants as $var)
                                        <tr>
                                            <td class="py-2.5 font-mono font-bold text-slate-700 dark:text-slate-300">{{ $var->sku }}</td>
                                            <td class="py-2.5 font-medium text-slate-900 dark:text-white">
                                                {{ $var->attributeValues->pluck('label')->join(' / ') ?: 'Standard' }}
                                            </td>
                                            <td class="py-2.5 text-right font-bold text-blue-600 dark:text-blue-400">
                                                ${{ number_format($var->wholesale_price ?? $product->wholesale_price, 2) }}
                                            </td>
                                            <td class="py-2.5 text-right font-medium">
                                                ${{ number_format($var->regular_price ?? $product->regular_price, 2) }}
                                            </td>
                                            <td class="py-2.5 text-center">
                                                <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-bold">
                                                    {{ $var->stock_quantity ?? 'In Stock' }}
                                                </span>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                @endif

                <!-- SEO Fields Card -->
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-bold text-slate-900 dark:text-white">SEO & Social Meta Tags</h3>
                        <span class="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">Auto-Generates if empty</span>
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Meta Title</label>
                            <span class="text-[11px] text-slate-400 dark:text-slate-500" x-text="metaTitle ? metaTitle.length + ' chars' : 'Auto'"></span>
                        </div>
                        <input type="text" name="meta_title" x-model="metaTitle" @input="metaTitleManuallyEdited = (metaTitle.trim() !== '')" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Meta Description</label>
                            <span class="text-[11px] text-slate-400 dark:text-slate-500" x-text="metaDescription ? metaDescription.length + ' chars' : 'Auto'"></span>
                        </div>
                        <textarea name="meta_description" rows="3" x-model="metaDescription" @input="metaDescManuallyEdited = (metaDescription.trim() !== '')" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">{{ old('meta_description', $product->meta_description) }}</textarea>
                    </div>
                </div>

            </div>

            <!-- Right Column: Taxonomy, Status & Product Media (1 Col) -->
            <div class="space-y-6">
                
                <!-- Status & Publish Card -->
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Publish Settings</h3>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Visibility Status</label>
                        <select name="status" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                            <option value="published" {{ $product->status === 'published' ? 'selected' : '' }}>Published (Live on Store)</option>
                            <option value="draft" {{ $product->status === 'draft' ? 'selected' : '' }}>Draft</option>
                            <option value="archived" {{ $product->status === 'archived' ? 'selected' : '' }}>Archived</option>
                        </select>
                    </div>

                    <div class="pt-2 space-y-3">
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="is_featured" value="1" {{ $product->is_featured ? 'checked' : '' }} class="rounded border-slate-300 text-blue-600 focus:ring-0">
                            <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Featured on Homepage</span>
                        </label>

                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="is_customizable" value="1" {{ $product->is_customizable ? 'checked' : '' }} class="rounded border-slate-300 text-blue-600 focus:ring-0">
                            <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Enable Customizer</span>
                        </label>

                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="sample_available" value="1" {{ $product->sample_available ? 'checked' : '' }} class="rounded border-slate-300 text-blue-600 focus:ring-0">
                            <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Enable Rapid Sample Orders</span>
                        </label>
                    </div>

                    <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <button type="submit" class="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition">
                            Save Changes
                        </button>
                    </div>
                </div>

                <!-- Product Categories Multi-Select Card -->
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Product Categories</h3>
                    
                    @php
                        $selectedCategoryIds = $product->categories->pluck('id')->toArray();
                    @endphp

                    <div class="max-h-64 overflow-y-auto space-y-2 pt-2">
                        @foreach($categories as $cat)
                            <label class="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" name="categories[]" value="{{ $cat->id }}" {{ in_array($cat->id, $selectedCategoryIds) ? 'checked' : '' }} class="rounded border-slate-300 text-blue-600 focus:ring-0">
                                <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ $cat->name }}</span>
                            </label>

                            @foreach($cat->children as $child)
                                <label class="flex items-center gap-2.5 ml-5 cursor-pointer">
                                    <input type="checkbox" name="categories[]" value="{{ $child->id }}" {{ in_array($child->id, $selectedCategoryIds) ? 'checked' : '' }} class="rounded border-slate-300 text-blue-600 focus:ring-0">
                                    <span class="text-xs text-slate-600 dark:text-slate-400">&mdash; {{ $child->name }}</span>
                                </label>
                            @endforeach
                        @endforeach
                    </div>
                </div>

                <!-- Product Images & Gallery Card (Right Side, Below Categories) -->
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
                    <div>
                        <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Product Images & Gallery
                        </h3>
                        <p class="text-xs text-slate-400 mt-1">Manage main cover and gallery angles.</p>
                    </div>

                    <!-- Main / Primary Featured Image -->
                    <div class="space-y-3">
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Main Featured Image
                        </label>

                        <!-- Current Cover or New Upload Preview -->
                        <div class="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-center dark:border-slate-800 dark:bg-slate-950/50 transition hover:border-blue-500">
                            <template x-if="primaryImagePreview">
                                <div class="relative mb-3 aspect-square max-h-48 mx-auto rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                    <img :src="primaryImagePreview" class="h-full w-full object-cover">
                                    <span class="absolute top-2 left-2 rounded bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase">New Selected</span>
                                    <button type="button" @click="primaryImagePreview = null; $refs.primaryFileInput.value = ''" class="absolute top-2 right-2 rounded-full bg-rose-600 p-1 text-white shadow hover:bg-rose-700">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            </template>

                            <template x-if="!primaryImagePreview">
                                <div>
                                    @if($primaryImg)
                                        <div class="relative mb-3 aspect-square max-h-48 mx-auto rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                            <img src="{{ $primaryImg->url }}" alt="{{ $product->name }}" class="h-full w-full object-cover">
                                            <span class="absolute top-2 left-2 rounded bg-blue-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase">Current Cover</span>
                                        </div>
                                        <p class="text-xs font-bold text-slate-700 dark:text-slate-200">Click to Replace Cover</p>
                                    @else
                                        <div class="py-5 flex flex-col items-center justify-center gap-2">
                                            <div class="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                            </div>
                                            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">Upload Main Image</p>
                                        </div>
                                    @endif
                                </div>
                            </template>

                            <input type="file" 
                                   name="primary_image" 
                                   accept="image/*" 
                                   x-ref="primaryFileInput"
                                   @change="previewPrimaryImage($event)" 
                                   class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                        </div>

                        <div>
                            <label class="block text-[11px] font-semibold text-slate-500 mb-1">Or Direct Image URL</label>
                            <input type="url" name="primary_image_url" placeholder="https://cdn.example.com/garment-front.jpg" class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                        </div>
                    </div>

                    <!-- Gallery Multi-Image Upload & Management -->
                    <div class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Upload Additional Gallery Photos
                        </label>

                        <div class="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-center dark:border-slate-800 dark:bg-slate-950/50 transition hover:border-blue-500 min-h-[120px] flex flex-col items-center justify-center">
                            <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-1.5">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            </div>
                            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">Upload Extra Angles</p>
                            <p class="text-[10px] text-slate-400">Back, Flatlay, Model shots</p>

                            <input type="file" 
                                   name="gallery_images[]" 
                                   multiple 
                                   accept="image/*" 
                                   @change="previewGalleryImages($event)" 
                                   class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                        </div>

                        <!-- Selected Gallery Previews -->
                        <template x-if="galleryPreviews.length > 0">
                            <div class="space-y-2 pt-1">
                                <p class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400" x-text="galleryPreviews.length + ' photo(s) will be uploaded upon save'"></p>
                                <div class="grid grid-cols-3 gap-2">
                                    <template x-for="(img, idx) in galleryPreviews" :key="idx">
                                        <div class="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                            <img :src="img.url" class="h-full w-full object-cover">
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- Existing Gallery Images List with Delete Action -->
                    @if($product->images->isNotEmpty())
                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                            <div class="flex items-center justify-between">
                                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                    Existing Gallery ({{ $product->images->count() }})
                                </h4>
                                <span class="text-[10px] text-slate-400">Hover & trash to delete</span>
                            </div>

                            <div class="grid grid-cols-3 gap-2">
                                @foreach($product->images as $img)
                                    <div class="group relative aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                                        <img src="{{ $img->url }}" alt="{{ $img->alt_text }}" class="h-full w-full object-cover transition group-hover:scale-105">
                                        
                                        @if($img->is_primary)
                                            <span class="absolute top-1 left-1 rounded bg-blue-600 px-1 py-0.5 text-[8px] font-bold text-white uppercase shadow">Cover</span>
                                        @endif

                                        <!-- Delete image button overlay -->
                                        <div class="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-1">
                                            <button type="button" 
                                                    onclick="if(confirm('Delete this photo from product gallery?')) { document.getElementById('delete-img-form-{{ $img->id }}').submit(); }"
                                                    class="rounded-lg bg-rose-600 p-1.5 text-white shadow hover:bg-rose-500 transition">
                                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>

            </div>

        </div>
    </form>

    <!-- Hidden standalone form helpers for deleting gallery images -->
    @foreach($product->images as $img)
        <form id="delete-img-form-{{ $img->id }}" 
              action="{{ route('admin.products.images.destroy', [$product->id, $img->id]) }}" 
              method="POST" 
              class="hidden">
            @csrf
            @method('DELETE')
        </form>
    @endforeach

</div>
@endsection
