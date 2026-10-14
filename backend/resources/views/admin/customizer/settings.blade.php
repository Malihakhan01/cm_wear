@extends('layouts.admin')

@section('title', 'Customizer Studio Settings Hub')
@section('header_title', 'Customizer Studio & Tech Pack Settings Hub')

@section('content')
<div class="space-y-6" x-data="{ 
    activeTab: '{{ $tab }}',
    editSwatchModal: false,
    swatchData: { id: null, name: '', hex: '#1B3B2B', pantone: '', garment_types: ['all'] },
    
    decModalOpen: false,
    decModalMode: 'create',
    decData: { id: null, name: '', key: '', tagline: '', desc: '', durability: '100+ Washes', moq: 30, surcharge: 0, garment_types: ['all'] },
    
    fontModalOpen: false,
    fontModalMode: 'create',
    fontData: { id: null, name: '', key: '', family: '', style: '', category: 'Collegiate' },

    templateModalOpen: false,
    templateData: { id: null, name: '', gsm: 450, fabric: '', model_type: 'hoodie' }
}">

    <!-- Flash Notifications -->
    @if(session('success'))
        <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xs">
            <div class="flex items-center gap-2">
                <span>✅</span>
                <span>{{ session('success') }}</span>
            </div>
            <button type="button" @click="$el.parentElement.remove()" class="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 font-bold">&times;</button>
        </div>
    @endif

    @if(session('error'))
        <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center justify-between shadow-xs">
            <div class="flex items-center gap-2">
                <span>⚠️</span>
                <span>{{ session('error') }}</span>
            </div>
            <button type="button" @click="$el.parentElement.remove()" class="text-rose-600 hover:text-rose-800 dark:text-rose-400 font-bold">&times;</button>
        </div>
    @endif

    @if($errors->any())
        <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200 text-xs font-semibold shadow-xs">
            <p class="font-bold mb-1">Please correct the following errors:</p>
            <ul class="list-disc list-inside space-y-0.5">
                @foreach($errors->all() as $err)
                    <li>{{ $err }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Customizer Management Hub</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Live dynamic administration for colors, decoration techniques, fonts, templates, size charts, and artwork library.</p>
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

        <button 
            type="button" 
            @click="activeTab = 'pricing'"
            :class="activeTab === 'pricing' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 font-semibold'"
            class="px-4 py-2.5 border-b-2 text-xs transition cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
            <span>💰 Wholesale Tier Pricing</span>
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
                    <input type="hidden" name="tab" value="swatches">

                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Color Name *</label>
                        <input type="text" name="name" required placeholder="e.g. Atelier Pine Green" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Hex Color *</label>
                            <div class="flex items-center gap-2">
                                <input type="color" id="hexPicker" class="w-9 h-9 rounded-lg cursor-pointer border-0 p-0 shrink-0" value="#1B3B2B" onchange="document.getElementById('hexInput').value = this.value">
                                <input type="text" id="hexInput" name="value[hex]" required value="#1B3B2B" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono uppercase text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" oninput="document.getElementById('hexPicker').value = this.value">
                            </div>
                        </div>

                        <div>
                            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Pantone Ref</label>
                            <input type="text" name="value[pantone]" placeholder="e.g. PMS 5535 C" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Applicable Garments</label>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <label class="flex items-center gap-2 p-2 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <input type="checkbox" name="garment_types[]" value="all" checked class="rounded text-blue-600">
                                <span>All Garments</span>
                            </label>
                            <label class="flex items-center gap-2 p-2 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <input type="checkbox" name="garment_types[]" value="hoodie" class="rounded text-blue-600">
                                <span>Hoodies</span>
                            </label>
                            <label class="flex items-center gap-2 p-2 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <input type="checkbox" name="garment_types[]" value="varsity" class="rounded text-blue-600">
                                <span>Varsity</span>
                            </label>
                            <label class="flex items-center gap-2 p-2 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <input type="checkbox" name="garment_types[]" value="basketball" class="rounded text-blue-600">
                                <span>Basketball</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer">
                        + Save Color Swatch
                    </button>
                </form>
            </div>

            <!-- Right: Swatches Table -->
            <div class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Active Studio Swatches ({{ $swatches->count() }})</h3>
                    <span class="text-xs text-slate-400">Click Edit or Delete to modify any swatch</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    @foreach($swatches as $sw)
                        @php 
                            $hex = $sw->value['hex'] ?? '#000000'; 
                            $pantone = $sw->value['pantone'] ?? 'Standard';
                        @endphp
                        <div class="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between space-y-2.5 group hover:border-slate-300 dark:hover:border-slate-700 transition">
                            <div class="flex items-center gap-3">
                                <span class="w-8 h-8 rounded-lg border border-black/10 dark:border-white/20 shadow-xs shrink-0" style="background-color: {{ $hex }}"></span>
                                <div class="min-w-0 flex-1">
                                    <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ $sw->name }}</h4>
                                    <div class="flex items-center gap-2 mt-0.5">
                                        <span class="text-[10px] font-mono text-slate-400">{{ $hex }}</span>
                                        <span class="text-[10px] text-slate-400 truncate">&bull; {{ $pantone }}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px]">
                                <form method="POST" action="{{ route('admin.customizer.options.toggle', $sw->id) }}">
                                    @csrf
                                    <input type="hidden" name="tab" value="swatches">
                                    <button type="submit" class="text-[10px] font-bold {{ $sw->is_active ? 'text-emerald-500' : 'text-slate-400' }} hover:underline cursor-pointer">
                                        {{ $sw->is_active ? '● Active' : '○ Disabled' }}
                                    </button>
                                </form>

                                <div class="flex items-center gap-2">
                                    <button 
                                        type="button" 
                                        @click="swatchData = { 
                                            id: {{ $sw->id }}, 
                                            name: '{{ addslashes($sw->name) }}', 
                                            hex: '{{ $hex }}', 
                                            pantone: '{{ addslashes($pantone) }}',
                                            garment_types: {{ json_encode($sw->garment_types ?? ['all']) }}
                                        }; editSwatchModal = true"
                                        class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-bold transition cursor-pointer"
                                    >
                                        Edit
                                    </button>

                                    <form method="POST" action="{{ route('admin.customizer.options.destroy', $sw->id) }}" onsubmit="return confirm('Permanently remove {{ addslashes($sw->name) }} swatch?');">
                                        @csrf
                                        @method('DELETE')
                                        <input type="hidden" name="tab" value="swatches">
                                        <button type="submit" class="px-2 py-0.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 text-[10px] font-bold transition cursor-pointer">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Swatch Modal -->
    <div x-show="editSwatchModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs" x-cloak>
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4" @click.away="editSwatchModal = false">
            <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Edit Color Swatch</h3>
                <button type="button" @click="editSwatchModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold">&times;</button>
            </div>

            <form method="POST" action="{{ route('admin.customizer.options.store') }}" class="space-y-4">
                @csrf
                <input type="hidden" name="id" :value="swatchData.id">
                <input type="hidden" name="category" value="color_swatch">
                <input type="hidden" name="tab" value="swatches">

                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Color Name *</label>
                    <input type="text" name="name" x-model="swatchData.name" required class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Hex Color *</label>
                        <div class="flex items-center gap-2">
                            <input type="color" x-model="swatchData.hex" class="w-9 h-9 rounded-lg cursor-pointer border-0 p-0 shrink-0">
                            <input type="text" name="value[hex]" x-model="swatchData.hex" required class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono uppercase text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Pantone Ref</label>
                        <input type="text" name="value[pantone]" x-model="swatchData.pantone" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>
                </div>

                <div class="flex items-center justify-end gap-2 pt-2">
                    <button type="button" @click="editSwatchModal = false" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm">
                        Update Swatch
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 2: DECORATION METHODS -->
    <!-- ========================================== -->
    <div x-show="activeTab === 'decorations'" class="space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Embellishment & Decoration Techniques</h3>
                    <p class="text-xs text-slate-500">Manage techniques, minimum order quantities (MOQ), wash durability, and factory surcharges.</p>
                </div>
                <button 
                    type="button" 
                    @click="decModalMode = 'create'; decData = { id: null, name: '', key: '', tagline: '', desc: '', durability: '100+ Washes', moq: 30, surcharge: 0, garment_types: ['all'] }; decModalOpen = true"
                    class="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm self-start cursor-pointer flex items-center gap-1.5"
                >
                    <span>+ Add Technique</span>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                @foreach($decorations as $dec)
                    @php 
                        $val = $dec->value ?? []; 
                    @endphp
                    <div class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950 flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition">
                        <div>
                            <div class="flex items-center justify-between gap-2">
                                <h4 class="font-bold text-xs text-slate-900 dark:text-white">{{ $dec->name }}</h4>
                                <span class="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                                    MOQ {{ $val['moq'] ?? 30 }}
                                </span>
                            </div>
                            <p class="text-[11px] text-blue-500 font-semibold mt-0.5">{{ $val['tagline'] ?? '' }}</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">{{ $val['desc'] ?? '' }}</p>

                            @if(!empty($val['surcharge_per_unit']))
                                <div class="mt-2 text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                                    Surcharge: +${{ number_format($val['surcharge_per_unit'], 2) }}/unit
                                </div>
                            @endif
                        </div>

                        <div class="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                            <span class="text-slate-400 text-[10px] truncate max-w-[140px]">{{ $val['durability'] ?? '100+ Washes' }}</span>
                            
                            <div class="flex items-center gap-2">
                                <form method="POST" action="{{ route('admin.customizer.options.toggle', $dec->id) }}">
                                    @csrf
                                    <input type="hidden" name="tab" value="decorations">
                                    <button type="submit" class="text-[10px] font-bold {{ $dec->is_active ? 'text-emerald-500' : 'text-slate-400' }} hover:underline cursor-pointer">
                                        {{ $dec->is_active ? 'Active' : 'Disabled' }}
                                    </button>
                                </form>

                                <button 
                                    type="button" 
                                    @click="decModalMode = 'edit'; decData = { 
                                        id: {{ $dec->id }}, 
                                        name: '{{ addslashes($dec->name) }}', 
                                        key: '{{ addslashes($dec->key) }}',
                                        tagline: '{{ addslashes($val['tagline'] ?? '') }}', 
                                        desc: '{{ addslashes($val['desc'] ?? '') }}', 
                                        durability: '{{ addslashes($val['durability'] ?? '100+ Washes') }}', 
                                        moq: {{ $val['moq'] ?? 30 }}, 
                                        surcharge: {{ $val['surcharge_per_unit'] ?? 0 }},
                                        garment_types: {{ json_encode($dec->garment_types ?? ['all']) }}
                                    }; decModalOpen = true"
                                    class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-bold transition cursor-pointer"
                                >
                                    Edit
                                </button>

                                <form method="POST" action="{{ route('admin.customizer.options.destroy', $dec->id) }}" onsubmit="return confirm('Permanently remove {{ addslashes($dec->name) }} technique?');">
                                    @csrf
                                    @method('DELETE')
                                    <input type="hidden" name="tab" value="decorations">
                                    <button type="submit" class="px-2 py-0.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 text-[10px] font-bold transition cursor-pointer">
                                        Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    <!-- Add/Edit Decoration Modal -->
    <div x-show="decModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs" x-cloak>
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto" @click.away="decModalOpen = false">
            <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider" x-text="decModalMode === 'create' ? 'Add Decoration Technique' : 'Edit Decoration Technique'"></h3>
                <button type="button" @click="decModalOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold">&times;</button>
            </div>

            <form method="POST" action="{{ route('admin.customizer.options.store') }}" class="space-y-4">
                @csrf
                <input type="hidden" name="id" :value="decData.id">
                <input type="hidden" name="category" value="decoration_method">
                <input type="hidden" name="tab" value="decorations">

                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Technique Name *</label>
                    <input type="text" name="name" x-model="decData.name" required placeholder="e.g. 3D Puff High-Density Embroidery" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                </div>

                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Tagline / Subheading</label>
                    <input type="text" name="value[tagline]" x-model="decData.tagline" placeholder="e.g. 15-Needle Structural Crests" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                </div>

                <div class="grid grid-cols-3 gap-3">
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">MOQ *</label>
                        <input type="number" name="value[moq]" x-model="decData.moq" min="1" required class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Surcharge ($)</label>
                        <input type="number" step="0.25" name="value[surcharge_per_unit]" x-model="decData.surcharge" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Durability</label>
                        <input type="text" name="value[durability]" x-model="decData.durability" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>
                </div>

                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Description</label>
                    <textarea name="value[desc]" x-model="decData.desc" rows="3" placeholder="Technical specifications for pattern makers and machine calibration..." class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"></textarea>
                </div>

                <div class="flex items-center justify-end gap-2 pt-2">
                    <button type="button" @click="decModalOpen = false" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm">
                        <span x-text="decModalMode === 'create' ? '+ Save Technique' : 'Update Technique'"></span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 3: TYPOGRAPHY & FONTS -->
    <!-- ========================================== -->
    <div x-show="activeTab === 'fonts'" class="space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Lettering & Monogram Fonts</h3>
                    <p class="text-xs text-slate-500">Dynamic font library rendered inside the Studio canvas for names, jersey numbers, and patches.</p>
                </div>
                <button 
                    type="button" 
                    @click="fontModalMode = 'create'; fontData = { id: null, name: '', key: '', family: '', style: '', category: 'Collegiate' }; fontModalOpen = true"
                    class="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm self-start cursor-pointer flex items-center gap-1.5"
                >
                    <span>+ Add Font</span>
                </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                @foreach($fonts as $f)
                    @php 
                        $val = $f->value ?? []; 
                        $family = $val['family'] ?? 'sans-serif';
                    @endphp
                    <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition">
                        <div class="flex items-center justify-between">
                            <h4 class="font-bold text-xs text-slate-900 dark:text-white">{{ $f->name }}</h4>
                            <span class="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 font-semibold">{{ $val['category'] ?? 'Standard' }}</span>
                        </div>
                        <div class="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 text-center shadow-2xs">
                            <span class="text-xl font-bold uppercase tracking-wider block truncate" style="font-family: {{ $family }}">
                                ABC 123
                            </span>
                        </div>
                        <div class="text-[10px] font-mono text-slate-400 truncate">
                            Family: {{ $family }}
                        </div>
                        <div class="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <form method="POST" action="{{ route('admin.customizer.options.toggle', $f->id) }}">
                                @csrf
                                <input type="hidden" name="tab" value="fonts">
                                <button type="submit" class="text-[10px] font-bold {{ $f->is_active ? 'text-emerald-500' : 'text-slate-400' }} hover:underline cursor-pointer">
                                    {{ $f->is_active ? 'Active' : 'Disabled' }}
                                </button>
                            </form>

                            <div class="flex items-center gap-2">
                                <button 
                                    type="button" 
                                    @click="fontModalMode = 'edit'; fontData = { 
                                        id: {{ $f->id }}, 
                                        name: '{{ addslashes($f->name) }}', 
                                        key: '{{ addslashes($f->key) }}',
                                        family: '{{ addslashes($family) }}', 
                                        style: '{{ addslashes($val['style'] ?? '') }}', 
                                        category: '{{ addslashes($val['category'] ?? 'Collegiate') }}'
                                    }; fontModalOpen = true"
                                    class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-bold transition cursor-pointer"
                                >
                                    Edit
                                </button>

                                <form method="POST" action="{{ route('admin.customizer.options.destroy', $f->id) }}" onsubmit="return confirm('Permanently remove {{ addslashes($f->name) }} font?');">
                                    @csrf
                                    @method('DELETE')
                                    <input type="hidden" name="tab" value="fonts">
                                    <button type="submit" class="px-2 py-0.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 text-[10px] font-bold transition cursor-pointer">
                                        Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    <!-- Add/Edit Font Modal -->
    <div x-show="fontModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs" x-cloak>
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4" @click.away="fontModalOpen = false">
            <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider" x-text="fontModalMode === 'create' ? 'Add Typography Font' : 'Edit Typography Font'"></h3>
                <button type="button" @click="fontModalOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold">&times;</button>
            </div>

            <form method="POST" action="{{ route('admin.customizer.options.store') }}" class="space-y-4">
                @csrf
                <input type="hidden" name="id" :value="fontData.id">
                <input type="hidden" name="category" value="font">
                <input type="hidden" name="tab" value="fonts">

                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Font Display Name *</label>
                    <input type="text" name="name" x-model="fontData.name" required placeholder="e.g. Oxford Heavy Block" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                </div>

                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">CSS Font Family *</label>
                    <input type="text" name="value[family]" x-model="fontData.family" required placeholder="e.g. Impact, 'Arial Black', sans-serif" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Style Subtitle</label>
                        <input type="text" name="value[style]" x-model="fontData.style" placeholder="e.g. Heavy Collegiate" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Category</label>
                        <select name="value[category]" x-model="fontData.category" class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                            <option value="Collegiate">Collegiate</option>
                            <option value="Editorial">Editorial</option>
                            <option value="Streetwear">Streetwear</option>
                            <option value="Athletic">Athletic</option>
                            <option value="Script">Script</option>
                            <option value="Technical">Technical</option>
                        </select>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-2 pt-2">
                    <button type="button" @click="fontModalOpen = false" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm">
                        <span x-text="fontModalMode === 'create' ? '+ Save Font' : 'Update Font'"></span>
                    </button>
                </div>
            </form>
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

                    <button type="submit" class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer">
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
                                <div class="w-16 h-16 flex items-center justify-center p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xs">
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
                                        <button type="submit" class="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer">
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
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Core Customizable Garment Profiles ({{ $templates->count() }} Archetypes)</h3>
                    <p class="text-xs text-slate-500">Profiles define customizable zones, fabric GSM weights, and configurator endpoints.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                @foreach($templates as $tmpl)
                    @php $val = $tmpl->value; @endphp
                    <div class="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-950 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition">
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

                            <button 
                                type="button" 
                                @click="templateData = {
                                    id: {{ $tmpl->id }},
                                    name: '{{ addslashes($tmpl->name) }}',
                                    gsm: {{ $val['default_gsm'] ?? 450 }},
                                    fabric: '{{ addslashes($val['fabric'] ?? '') }}',
                                    model_type: '{{ addslashes($val['model_type'] ?? '') }}'
                                }; templateModalOpen = true"
                                class="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold transition cursor-pointer"
                            >
                                Edit Specs
                            </button>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    <!-- Edit Template Specs Modal -->
    <div x-show="templateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs" x-cloak>
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4" @click.away="templateModalOpen = false">
            <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Edit Garment Template Specs</h3>
                <button type="button" @click="templateModalOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold">&times;</button>
            </div>

            <form method="POST" action="{{ route('admin.customizer.options.store') }}" class="space-y-4">
                @csrf
                <input type="hidden" name="id" :value="templateData.id">
                <input type="hidden" name="category" value="garment_template">
                <input type="hidden" name="tab" value="templates">

                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Garment Profile Name *</label>
                    <input type="text" name="name" x-model="templateData.name" required class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Default GSM Weight</label>
                        <input type="number" name="value[default_gsm]" x-model="templateData.gsm" required class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Model Type</label>
                        <input type="text" name="value[model_type]" x-model="templateData.model_type" required class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>
                </div>

                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Fabric Specification</label>
                    <input type="text" name="value[fabric]" x-model="templateData.fabric" required class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                </div>

                <div class="flex items-center justify-end gap-2 pt-2">
                    <button type="button" @click="templateModalOpen = false" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm">
                        Update Specs
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 6: POM MEASUREMENTS & SIZE CHARTS -->
    <!-- ========================================== -->
    <div x-show="activeTab === 'size_charts'" class="space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Factory Point of Measure (POM) Grading Matrices</h3>
                    <p class="text-xs text-slate-500">Directly edit measurements (in cm) for every size. These matrices feed into generated Tech Packs for Sialkot pattern cutters.</p>
                </div>
            </div>

            @foreach($templates as $tmpl)
                @php
                    $grading = $tmpl->value['pom_grading'] ?? [];
                    $firstRow = is_array($grading) && count($grading) > 0 ? current($grading) : [];
                    $gradingKeys = is_array($firstRow) ? array_keys($firstRow) : [];
                @endphp
                @if(!empty($grading) && !empty($gradingKeys))
                    <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 space-y-4">
                        <form method="POST" action="{{ route('admin.customizer.templates.pom', $tmpl->id) }}">
                            @csrf
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                                <div>
                                    <h4 class="font-bold text-sm text-slate-900 dark:text-white uppercase font-mono">{{ $tmpl->name }} Grading Matrix</h4>
                                    <span class="text-[11px] text-slate-400">All measures in centimeters (cm). Click values to edit inline.</span>
                                </div>
                                <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm self-start cursor-pointer flex items-center gap-1.5">
                                    <span>💾 Save {{ $tmpl->name }} Matrix</span>
                                </button>
                            </div>

                            <div class="overflow-x-auto pt-3">
                                <table class="w-full text-left text-xs font-mono">
                                    <thead>
                                        <tr class="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase">
                                            <th class="pb-2.5 pr-4">Size</th>
                                            @foreach($gradingKeys as $key)
                                                <th class="pb-2.5 px-2 text-center">{{ str_replace('_', ' ', $key) }}</th>
                                            @endforeach
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                                        @foreach($grading as $size => $points)
                                            <tr class="hover:bg-white/60 dark:hover:bg-slate-900/60 transition">
                                                <td class="py-2.5 pr-4 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">{{ $size }}</td>
                                                @foreach($gradingKeys as $key)
                                                    @php $val = $points[$key] ?? 0; @endphp
                                                    <td class="py-2 px-2 text-center">
                                                        <input 
                                                            type="number" 
                                                            step="0.5" 
                                                            name="pom_grading[{{ $size }}][{{ $key }}]" 
                                                            value="{{ $val }}" 
                                                            class="w-20 px-2 py-1.5 text-xs text-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                                                        >
                                                    </td>
                                                @endforeach
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    </div>
                @endif
            @endforeach
        </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 7: VOLUME WHOLESALE TIER PRICING -->
    <!-- ========================================== -->
    <div x-show="activeTab === 'pricing'" class="space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Volume Wholesale Tier Pricing</h3>
                    <p class="text-xs text-slate-500">Configure factory quantity tier discounts, unit prices ($ USD), and savings badges for each garment archetype. These prices directly power the live Customizer studio calculation and cart estimates.</p>
                </div>
            </div>

            @foreach($templates as $tmpl)
                @php
                    $tiers = $tmpl->value['wholesale_tiers'] ?? [
                        ['min_qty' => 50, 'max_qty' => 99, 'unit_price' => 24.50, 'savings' => 'Standard MOQ'],
                        ['min_qty' => 100, 'max_qty' => 249, 'unit_price' => 21.80, 'savings' => 'Save 11%'],
                        ['min_qty' => 250, 'max_qty' => 499, 'unit_price' => 19.20, 'savings' => 'Save 22%'],
                        ['min_qty' => 500, 'max_qty' => null, 'unit_price' => 16.50, 'savings' => 'Save 33%'],
                    ];
                @endphp
                <div class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 space-y-4">
                    <form method="POST" action="{{ route('admin.customizer.templates.pricing', $tmpl->id) }}">
                        @csrf
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                            <div>
                                <h4 class="font-bold text-sm text-slate-900 dark:text-white uppercase font-mono">{{ $tmpl->name }} Tier Pricing</h4>
                                <span class="text-[11px] text-slate-400">All prices in USD ($). For max volume tier, leave Max Qty blank for "500+ pcs".</span>
                            </div>
                            <button type="submit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm self-start cursor-pointer flex items-center gap-1.5">
                                <span>💾 Save {{ $tmpl->name }} Pricing</span>
                            </button>
                        </div>

                        <div class="overflow-x-auto pt-3">
                            <table class="w-full text-left text-xs font-mono">
                                <thead>
                                    <tr class="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase">
                                        <th class="pb-2.5 px-3">Tier #</th>
                                        <th class="pb-2.5 px-3">Min Qty</th>
                                        <th class="pb-2.5 px-3">Max Qty (blank for +)</th>
                                        <th class="pb-2.5 px-3">Unit Price ($ USD)</th>
                                        <th class="pb-2.5 px-3">Savings Badge / Note</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                                    @foreach($tiers as $idx => $tier)
                                        <tr class="hover:bg-white/60 dark:hover:bg-slate-900/60 transition">
                                            <td class="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">Tier {{ $idx + 1 }}</td>
                                            <td class="py-2 px-3">
                                                <input 
                                                    type="number" 
                                                    min="1"
                                                    name="wholesale_tiers[{{ $idx }}][min_qty]" 
                                                    value="{{ $tier['min_qty'] ?? 50 }}" 
                                                    required
                                                    class="w-24 px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                                                >
                                            </td>
                                            <td class="py-2 px-3">
                                                <input 
                                                    type="number" 
                                                    min="1"
                                                    name="wholesale_tiers[{{ $idx }}][max_qty]" 
                                                    value="{{ $tier['max_qty'] ?? '' }}" 
                                                    placeholder="Unlimited"
                                                    class="w-28 px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                                                >
                                            </td>
                                            <td class="py-2 px-3">
                                                <div class="relative flex items-center">
                                                    <span class="absolute left-2.5 text-slate-400 text-xs">$</span>
                                                    <input 
                                                        type="number" 
                                                        step="0.01" 
                                                        min="0"
                                                        name="wholesale_tiers[{{ $idx }}][unit_price]" 
                                                        value="{{ $tier['unit_price'] ?? 0 }}" 
                                                        required
                                                        class="w-28 pl-6 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                                                    >
                                                </div>
                                            </td>
                                            <td class="py-2 px-3">
                                                <input 
                                                    type="text" 
                                                    name="wholesale_tiers[{{ $idx }}][savings]" 
                                                    value="{{ $tier['savings'] ?? '' }}" 
                                                    placeholder="e.g. Save 15%"
                                                    class="w-48 px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                                                >
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </form>
                </div>
            @endforeach
        </div>
    </div>

</div>
@endsection
