@extends('layouts.admin')

@section('title', 'Customizer Studio Settings Hub')
@section('header_title', 'Customizer Studio & Tech Pack Settings Hub')

@section('content')
<div class="space-y-6" x-data="{ activeTab: '{{ $tab }}' }">

    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Customizer Management Hub</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Live dynamic administration for colors, decoration techniques, fonts, templates, size charts, and artwork library.</p>
        </div>

        <div class="flex items-center gap-3">
            <a href="{{ route('admin.customizer.designs') }}" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold transition">
                <span>🎨 View Saved Designs</span>
            </a>
            <a href="{{ route('admin.tech-packs.index') }}" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm">
                <span>📋 Tech Packs</span>
            </a>
        </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
        <button 
            type="button" 
            @click="activeTab = 'swatches'"
            :class="activeTab === 'swatches' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 font-semibold'"
            class="px-4 py-2.5 border-b-2 text-xs transition cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
            <span>🎨 Colors & Swatches</span>
            <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px]">{{ $swatches->count() }}</span>
        </button>

        <button 
            type="button" 
            @click="activeTab = 'decorations'"
            :class="activeTab === 'decorations' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 font-semibold'"
            class="px-4 py-2.5 border-b-2 text-xs transition cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
            <span>🧵 Decoration Methods</span>
            <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px]">{{ $decorations->count() }}</span>
        </button>

        <button 
            type="button" 
            @click="activeTab = 'fonts'"
            :class="activeTab === 'fonts' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 font-semibold'"
            class="px-4 py-2.5 border-b-2 text-xs transition cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
            <span>🔤 Typography & Fonts</span>
            <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px]">{{ $fonts->count() }}</span>
        </button>

        <button 
            type="button" 
            @click="activeTab = 'artworks'"
            :class="activeTab === 'artworks' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 font-semibold'"
            class="px-4 py-2.5 border-b-2 text-xs transition cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
            <span>🖼️ Artwork Library</span>
            <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px]">{{ count($artworks) }}</span>
        </button>

        <button 
            type="button" 
            @click="activeTab = 'templates'"
            :class="activeTab === 'templates' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 font-semibold'"
            class="px-4 py-2.5 border-b-2 text-xs transition cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
            <span>👕 Garment Templates</span>
            <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px]">{{ $templates->count() }}</span>
        </button>

        <button 
            type="button" 
            @click="activeTab = 'size_charts'"
            :class="activeTab === 'size_charts' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 font-semibold'"
            class="px-4 py-2.5 border-b-2 text-xs transition cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
            <span>📐 POM & Size Charts</span>
        </button>
    </div>

    <!-- ========================================== -->
    <!-- TAB 1: COLORS & PRESET SWATCHES -->
    <!-- ========================================== -->
    <div x-show="activeTab === 'swatches'" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Left: Add New Swatch Form -->
            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Add Color Swatch</h3>
                <form method="POST" action="{{ route('admin.customizer.options.store') }}" class="space-y-4">
                    @csrf
                    <input type="hidden" name="category" value="color_swatch">

                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Color Name *</label>
                        <input type="text" name="name" required placeholder="e.g. Atelier Pine Green" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Hex Color *</label>
                            <div class="flex items-center gap-2">
                                <input type="color" id="hexPicker" class="w-8 h-8 rounded-lg cursor-pointer border-0 p-0" value="#1B3B2B" onchange="document.getElementById('hexInput').value = this.value">
                                <input type="text" id="hexInput" name="value[hex]" required value="#1B3B2B" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono uppercase text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white" oninput="document.getElementById('hexPicker').value = this.value">
                            </div>
                        </div>

                        <div>
                            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Pantone Ref</label>
                            <input type="text" name="value[pantone]" placeholder="e.g. PMS 5535 C" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Applicable Garments</label>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <label class="flex items-center gap-2 p-2 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer">
                                <input type="checkbox" name="garment_types[]" value="all" checked class="rounded text-blue-600">
                                <span>All Garments</span>
                            </label>
                            <label class="flex items-center gap-2 p-2 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer">
                                <input type="checkbox" name="garment_types[]" value="hoodie" class="rounded text-blue-600">
                                <span>Hoodies</span>
                            </label>
                            <label class="flex items-center gap-2 p-2 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer">
                                <input type="checkbox" name="garment_types[]" value="varsity" class="rounded text-blue-600">
                                <span>Varsity</span>
                            </label>
                            <label class="flex items-center gap-2 p-2 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer">
                                <input type="checkbox" name="garment_types[]" value="basketball" class="rounded text-blue-600">
                                <span>Basketball</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm">
                        + Save Color Swatch
                    </button>
                </form>
            </div>

            <!-- Right: Swatches Table -->
            <div class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Active Studio Swatches ({{ $swatches->count() }})</h3>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                    @foreach($swatches as $sw)
                        @php $hex = $sw->value['hex'] ?? '#000000'; @endphp
                        <div class="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between space-y-2">
                            <div class="flex items-center gap-2.5">
                                <span class="w-7 h-7 rounded-lg border border-black/10 dark:border-white/20 shadow-xs shrink-0" style="background-color: {{ $hex }}"></span>
                                <div class="min-w-0">
                                    <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ $sw->name }}</h4>
                                    <span class="text-[10px] font-mono text-slate-400 block">{{ $hex }}</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800 text-[10px]">
                                <span class="text-slate-400">{{ $sw->value['pantone'] ?? 'Standard' }}</span>
                                <form method="POST" action="{{ route('admin.customizer.options.toggle', $sw->id) }}">
                                    @csrf
                                    <button type="submit" class="text-[10px] font-bold {{ $sw->is_active ? 'text-emerald-500' : 'text-slate-400' }} hover:underline">
                                        {{ $sw->is_active ? 'Active' : 'Disabled' }}
                                    </button>
                                </form>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 2: DECORATION METHODS -->
    <!-- ========================================== -->
    <div x-show="activeTab === 'decorations'" class="space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Embellishment & Decoration Techniques</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                @foreach($decorations as $dec)
                    <div class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950 flex flex-col justify-between space-y-3">
                        <div>
                            <div class="flex items-center justify-between gap-2">
                                <h4 class="font-bold text-xs text-slate-900 dark:text-white">{{ $dec->name }}</h4>
                                <span class="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                                    MOQ {{ $dec->value['moq'] ?? 30 }}
                                </span>
                            </div>
                            <p class="text-[11px] text-blue-500 font-semibold mt-0.5">{{ $dec->value['tagline'] ?? '' }}</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">{{ $dec->value['desc'] ?? '' }}</p>
                        </div>

                        <div class="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                            <span class="text-slate-400">Durability: {{ $dec->value['durability'] ?? '100+ Washes' }}</span>
                            <form method="POST" action="{{ route('admin.customizer.options.toggle', $dec->id) }}">
                                @csrf
                                <button type="submit" class="text-[11px] font-bold {{ $dec->is_active ? 'text-emerald-500' : 'text-slate-400' }} hover:underline">
                                    {{ $dec->is_active ? 'Active' : 'Disabled' }}
                                </button>
                            </form>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 3: TYPOGRAPHY & FONTS -->
    <!-- ========================================== -->
    <div x-show="activeTab === 'fonts'" class="space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Lettering & Monogram Fonts</h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                @foreach($fonts as $f)
                    <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 space-y-2">
                        <div class="flex items-center justify-between">
                            <h4 class="font-bold text-xs text-slate-900 dark:text-white">{{ $f->name }}</h4>
                            <span class="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">{{ $f->value['category'] ?? 'Standard' }}</span>
                        </div>
                        <div class="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                            <span class="text-xl font-bold uppercase tracking-wider" style="font-family: {{ $f->value['family'] ?? 'sans-serif' }}">
                                ABC 123
                            </span>
                        </div>
                        <div class="text-[10px] font-mono text-slate-400 truncate">
                            Family: {{ $f->value['family'] ?? 'sans-serif' }}
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 4: ARTWORK LIBRARY -->
    <!-- ========================================== -->
    <div x-show="activeTab === 'artworks'" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Upload Preset Artwork -->
            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Upload Design Preset</h3>
                <form method="POST" action="{{ route('admin.customizer.artworks.upload') }}" enctype="multipart/form-data" class="space-y-4">
                    @csrf
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Artwork File (PNG, SVG, WEBP) *</label>
                        <input type="file" name="artwork" required accept=".png,.svg,.jpg,.jpeg,.webp" class="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500">
                    </div>

                    <button type="submit" class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm">
                        + Upload to Factory Library
                    </button>
                </form>
            </div>

            <!-- Artworks Grid -->
            <div class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Design Vault Artworks ({{ count($artworks) }})</h3>

                @if(empty($artworks))
                    <div class="py-12 text-center text-slate-400 text-xs">
                        No logos uploaded yet. Upload transparent PNG or SVG brand crests.
                    </div>
                @else
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        @foreach($artworks as $art)
                            <div class="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between items-center text-center space-y-2 group">
                                <div class="w-16 h-16 flex items-center justify-center p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
                                    <img src="{{ $art['url'] }}" alt="{{ $art['filename'] }}" class="max-w-full max-h-full object-contain">
                                </div>
                                <span class="text-[10px] font-mono text-slate-500 truncate max-w-full block" title="{{ $art['filename'] }}">
                                    {{ $art['filename'] }}
                                </span>
                                <div class="flex items-center gap-2">
                                    <a href="{{ $art['url'] }}" target="_blank" class="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                        View
                                    </a>
                                    <span class="text-slate-300">|</span>
                                    <form method="POST" action="{{ route('admin.customizer.artworks.destroy') }}" onsubmit="return confirm('Remove artwork?');">
                                        @csrf
                                        @method('DELETE')
                                        <input type="hidden" name="filename" value="{{ $art['filename'] }}">
                                        <button type="submit" class="text-[10px] font-bold text-rose-500 hover:underline">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 5: GARMENT TEMPLATES & COMPONENTS -->
    <!-- ========================================== -->
    <div x-show="activeTab === 'templates'" class="space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Core Customizable Garment Profiles (4 Archetypes)</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                @foreach($templates as $tmpl)
                    @php $val = $tmpl->value; @endphp
                    <div class="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-950 space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="font-bold text-sm text-slate-900 dark:text-white">{{ $tmpl->name }}</h4>
                                <span class="text-[11px] font-mono text-blue-500 font-bold uppercase">{{ $val['model_type'] ?? '' }} MODEL</span>
                            </div>
                            <span class="text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg">
                                {{ $val['default_gsm'] ?? 450 }} GSM
                            </span>
                        </div>

                        <div class="space-y-1 text-xs">
                            <span class="text-slate-400 font-bold uppercase text-[10px]">Fabric Specification:</span>
                            <p class="font-mono text-slate-800 dark:text-slate-200">{{ $val['fabric'] ?? 'Atelier Knit' }}</p>
                        </div>

                        <div>
                            <span class="text-slate-400 font-bold uppercase text-[10px] block mb-2">Customizable Garment Zones:</span>
                            <div class="flex flex-wrap gap-1.5">
                                @foreach($val['zones'] ?? [] as $zone)
                                    <span class="text-[11px] font-mono px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                                        {{ $zone['name'] ?? $zone['id'] }}
                                    </span>
                                @endforeach
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                            <a href="{{ env('FRONTEND_URL', 'http://localhost:3000') }}/customize/{{ $val['slug'] ?? 'custom-hoodie' }}" target="_blank" class="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1">
                                <span>Test Studio Configurator</span> &rarr;
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 6: POM MEASUREMENTS & SIZE CHARTS -->
    <!-- ========================================== -->
    <div x-show="activeTab === 'size_charts'" class="space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Factory Point of Measure (POM) Grading Matrices</h3>
                    <p class="text-xs text-slate-500">Grading tables auto-injected into generated Tech Packs for Sialkot pattern cutters.</p>
                </div>
            </div>

            @foreach($templates as $tmpl)
                @php
                    $grading = $tmpl->value['pom_grading'] ?? [];
                    $firstRow = is_array($grading) && count($grading) > 0 ? current($grading) : [];
                    $gradingKeys = is_array($firstRow) ? array_keys($firstRow) : [];
                @endphp
                @if(!empty($grading) && !empty($gradingKeys))
                    <div class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
                        <h4 class="font-bold text-xs text-slate-900 dark:text-white uppercase font-mono">{{ $tmpl->name }} Grading Matrix (cm)</h4>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs font-mono">
                                <thead>
                                    <tr class="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase">
                                        <th class="pb-2">Size</th>
                                        @foreach($gradingKeys as $key)
                                            <th class="pb-2">{{ str_replace('_', ' ', $key) }}</th>
                                        @endforeach
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                                    @foreach($tmpl->value['pom_grading'] as $size => $points)
                                        <tr>
                                            <td class="py-1.5 font-bold text-blue-600 dark:text-blue-400">{{ $size }}</td>
                                            @foreach($points as $val)
                                                <td class="py-1.5 text-slate-700 dark:text-slate-300">{{ $val }}</td>
                                            @endforeach
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                @endif
            @endforeach
        </div>
    </div>

</div>
@endsection
