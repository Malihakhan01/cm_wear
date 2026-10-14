@extends('layouts.admin')

@section('title', 'Saved Customizer Designs')
@section('header_title', 'Saved Customizer Designs & Approvals')

@section('content')
<div class="space-y-6" x-data="{ selectedDesign: null, copiedEmail: false, showRawColors: false }">

    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Saved Customer Designs Vault</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">All customer-saved 2D/3D garment configurations with component colors, artwork layers, monograms, and linked Tech Packs.</p>
        </div>

        <div class="flex items-center gap-3">
            <span class="rounded-xl bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {{ $designs->total() }} Total Saved Designs
            </span>
        </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form method="GET" action="{{ route('admin.customizer.designs') }}" class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1 relative">
                <input 
                    type="text" 
                    name="search" 
                    value="{{ request('search') }}" 
                    placeholder="Search by Design Code (CD-...), Customer Email, Name, or Product..." 
                    class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
            </div>
            <div class="sm:w-48">
                <select name="status" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    <option value="">All Statuses</option>
                    <option value="active" {{ request('status') === 'active' ? 'selected' : '' }}>Active</option>
                    <option value="draft" {{ request('status') === 'draft' ? 'selected' : '' }}>Draft</option>
                    <option value="archived" {{ request('status') === 'archived' ? 'selected' : '' }}>Archived</option>
                </select>
            </div>
            <div class="flex items-center gap-2">
                <button type="submit" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm">
                    Filter
                </button>
                @if(request()->hasAny(['search', 'status']))
                    <a href="{{ route('admin.customizer.designs') }}" class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold transition">
                        Reset
                    </a>
                @endif
            </div>
        </form>
    </div>

    <!-- Designs Grid -->
    @if($designs->isEmpty())
        <div class="rounded-3xl border border-slate-200 bg-white p-16 text-center text-slate-400 dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <div class="text-4xl">🎨</div>
            <div class="text-sm font-bold text-slate-700 dark:text-slate-300">No customizer designs found.</div>
            <p class="text-xs text-slate-400 max-w-sm mx-auto">Designs saved in the customer customizer or generated from orders will automatically populate here.</p>
        </div>
    @else
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            @foreach($designs as $d)
                @php
                    $product = $d->product;
                    $frontendCustomizerUrl = env('FRONTEND_URL', 'http://localhost:3000') . '/customize/' . ($product->slug ?? 'custom-hoodie') . '?design=' . $d->design_code;
                    $hasArtworks = !empty($d->artwork_layers) && count($d->artwork_layers) > 0;
                    $hasMonogram = !empty($d->monogram_state);
                    
                    // Fallback preview
                    $previewSrc = $d->preview_front;
                    if (!$previewSrc) {
                        $lowerName = strtolower($d->design_name);
                        if (str_contains($lowerName, 'basketball') || str_contains($lowerName, 'jersey')) {
                            $previewSrc = asset('basketball/front (3) (1).png');
                        } elseif (str_contains($lowerName, 'varsity') || str_contains($lowerName, 'jacket')) {
                            $previewSrc = asset('varsity_jacket/FRONT_BODY.png');
                        } elseif (str_contains($lowerName, 'equestrian') || str_contains($lowerName, 'riding')) {
                            $previewSrc = asset('equastarian/front (2) (1).png');
                        } else {
                            $previewSrc = asset('hoodie/front_body.png');
                        }
                    }
                @endphp
                <div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col justify-between hover:border-blue-500/50 transition-all dark:border-slate-800 dark:bg-slate-900 group">
                    
                    <!-- Card Top: Thumbnail & Quick Tags -->
                    <div class="relative aspect-square bg-slate-950/20 p-4 flex items-center justify-center border-b border-slate-100 dark:border-slate-800/80 overflow-hidden">
                        <img 
                            src="{{ $previewSrc }}" 
                            alt="{{ $d->design_name }}" 
                            class="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-300"
                        />

                        <!-- Design Code Badge -->
                        <div class="absolute top-2.5 left-2.5 bg-slate-900/90 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-xs">
                            {{ $d->design_code }}
                        </div>

                        <!-- Status Badge -->
                        <div class="absolute top-2.5 right-2.5">
                            @if($d->status === 'active')
                                <span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md">Active</span>
                            @else
                                <span class="bg-slate-500/10 text-slate-500 border border-slate-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md">{{ ucfirst($d->status) }}</span>
                            @endif
                        </div>

                        <!-- Layer badges at bottom of thumbnail -->
                        <div class="absolute bottom-2 left-2 flex items-center gap-1">
                            @if($hasArtworks)
                                <span class="bg-blue-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm" title="Contains custom artwork">
                                    🖼️ Logo
                                </span>
                            @endif
                            @if($hasMonogram)
                                <span class="bg-amber-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm" title="Contains custom text monogram">
                                    🔤 Mono
                                </span>
                            @endif
                            @if($d->techPack)
                                <span class="bg-purple-600/90 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm" title="Factory Tech Pack generated">
                                    📋 TP Ready
                                </span>
                            @endif
                        </div>
                    </div>

                    <!-- Card Body: Metadata -->
                    <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div class="space-y-1.5">
                            <div class="flex items-center justify-between gap-2">
                                <h4 class="font-bold text-xs text-slate-900 dark:text-white truncate" title="{{ $d->design_name }}">
                                    {{ $d->design_name }}
                                </h4>
                                <span class="text-[10px] font-mono text-slate-400 shrink-0">v{{ $d->version ?? '1.0' }}</span>
                            </div>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {{ $product->name ?? 'Custom Garment' }}
                            </p>

                            <!-- Buyer / Customer Badge on Card -->
                            <div class="px-2.5 py-1.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-[11px] gap-2">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <svg class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                    <span class="font-bold text-slate-800 dark:text-slate-200 truncate font-mono text-[10px]" title="{{ $d->customer->email ?? 'Guest Design (No Email)' }}">
                                        {{ $d->customer->email ?? 'Guest Design' }}
                                    </span>
                                </div>
                                @if($d->total_units)
                                    <span class="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                                        {{ $d->total_units }} pcs
                                    </span>
                                @endif
                            </div>
                        </div>

                        <!-- Technical Specs Summary Box -->
                        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 space-y-1 text-[11px] font-mono">
                            <div class="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                <span>Decoration:</span>
                                <span class="font-semibold text-slate-900 dark:text-slate-200 truncate max-w-[120px]">
                                    {{ $d->decoration_method ?: 'Direct Print' }}
                                </span>
                            </div>
                            <div class="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                <span>Fabric Spec:</span>
                                <span class="font-semibold text-blue-600 dark:text-blue-400">
                                    {{ $d->target_gsm ? $d->target_gsm . ' GSM' : 'Atelier Spec' }}
                                </span>
                            </div>
                            <div class="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                <span>Created:</span>
                                <span class="text-slate-500">
                                    {{ $d->created_at->format('M d, Y') }}
                                </span>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                            <a 
                                href="{{ $frontendCustomizerUrl }}" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                class="inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-xs"
                                title="Open in Frontend Customer Studio"
                            >
                                <span>Studio</span>
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>

                            <button 
                                type="button" 
                                @click="selectedDesign = {{ json_encode($d) }}"
                                class="inline-flex items-center justify-center py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition"
                            >
                                Inspect
                            </button>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

        <div class="mt-6">
            {{ $designs->links() }}
        </div>
    @endif

    <!-- Inspect Design Modal -->
    <div 
        x-show="selectedDesign" 
        x-cloak 
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs"
        @keydown.escape.window="selectedDesign = null"
    >
        <div 
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            @click.outside="selectedDesign = null"
        >
            <!-- Modal Header -->
            <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900" x-text="selectedDesign?.design_code"></span>
                        <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" x-text="'v' + (selectedDesign?.version || '1.0')"></span>
                    </div>
                    <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white" x-text="selectedDesign?.design_name"></h3>
                </div>
                <button @click="selectedDesign = null" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-lg font-bold transition">&times;</button>
            </div>

            <!-- Modal Content Body -->
            <div class="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs font-sans">

                <!-- 1. Customer & Buyer Information Section -->
                <div class="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                            <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            Client & Buyer Specification
                        </span>
                        <template x-if="selectedDesign?.created_at">
                            <span class="text-[10px] font-mono text-slate-500" x-text="'Saved: ' + new Date(selectedDesign.created_at).toLocaleString()"></span>
                        </template>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <!-- Email -->
                        <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                            <span class="text-[10px] font-bold uppercase text-slate-400 font-mono">Buyer Email Address:</span>
                            <div class="flex items-center justify-between gap-2">
                                <span class="font-bold text-slate-900 dark:text-white font-mono break-all text-xs" x-text="selectedDesign?.customer?.email || 'Guest Design (No email linked)'"></span>
                                <template x-if="selectedDesign?.customer?.email">
                                    <button 
                                        type="button" 
                                        @click="navigator.clipboard.writeText(selectedDesign.customer.email); copiedEmail = true; setTimeout(() => copiedEmail = false, 2000)" 
                                        class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-mono shrink-0 transition"
                                        title="Copy Email"
                                    >
                                        <span x-text="copiedEmail ? '✓ Copied' : 'Copy'"></span>
                                    </button>
                                </template>
                            </div>
                        </div>

                        <!-- Buyer Name & Company -->
                        <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                            <span class="text-[10px] font-bold uppercase text-slate-400 font-mono">Buyer / Brand Name:</span>
                            <p class="font-bold text-slate-900 dark:text-white" x-text="(selectedDesign?.customer?.first_name || 'Brand') + ' ' + (selectedDesign?.customer?.last_name || 'Designer')"></p>
                            <template x-if="selectedDesign?.customer?.company_name">
                                <p class="text-[11px] text-blue-600 dark:text-blue-400 font-medium" x-text="'Company: ' + selectedDesign.customer.company_name"></p>
                            </template>
                        </div>

                        <!-- Phone / WhatsApp -->
                        <template x-if="selectedDesign?.customer?.phone || selectedDesign?.customer?.whatsapp">
                            <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                                <span class="text-[10px] font-bold uppercase text-slate-400 font-mono">Phone / WhatsApp:</span>
                                <p class="font-bold text-slate-900 dark:text-white font-mono" x-text="selectedDesign?.customer?.phone || selectedDesign?.customer?.whatsapp"></p>
                            </div>
                        </template>

                        <!-- Batch Quantity -->
                        <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                            <span class="text-[10px] font-bold uppercase text-slate-400 font-mono">Total Batch Units:</span>
                            <p class="font-bold text-blue-600 dark:text-blue-400 font-mono" x-text="(selectedDesign?.total_units || 1) + ' pcs'"></p>
                        </div>
                    </div>

                    <!-- Size Breakdown if present -->
                    <template x-if="selectedDesign?.size_breakdown && Object.keys(selectedDesign.size_breakdown).length > 0">
                        <div class="pt-2 border-t border-blue-100 dark:border-blue-900/40">
                            <span class="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1.5">Size Breakdown:</span>
                            <div class="flex flex-wrap gap-1.5">
                                <template x-for="(qty, size) in selectedDesign.size_breakdown" :key="size">
                                    <span class="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200">
                                        <span class="text-blue-600 dark:text-blue-400" x-text="size"></span>: <span x-text="qty"></span> pcs
                                    </span>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- 2. Technical & Fabric Specifications -->
                <div>
                    <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">Technical & Fabric Specifications</span>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-1">
                            <span class="text-[10px] text-slate-400">Decoration Method:</span>
                            <p class="font-bold text-slate-900 dark:text-white truncate" x-text="selectedDesign?.decoration_method || 'Direct Print'"></p>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-1">
                            <span class="text-[10px] text-slate-400">Wash Type:</span>
                            <p class="font-bold text-slate-900 dark:text-white truncate" x-text="selectedDesign?.wash_type || 'Clean Raw Mill'"></p>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-1">
                            <span class="text-[10px] text-slate-400">Fabric Spec:</span>
                            <p class="font-bold text-slate-900 dark:text-white truncate" x-text="selectedDesign?.fabric_spec || '-'"></p>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-1">
                            <span class="text-[10px] text-slate-400">Target GSM:</span>
                            <p class="font-bold text-blue-600 dark:text-blue-400 truncate" x-text="(selectedDesign?.target_gsm || 450) + ' GSM'"></p>
                        </div>
                    </div>
                </div>

                <!-- 3. Trims Configuration (if any) -->
                <template x-if="selectedDesign?.trims_config && Object.keys(selectedDesign.trims_config).length > 0">
                    <div>
                        <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">Trims & Construction</span>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                            <template x-for="(val, key) in selectedDesign.trims_config" :key="key">
                                <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
                                    <span class="text-[9px] uppercase text-slate-400 block" x-text="key"></span>
                                    <span class="font-bold text-slate-800 dark:text-slate-200 capitalize" x-text="val"></span>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>

                <!-- 4. Component Part Colors -->
                <div class="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-mono font-bold uppercase text-slate-400">Component Part Colors:</span>
                        <button 
                            type="button" 
                            @click="showRawColors = !showRawColors" 
                            class="text-[10px] font-mono text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                            x-text="showRawColors ? 'Show Color Chips' : 'View Raw CAD JSON'"
                        ></button>
                    </div>

                    <!-- Visual Color Chips -->
                    <div x-show="!showRawColors" class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <template x-for="(hex, part) in (selectedDesign?.parts_colors || {})" :key="part">
                            <div class="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                                <span class="w-6 h-6 rounded-lg border border-black/20 shrink-0 shadow-xs" :style="'background-color: ' + hex"></span>
                                <div class="min-w-0 font-mono">
                                    <span class="block text-[11px] font-bold text-slate-800 dark:text-slate-200 capitalize truncate" x-text="part"></span>
                                    <span class="block text-[9px] text-slate-400 font-semibold" x-text="hex"></span>
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- Raw JSON View -->
                    <div x-show="showRawColors">
                        <pre class="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 overflow-x-auto text-[11px] font-mono" x-text="JSON.stringify(selectedDesign?.parts_colors, null, 2)"></pre>
                    </div>
                </div>

                <!-- 5. Uploaded Artwork Layers -->
                <template x-if="selectedDesign?.artwork_layers && selectedDesign?.artwork_layers.length > 0">
                    <div class="border-t border-slate-100 dark:border-slate-800 pt-3">
                        <span class="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-2">Uploaded Artwork Layers:</span>
                        <div class="grid grid-cols-3 gap-3">
                            <template x-for="layer in selectedDesign.artwork_layers" :key="layer.id || layer.url">
                                <div class="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-center bg-slate-950/20">
                                    <img :src="layer.url" class="w-16 h-16 object-contain mx-auto rounded" />
                                    <span class="block text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate mt-1.5" x-text="layer.name || 'Logo'"></span>
                                    <span class="block text-[9px] font-mono text-slate-400" x-text="'Scale: ' + (layer.scale || 1)"></span>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>

                <!-- 6. Monogram State -->
                <template x-if="selectedDesign?.monogram_state && (Array.isArray(selectedDesign.monogram_state) ? selectedDesign.monogram_state.length > 0 : Object.keys(selectedDesign.monogram_state).length > 0)">
                    <div class="border-t border-slate-100 dark:border-slate-800 pt-3">
                        <span class="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-2">Custom Text & Monogram Layers:</span>
                        <div class="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                            <pre class="text-[11px] font-mono text-amber-900 dark:text-amber-200 overflow-x-auto" x-text="JSON.stringify(selectedDesign.monogram_state, null, 2)"></pre>
                        </div>
                    </div>
                </template>

                <!-- 7. Linked Tech Pack Bar -->
                <template x-if="selectedDesign?.tech_pack">
                    <div class="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div class="flex items-center gap-2">
                            <span class="text-lg">📋</span>
                            <div>
                                <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block">Synchronized Factory Tech Pack</span>
                                <span class="font-mono font-bold text-xs text-slate-900 dark:text-white" x-text="selectedDesign.tech_pack.tech_pack_code"></span>
                            </div>
                        </div>
                        <a 
                            :href="'/admin/tech-packs?search=' + encodeURIComponent(selectedDesign.tech_pack.tech_pack_code)" 
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition shadow-xs w-fit"
                        >
                            <span>Open Tech Pack</span>
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </a>
                    </div>
                </template>

            </div>

            <!-- Modal Footer -->
            <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                <div>
                    <template x-if="selectedDesign">
                        <a 
                            :href="'{{ env('FRONTEND_URL', 'http://localhost:3000') }}/customize/' + (selectedDesign?.product?.slug || 'custom-hoodie') + '?design=' + selectedDesign.design_code" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                        >
                            <span>Open in 3D Studio</span>
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                    </template>
                </div>
                <button @click="selectedDesign = null" class="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition">
                    Close
                </button>
            </div>
        </div>
    </div>

</div>
@endsection
