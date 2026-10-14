@extends('layouts.admin')

@section('title', 'Factory Tech Packs')
@section('header_title', 'Factory Tech Packs & POM Specification Sheets')

@section('content')
<div 
    class="space-y-6" 
    x-data="{ 
        selectedPack: null,
        modalIsFullscreen: false,
        modelZoom: 100,
        elevationViewMode: 'dual',
        modelBgColor: '#0a0d14',

        zoomIn() {
            if (this.modelZoom < 180) this.modelZoom += 15;
        },
        zoomOut() {
            if (this.modelZoom > 60) this.modelZoom -= 15;
        },
        resetZoom() {
            this.modelZoom = 100;
        },

        getGarmentType() {
            if (!this.selectedPack) return 'basketball';
            const name = (this.selectedPack.style_name || '').toLowerCase();
            if (name.includes('basketball') || name.includes('jersey')) return 'basketball';
            if (name.includes('varsity') || name.includes('letterman')) return 'varsity';
            if (name.includes('hoodie') || name.includes('fleece') || name.includes('terry')) return 'hoodie';
            if (name.includes('equestrian') || name.includes('riding')) return 'equestrian';
            return 'basketball';
        },

        getPartColor(partName, fallback = '#1E3A2F') {
            if (!this.selectedPack || !this.selectedPack.parts_colors) return fallback;
            let colors = this.selectedPack.parts_colors;
            if (typeof colors === 'string') {
                try { colors = JSON.parse(colors); } catch(e) { return fallback; }
            }
            if (typeof colors === 'object' && colors !== null) {
                return colors[partName] || colors[partName.toLowerCase()] || fallback;
            }
            return fallback;
        },

        getPartMaskStyle(assetPath, hex) {
            const clean = (hex || '#1E3A2F').toLowerCase().trim();
            let blend = 'multiply';
            let opacity = '0.92';
            if (clean === '#ffffff' || clean === '#fafafa' || clean === '#f8fafc') {
                blend = 'screen';
                opacity = '0.22';
            } else if (clean === '#f4f4ef' || clean === '#f3efe6' || clean === '#eae3d2' || clean === '#e4e4e7') {
                blend = 'multiply';
                opacity = '0.52';
            } else if (clean === '#0a0a0a' || clean === '#111111' || clean === '#1c1c1e') {
                blend = 'multiply';
                opacity = '0.96';
            }
            const encoded = encodeURI(assetPath);
            return `background-color: ${hex}; -webkit-mask-image: url('${encoded}'); mask-image: url('${encoded}'); -webkit-mask-size: contain; mask-size: contain; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; mix-blend-mode: ${blend}; opacity: ${opacity};`;
        },

        getArtworkLayers() {
            if (!this.selectedPack || !this.selectedPack.artwork_layers) return [];
            let layers = this.selectedPack.artwork_layers;
            if (typeof layers === 'string') {
                try { layers = JSON.parse(layers); } catch(e) { return []; }
            }
            if (Array.isArray(layers)) {
                return layers.filter(l => l && (l.url || l.dataUrl));
            }
            if (layers && typeof layers === 'object' && (layers.url || layers.dataUrl)) {
                return [layers];
            }
            return [];
        },

        getFrontArtworkLayers() {
            return this.getArtworkLayers().filter(l => !l.view || l.view === 'front');
        },

        getBackArtworkLayers() {
            return this.getArtworkLayers().filter(l => l.view === 'back');
        },

        getArtworkStyle(layer, defaultX = 50, defaultY = 30) {
            let rawX = (layer.x !== undefined && layer.x !== null) ? Number(layer.x) : defaultX;
            let rawY = (layer.y !== undefined && layer.y !== null) ? Number(layer.y) : defaultY;
            let xPct = rawX > 100 ? ((rawX / 420) * 100) : rawX;
            let yPct = rawY > 100 ? ((rawY / 420) * 100) : rawY;
            let scale = ((layer.scale ?? 1) * 22);
            let rot = layer.rotation ?? 0;
            return `left: ${xPct}%; top: ${yPct}%; width: ${scale}%; transform: translate(-50%, -50%) rotate(${rot}deg); max-height: 40%;`;
        },

        getMonogram() {
            if (!this.selectedPack || !this.selectedPack.monogram_state) return null;
            let mono = this.selectedPack.monogram_state;
            if (typeof mono === 'string') {
                try { mono = JSON.parse(mono); } catch(e) { return null; }
            }
            if (mono && typeof mono === 'object') {
                if (mono.text || mono.enabled) return mono;
            }
            return null;
        },

        getPomMatrix() {
            if (!this.selectedPack || !this.selectedPack.pom_measurements) return null;
            const pom = this.selectedPack.pom_measurements;
            return pom.grading_matrix || pom.matrix || null;
        },

        getPomVal(size, key) {
            const matrix = this.getPomMatrix();
            if (!matrix || !matrix[size]) return '-';
            const val = matrix[size][key] ?? matrix[size][key.replace('_drop', '')] ?? matrix[size][key.replace('_width', '')] ?? '-';
            return val !== '-' ? val : '-';
        },

        getSizeBreakdown() {
            if (!this.selectedPack) return null;
            if (this.selectedPack.size_breakdown) {
                let sb = this.selectedPack.size_breakdown;
                if (typeof sb === 'string') {
                    try { sb = JSON.parse(sb); } catch(e) {}
                }
                if (sb && typeof sb === 'object') return sb;
            }
            if (this.selectedPack.pom_measurements && this.selectedPack.pom_measurements.breakdown) {
                return this.selectedPack.pom_measurements.breakdown;
            }
            return null;
        },

        getTotalUnits() {
            if (!this.selectedPack) return 0;
            if (this.selectedPack.total_units) return Number(this.selectedPack.total_units);
            const sb = this.getSizeBreakdown();
            if (sb && typeof sb === 'object') {
                return Object.values(sb).reduce((sum, v) => sum + (Number(v) || 0), 0);
            }
            return 0;
        },

        hasCustomBranding() {
            return this.getArtworkLayers().length > 0 || 
                   !!this.getMonogram() || 
                   !!this.selectedPack?.decoration_method || 
                   !!this.selectedPack?.wash_type || 
                   this.getTotalUnits() > 0;
        },

        printTechPack() {
            window.print();
        }
    }"
>
    
    <!-- Top Header Bar with Clean Duplicates Action -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Generated Factory Tech Packs</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Production measurement specifications, Bill of Materials (BOM), and stitching guidelines auto-synchronized from customizer</p>
        </div>

        <div class="flex items-center gap-3">
            <span class="rounded-xl bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {{ $techPacks->total() }} Total Tech Packs
            </span>
        </div>
    </div>

    @if(session('success'))
        <div class="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>{{ session('success') }}</span>
        </div>
    @endif

    <!-- Tech Packs Table List -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        @if($techPacks->isEmpty())
            <div class="py-16 text-center text-slate-400 text-sm space-y-2">
                <div class="text-3xl">📋</div>
                <div class="font-bold text-slate-600 dark:text-slate-300">No factory tech packs generated yet.</div>
                <p class="text-xs text-slate-400 max-w-sm mx-auto">
                    When buyers customize garments or click &ldquo;Generate Tech Pack&rdquo; in the customizer, the factory spec sheet will automatically synchronize here.
                </p>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead>
                        <tr class="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                            <th class="pb-3">Tech Pack Code</th>
                            <th class="pb-3">Preview</th>
                            <th class="pb-3">Style Name & Season</th>
                            <th class="pb-3">Fabric & GSM</th>
                            <th class="pb-3">Customization</th>
                            <th class="pb-3">Source & Buyer</th>
                            <th class="pb-3">Date</th>
                            <th class="pb-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                        @foreach($techPacks as $tp)
                            @php
                                $lowerStyle = strtolower($tp->style_name ?? '');
                                $defaultSilhouette = asset('hoodie/front_body.png');
                                if (str_contains($lowerStyle, 'basketball') || str_contains($lowerStyle, 'jersey')) {
                                    $defaultSilhouette = asset('basketball/front (3) (1).png');
                                } elseif (str_contains($lowerStyle, 'varsity') || str_contains($lowerStyle, 'letterman')) {
                                    $defaultSilhouette = asset('varsity_jacket/FRONT_BODY.png');
                                } elseif (str_contains($lowerStyle, 'equestrian') || str_contains($lowerStyle, 'riding')) {
                                    $defaultSilhouette = asset('equastarian/front (2) (1).png');
                                }

                                $previewSrc = $defaultSilhouette;
                                if (!empty($tp->preview_front) && !str_contains($tp->preview_front, 'categories/streetwear') && !str_contains($tp->preview_front, 'categories/activewear')) {
                                    $previewSrc = $tp->preview_front;
                                }

                                $artworks = $tp->artwork_layers ?? [];
                                $hasArtwork = !empty($artworks) && (is_array($artworks) ? count($artworks) > 0 : true);
                            @endphp
                            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                <td class="py-4">
                                    <div class="space-y-1">
                                        <span class="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md text-xs inline-block">
                                            {{ $tp->code }}
                                        </span>
                                        <div class="flex items-center gap-1.5">
                                            <span class="text-[10px] font-mono text-slate-400 font-bold">v{{ $tp->version ?? '1.0' }}</span>
                                            @if($tp->status === 'approved')
                                                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Approved</span>
                                            @elseif($tp->status === 'rejected')
                                                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Rejected</span>
                                            @elseif($tp->status === 'archived')
                                                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-500 border border-slate-500/20">Archived</span>
                                            @else
                                                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Submitted</span>
                                            @endif
                                        </div>
                                    </div>
                                </td>
                                <td class="py-4">
                                    <div class="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950/20 p-1 flex items-center justify-center overflow-hidden relative">
                                        <img 
                                            src="{{ $previewSrc }}" 
                                            alt="{{ $tp->style_name }}"
                                            class="w-full h-full object-contain"
                                            onerror="this.src='{{ $defaultSilhouette }}'"
                                        />
                                        @if($hasArtwork)
                                            <span class="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500 shadow-sm" title="Contains custom uploaded artwork"></span>
                                        @endif
                                    </div>
                                </td>
                                <td class="py-4">
                                    <div class="font-bold text-slate-900 dark:text-white">{{ $tp->style_name }}</div>
                                    <span class="text-xs text-slate-400 block font-normal">{{ $tp->season }}</span>
                                </td>
                                <td class="py-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    <div>{{ $tp->fabric_spec }}</div>
                                    <span class="text-[11px] text-blue-500 font-bold font-mono">{{ $tp->target_gsm }} GSM</span>
                                </td>
                                <td class="py-4 text-xs">
                                    <div class="space-y-1">
                                        @if($tp->decoration_method)
                                            <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                                🧵 {{ $tp->decoration_method }}
                                            </span>
                                        @endif
                                        @if($hasArtwork)
                                            <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                🖼️ Logo Uploaded
                                            </span>
                                        @endif
                                        @if($tp->total_units)
                                            <span class="inline-block text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                                📦 {{ $tp->total_units }} Units
                                            </span>
                                        @endif
                                    </div>
                                </td>
                                <td class="py-4 text-xs text-slate-500">
                                    @if($tp->customer)
                                        <div class="space-y-0.5">
                                            @if($tp->customer->company_name)
                                                <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                                                    <span>🏢</span> {{ $tp->customer->company_name }}
                                                </div>
                                            @endif
                                            <div class="font-semibold text-slate-700 dark:text-slate-300">
                                                {{ $tp->customer->full_name }}
                                            </div>
                                            <div class="text-[11px] text-blue-500 dark:text-blue-400 font-mono">
                                                {{ $tp->customer->email }}
                                            </div>
                                            @if($tp->customer->phone)
                                                <div class="text-[10px] text-slate-400 font-mono">
                                                    📞 {{ $tp->customer->phone }}
                                                </div>
                                            @endif
                                        </div>
                                    @else
                                        <div class="font-medium text-slate-500 italic">
                                            Studio Customizer (Guest)
                                        </div>
                                    @endif
                                    <div class="mt-1.5 flex flex-wrap gap-1">
                                        @if($tp->customizerDesign)
                                            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                Linked: {{ $tp->customizerDesign->design_code }}
                                            </span>
                                        @endif
                                        @php
                                            $linkedOrder = $tp->orderItems->first()?->order;
                                        @endphp
                                        @if($linkedOrder)
                                            <a href="{{ route('admin.orders.show', $linkedOrder->id) }}" class="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-500/20 hover:underline">
                                                Order: #{{ $linkedOrder->order_number }}
                                            </a>
                                        @endif
                                    </div>
                                </td>
                                <td class="py-4 text-xs text-slate-500">
                                    {{ $tp->created_at->format('M d, Y • H:i') }}
                                </td>
                                <td class="py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button 
                                            type="button"
                                            @click="selectedPack = {{ json_encode($tp) }}"
                                            class="rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-sm cursor-pointer"
                                        >
                                            View Tech Pack
                                        </button>

                                        <form method="POST" action="{{ route('admin.tech-packs.destroy', $tp->id) }}" onsubmit="return confirm('Delete this tech pack?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 hover:text-rose-700 px-2 py-1.5 text-xs font-bold transition cursor-pointer">
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="mt-6">
                {{ $techPacks->links() }}
            </div>
        @endif
    </div>

    <!-- ========================================================================= -->
    <!-- PREMIER FACTORY TECH PACK MODAL (FRONTEND-MATCHED, STRICTLY NO-OVERFLOW) -->
    <!-- ========================================================================= -->
    <div 
        x-show="selectedPack" 
        x-cloak 
        class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden no-print"
        @keydown.escape.window="selectedPack = null"
    >
        <div 
            :class="modalIsFullscreen ? 'fixed inset-2 sm:inset-4 w-auto max-w-none h-auto max-h-none rounded-xl' : 'w-full max-w-6xl h-[88vh] max-h-[88vh] rounded-2xl'"
            class="bg-[#0E131F] text-slate-100 border border-slate-700/80 flex flex-col shadow-2xl overflow-hidden transition-all duration-200"
            @click.outside="selectedPack = null"
            id="tech-pack-printable-modal"
        >
            <!-- Top Header Bar (Sticky, Never Overflows) -->
            <div class="shrink-0 p-4 sm:p-5 border-b border-slate-800 bg-[#0A0E17] flex items-center justify-between">
                <div>
                    <div class="flex items-center gap-2 mb-1.5">
                        <span class="inline-block bg-[#D10115] text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                            FACTORY TECH-PACK
                        </span>
                        <span class="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                            FLOOR APPROVED • ISO 9001
                        </span>
                        <span class="text-[11px] font-mono text-slate-400 font-bold" x-text="selectedPack?.code"></span>
                    </div>
                    <h3 class="text-base sm:text-xl font-black text-white uppercase tracking-tight" x-text="selectedPack?.style_name"></h3>
                    <p class="text-xs text-slate-400 font-mono mt-0.5" x-text="'Season: ' + selectedPack?.season + ' • Spec: ' + selectedPack?.fabric_spec + ' (' + selectedPack?.target_gsm + ' GSM)'"></p>
                </div>

                <div class="flex items-center flex-wrap gap-2">
                    <!-- Approve Button -->
                    <template x-if="selectedPack && selectedPack.status !== 'approved'">
                        <form :action="'/admin/tech-packs/' + selectedPack.id + '/approve'" method="POST" class="inline">
                            @csrf
                            <button type="submit" class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer">
                                <span>✓ Approve</span>
                            </button>
                        </form>
                    </template>

                    <!-- Reject Button -->
                    <template x-if="selectedPack && selectedPack.status !== 'rejected'">
                        <form :action="'/admin/tech-packs/' + selectedPack.id + '/reject'" method="POST" class="inline" onsubmit="let r = prompt('Enter revision feedback notes for design team:'); if(!r) return false; this.reason.value = r;">
                            @csrf
                            <input type="hidden" name="reason" value="">
                            <button type="submit" class="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition cursor-pointer">
                                <span>✕ Reject</span>
                            </button>
                        </form>
                    </template>

                    <!-- PDF / Print Link -->
                    <a 
                        :href="'/admin/tech-packs/' + selectedPack?.id + '/print'" 
                        target="_blank"
                        class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                        title="Open Printable Factory Spec Sheet PDF"
                    >
                        <span>🖨️ PDF Spec</span>
                    </a>

                    <!-- Fullscreen / Standard Toggle Button -->
                    <button 
                        @click="modalIsFullscreen = !modalIsFullscreen" 
                        class="text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1.5 rounded-xl transition text-xs font-bold cursor-pointer flex items-center gap-1 border border-slate-700/60"
                        :title="modalIsFullscreen ? 'Restore Standard Size' : 'Expand Fullscreen'"
                    >
                        <span x-show="!modalIsFullscreen">⛶ Expand</span>
                        <span x-show="modalIsFullscreen">🗗 Standard</span>
                    </button>

                    <button 
                        @click="selectedPack = null" 
                        class="text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 p-2 rounded-xl transition text-base font-bold cursor-pointer"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
            </div>

            <!-- Modal Content Body (Scrollable, min-h-0 prevents flex overflow) -->
            <div class="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    <!-- Left Column (5 Cols): Product Mockup Visuals & Color Mapping -->
                    <div class="lg:col-span-5 space-y-4">
                        
                        <!-- Studio Elevation Controls: Views, Zoom & Model Background Color -->
                        <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs shadow-sm">
                            <!-- View Switcher -->
                            <div class="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                                <button 
                                    type="button"
                                    @click="elevationViewMode = 'dual'" 
                                    :class="elevationViewMode === 'dual' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'"
                                    class="px-2 py-1 rounded text-[10px] font-mono uppercase transition cursor-pointer"
                                >
                                    ◫ Dual
                                </button>
                                <button 
                                    type="button"
                                    @click="elevationViewMode = 'front'" 
                                    :class="elevationViewMode === 'front' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'"
                                    class="px-2 py-1 rounded text-[10px] font-mono uppercase transition cursor-pointer"
                                >
                                    Front
                                </button>
                                <button 
                                    type="button"
                                    @click="elevationViewMode = 'back'" 
                                    :class="elevationViewMode === 'back' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'"
                                    class="px-2 py-1 rounded text-[10px] font-mono uppercase transition cursor-pointer"
                                >
                                    Back
                                </button>
                            </div>

                            <!-- Zoom Controls -->
                            <div class="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 font-mono text-[10px]">
                                <span class="text-slate-400 mr-1">Zoom:</span>
                                <button 
                                    type="button" 
                                    @click="zoomOut()" 
                                    class="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold cursor-pointer transition"
                                    title="Zoom Out"
                                >-</button>
                                <span class="text-slate-200 font-bold px-1 min-w-[32px] text-center" x-text="modelZoom + '%'"></span>
                                <button 
                                    type="button" 
                                    @click="zoomIn()" 
                                    class="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold cursor-pointer transition"
                                    title="Zoom In"
                                >+</button>
                                <button 
                                    type="button" 
                                    @click="resetZoom()" 
                                    class="ml-1 text-[9px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                                    title="Reset Zoom to 100%"
                                >↺</button>
                            </div>

                            <!-- Background Color Selector -->
                            <div class="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                                <span class="text-slate-400 text-[10px] font-mono mr-1">BG:</span>
                                <div class="flex items-center gap-1">
                                    <template x-for="bg in ['#0a0d14', '#1e222b', '#1e293b', '#3a3e47', '#f8fafc', '#000000']" :key="bg">
                                        <button 
                                            type="button"
                                            @click="modelBgColor = bg"
                                            class="w-4 h-4 rounded-full border transition cursor-pointer shrink-0"
                                            :class="modelBgColor === bg ? 'ring-2 ring-blue-500 border-white scale-110' : 'border-slate-700 hover:scale-105'"
                                            :style="'background-color: ' + bg"
                                            :title="'Set BG to ' + bg"
                                        ></button>
                                    </template>
                                    <input 
                                        type="color" 
                                        x-model="modelBgColor" 
                                        class="w-4 h-4 rounded cursor-pointer border-0 p-0 ml-0.5 bg-transparent"
                                        title="Custom Background Color"
                                    >
                                </div>
                            </div>
                        </div>

                        <!-- Front & Back Product Mockup Preview Cards -->
                        <div :class="elevationViewMode === 'dual' ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1 gap-3'">
                            
                            <!-- Front Elevation (Dynamic Multi-Layer Real Silhouette) -->
                            <div 
                                x-show="elevationViewMode === 'dual' || elevationViewMode === 'front'"
                                class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-between relative shadow-lg"
                            >
                                <div 
                                    class="w-full relative flex items-center justify-center p-2 overflow-hidden rounded-lg select-none transition-colors duration-200"
                                    :class="elevationViewMode === 'front' ? 'aspect-4/3 min-h-[280px]' : 'aspect-square'"
                                    :style="'background-color: ' + modelBgColor"
                                >
                                    <div 
                                        class="w-full h-full relative flex items-center justify-center transition-transform duration-200 origin-center"
                                        :style="'transform: scale(' + (modelZoom / 100) + ')'"
                                    >
                                    
                                    <!-- 1. Basketball Front Rendering -->
                                    <template x-if="getGarmentType() === 'basketball'">
                                        <div class="relative w-full h-full flex items-center justify-center">
                                            <!-- Shorts Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/basketball/front%20shorts%20(1).png" class="w-full h-full object-contain pointer-events-none drop-shadow-sm" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/basketball/front%20shorts%20(1).png', getPartColor('shorts', '#1E3A2F'))"></div>
                                            </div>
                                            <!-- Jersey Torso Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/basketball/front%20(3)%20(1).png" class="w-full h-full object-contain pointer-events-none drop-shadow-md" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/basketball/front%20(3)%20(1).png', getPartColor('jersey', '#1E3A2F'))"></div>
                                            </div>
                                            <!-- Collar & Ribs Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/basketball/front%20ribs%20(1).png" class="w-full h-full object-contain pointer-events-none" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/basketball/front%20ribs%20(1).png', getPartColor('ribs', '#FFFFFF'))"></div>
                                            </div>
                                            <!-- Uploaded Logo Overlays -->
                                            <template x-for="layer in getFrontArtworkLayers()" :key="layer.id || layer.url">
                                                <img 
                                                    :src="layer.url || layer.dataUrl" 
                                                    class="absolute pointer-events-none object-contain drop-shadow-lg z-20"
                                                    :style="'left: ' + (layer.x ?? 50) + '%; top: ' + (layer.y ?? 26) + '%; width: ' + ((layer.scale ?? 1) * 24) + '%; transform: translate(-50%, -50%) rotate(' + (layer.rotation ?? 0) + 'deg); max-height: 40%;'" 
                                                />
                                            </template>
                                            <!-- Monogram Letters Overlay -->
                                            <template x-if="getMonogram() && getMonogram().text">
                                                <div 
                                                    class="absolute font-black tracking-widest text-center pointer-events-none drop-shadow-lg uppercase z-20"
                                                    :style="'left: ' + (getMonogram().x ?? 50) + '%; top: ' + (getMonogram().y ?? 36) + '%; transform: translate(-50%, -50%); color: ' + (getMonogram().embroideryColor || getMonogram().fillColor || '#FFFFFF') + '; font-size: ' + ((getMonogram().scale ?? 1) * 1.35) + 'rem; text-shadow: 0 2px 4px rgba(0,0,0,0.8);'"
                                                    x-text="getMonogram().text"
                                                ></div>
                                            </template>
                                        </div>
                                    </template>

                                    <!-- 2. Varsity Jacket Front Rendering -->
                                    <template x-if="getGarmentType() === 'varsity'">
                                        <div class="relative w-full h-full flex items-center justify-center">
                                            <!-- Arms / Sleeves Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/varsity_jacket/FRONT_arms.png" class="w-full h-full object-contain pointer-events-none drop-shadow-sm" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/varsity_jacket/FRONT_arms.png', getPartColor('sleeves', '#FFFFFF'))"></div>
                                            </div>
                                            <!-- Body Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/varsity_jacket/FRONT_BODY.png" class="w-full h-full object-contain pointer-events-none drop-shadow-md" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/varsity_jacket/FRONT_BODY.png', getPartColor('body', '#800020'))"></div>
                                            </div>
                                            <!-- Ribs / Collar Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/varsity_jacket/FRONT_ribs.png" class="w-full h-full object-contain pointer-events-none" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/varsity_jacket/FRONT_ribs.png', getPartColor('ribs', '#111827'))"></div>
                                            </div>
                                            <!-- Buttons / Snaps Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/varsity_jacket/FRONT_buttons.png" class="w-full h-full object-contain pointer-events-none" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/varsity_jacket/FRONT_buttons.png', getPartColor('snaps', '#E5E7EB'))"></div>
                                            </div>
                                            <!-- Uploaded Logo Overlays -->
                                            <template x-for="layer in getFrontArtworkLayers()" :key="layer.id || layer.url">
                                                <img 
                                                    :src="layer.url || layer.dataUrl" 
                                                    class="absolute pointer-events-none object-contain drop-shadow-lg z-20"
                                                    :style="'left: ' + (layer.x ?? 32) + '%; top: ' + (layer.y ?? 34) + '%; width: ' + ((layer.scale ?? 1) * 22) + '%; transform: translate(-50%, -50%) rotate(' + (layer.rotation ?? 0) + 'deg); max-height: 35%;'" 
                                                />
                                            </template>
                                            <!-- Monogram Letters Overlay -->
                                            <template x-if="getMonogram() && getMonogram().text">
                                                <div 
                                                    class="absolute font-black tracking-widest text-center pointer-events-none drop-shadow-lg uppercase z-20"
                                                    :style="'left: ' + (getMonogram().x ?? 70) + '%; top: ' + (getMonogram().y ?? 34) + '%; transform: translate(-50%, -50%); color: ' + (getMonogram().embroideryColor || getMonogram().fillColor || '#CA8A04') + '; font-size: ' + ((getMonogram().scale ?? 1) * 1.2) + 'rem; text-shadow: 0 2px 4px rgba(0,0,0,0.8);'"
                                                    x-text="getMonogram().text"
                                                ></div>
                                            </template>
                                        </div>
                                    </template>

                                    <!-- 3. Fleece Hoodie Front Rendering -->
                                    <template x-if="getGarmentType() === 'hoodie'">
                                        <div class="relative w-full h-full flex items-center justify-center">
                                            <!-- Sleeves Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/hoodie/front_sleeves.png" class="w-full h-full object-contain pointer-events-none" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/hoodie/front_sleeves.png', getPartColor('sleeves', '#111827'))"></div>
                                            </div>
                                            <!-- Body Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/hoodie/front_body.png" class="w-full h-full object-contain pointer-events-none drop-shadow-md" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/hoodie/front_body.png', getPartColor('body', '#111827'))"></div>
                                            </div>
                                            <!-- Hood Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/hoodie/front_hood.png" class="w-full h-full object-contain pointer-events-none" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/hoodie/front_hood.png', getPartColor('hood', '#111827'))"></div>
                                            </div>
                                            <!-- Pocket Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/hoodie/front_pocket.png" class="w-full h-full object-contain pointer-events-none" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/hoodie/front_pocket.png', getPartColor('pocket', '#111827'))"></div>
                                            </div>
                                            <!-- Uploaded Logo Overlays -->
                                            <template x-for="layer in getFrontArtworkLayers()" :key="layer.id || layer.url">
                                                <img 
                                                    :src="layer.url || layer.dataUrl" 
                                                    class="absolute pointer-events-none object-contain drop-shadow-lg z-20"
                                                    :style="'left: ' + (layer.x ?? 50) + '%; top: ' + (layer.y ?? 38) + '%; width: ' + ((layer.scale ?? 1) * 24) + '%; transform: translate(-50%, -50%) rotate(' + (layer.rotation ?? 0) + 'deg); max-height: 35%;'" 
                                                />
                                            </template>
                                            <!-- Monogram Letters Overlay -->
                                            <template x-if="getMonogram() && getMonogram().text">
                                                <div 
                                                    class="absolute font-black tracking-widest text-center pointer-events-none drop-shadow-lg uppercase z-20"
                                                    :style="'left: ' + (getMonogram().x ?? 50) + '%; top: ' + (getMonogram().y ?? 32) + '%; transform: translate(-50%, -50%); color: ' + (getMonogram().embroideryColor || getMonogram().fillColor || '#FFFFFF') + '; font-size: ' + ((getMonogram().scale ?? 1) * 1.35) + 'rem; text-shadow: 0 2px 4px rgba(0,0,0,0.8);'"
                                                    x-text="getMonogram().text"
                                                ></div>
                                            </template>
                                        </div>
                                    </template>

                                    <!-- 4. Equestrian Suit Front Rendering -->
                                    <template x-if="getGarmentType() === 'equestrian'">
                                        <div class="relative w-full h-full flex items-center justify-center">
                                            <!-- Leggings Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/equastarian/front%20legngs]%20(1).png" class="w-full h-full object-contain pointer-events-none" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/equastarian/front%20legngs]%20(1).png', getPartColor('leggings', '#1E3A2F'))"></div>
                                            </div>
                                            <!-- Top Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/equastarian/front%20(2)%20(1).png" class="w-full h-full object-contain pointer-events-none drop-shadow-md" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/equastarian/front%20(2)%20(1).png', getPartColor('top', '#1E3A2F'))"></div>
                                            </div>
                                            <!-- Uploaded Logo Overlays -->
                                            <template x-for="layer in getFrontArtworkLayers()" :key="layer.id || layer.url">
                                                <img 
                                                    :src="layer.url || layer.dataUrl" 
                                                    class="absolute pointer-events-none object-contain drop-shadow-lg z-20"
                                                    :style="'left: ' + (layer.x ?? 30) + '%; top: ' + (layer.y ?? 28) + '%; width: ' + ((layer.scale ?? 1) * 22) + '%; transform: translate(-50%, -50%);'" 
                                                />
                                            </template>
                                        </div>
                                    </template>

                                    </div>
                                </div>
                                <div class="w-full mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                                    <span class="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">FRONT ELEVATION</span>
                                    <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold whitespace-nowrap">2D / 3D Spec</span>
                                </div>
                            </div>

                            <!-- Back Elevation (Dynamic Multi-Layer Real Silhouette) -->
                            <div 
                                x-show="elevationViewMode === 'dual' || elevationViewMode === 'back'"
                                class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-between relative shadow-lg"
                            >
                                <div 
                                    class="w-full relative flex items-center justify-center p-2 overflow-hidden rounded-lg select-none transition-colors duration-200"
                                    :class="elevationViewMode === 'back' ? 'aspect-4/3 min-h-[280px]' : 'aspect-square'"
                                    :style="'background-color: ' + modelBgColor"
                                >
                                    <div 
                                        class="w-full h-full relative flex items-center justify-center transition-transform duration-200 origin-center"
                                        :style="'transform: scale(' + (modelZoom / 100) + ')'"
                                    >
                                    
                                    <!-- 1. Basketball Back Rendering -->
                                    <template x-if="getGarmentType() === 'basketball'">
                                        <div class="relative w-full h-full flex items-center justify-center">
                                            <!-- Shorts Back Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/basketball/shorts%20back%20(1).png" class="w-full h-full object-contain pointer-events-none drop-shadow-sm" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/basketball/shorts%20back%20(1).png', getPartColor('shorts', '#1E3A2F'))"></div>
                                            </div>
                                            <!-- Jersey Back Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/basketball/back%20(3)%20(1).png" class="w-full h-full object-contain pointer-events-none drop-shadow-md" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/basketball/back%20(3)%20(1).png', getPartColor('jersey', '#1E3A2F'))"></div>
                                            </div>
                                            <!-- Collar & Ribs Back Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/basketball/ribs%20(4)%20(1).png" class="w-full h-full object-contain pointer-events-none" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/basketball/ribs%20(4)%20(1).png', getPartColor('ribs', '#FFFFFF'))"></div>
                                            </div>
                                            <!-- Back Artwork Layers -->
                                            <template x-for="layer in getBackArtworkLayers()" :key="layer.id || layer.url">
                                                <img 
                                                    :src="layer.url || layer.dataUrl" 
                                                    class="absolute pointer-events-none object-contain drop-shadow-lg z-20"
                                                    :style="'left: ' + (layer.x ?? 50) + '%; top: ' + (layer.y ?? 30) + '%; width: ' + ((layer.scale ?? 1) * 24) + '%; transform: translate(-50%, -50%);'" 
                                                />
                                            </template>
                                        </div>
                                    </template>

                                    <!-- 2. Varsity Jacket Back Rendering -->
                                    <template x-if="getGarmentType() === 'varsity'">
                                        <div class="relative w-full h-full flex items-center justify-center">
                                            <!-- Sleeves Back Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/varsity_jacket/BACK_sleeves.png" class="w-full h-full object-contain pointer-events-none drop-shadow-sm" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/varsity_jacket/BACK_sleeves.png', getPartColor('sleeves', '#FFFFFF'))"></div>
                                            </div>
                                            <!-- Jacket Body Back Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/varsity_jacket/BACK_JACKET.png" class="w-full h-full object-contain pointer-events-none drop-shadow-md" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/varsity_jacket/BACK_JACKET.png', getPartColor('body', '#800020'))"></div>
                                            </div>
                                            <!-- Ribs Back Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/varsity_jacket/BACK_RIBS.png" class="w-full h-full object-contain pointer-events-none" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/varsity_jacket/BACK_RIBS.png', getPartColor('ribs', '#111827'))"></div>
                                            </div>
                                            <!-- Back Artwork Layers -->
                                            <template x-for="layer in getBackArtworkLayers()" :key="layer.id || layer.url">
                                                <img 
                                                    :src="layer.url || layer.dataUrl" 
                                                    class="absolute pointer-events-none object-contain drop-shadow-lg z-20"
                                                    :style="'left: ' + (layer.x ?? 50) + '%; top: ' + (layer.y ?? 35) + '%; width: ' + ((layer.scale ?? 1) * 24) + '%; transform: translate(-50%, -50%);'" 
                                                />
                                            </template>
                                        </div>
                                    </template>

                                    <!-- 3. Fleece Hoodie Back Rendering -->
                                    <template x-if="getGarmentType() === 'hoodie'">
                                        <div class="relative w-full h-full flex items-center justify-center">
                                            <!-- Sleeves Back Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/hoodie/back_sleeves.png" class="w-full h-full object-contain pointer-events-none" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/hoodie/back_sleeves.png', getPartColor('sleeves', '#111827'))"></div>
                                            </div>
                                            <!-- Body Back Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/hoodie/back_body.png" class="w-full h-full object-contain pointer-events-none drop-shadow-md" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/hoodie/back_body.png', getPartColor('body', '#111827'))"></div>
                                            </div>
                                            <!-- Hood Back Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/hoodie/back_hood.png" class="w-full h-full object-contain pointer-events-none" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/hoodie/back_hood.png', getPartColor('hood', '#111827'))"></div>
                                            </div>
                                            <!-- Back Artwork Layers -->
                                            <template x-for="layer in getBackArtworkLayers()" :key="layer.id || layer.url">
                                                <img 
                                                    :src="layer.url || layer.dataUrl" 
                                                    class="absolute pointer-events-none object-contain drop-shadow-lg z-20"
                                                    :style="'left: ' + (layer.x ?? 50) + '%; top: ' + (layer.y ?? 35) + '%; width: ' + ((layer.scale ?? 1) * 24) + '%; transform: translate(-50%, -50%);'" 
                                                />
                                            </template>
                                        </div>
                                    </template>

                                    <!-- 4. Equestrian Suit Back Rendering -->
                                    <template x-if="getGarmentType() === 'equestrian'">
                                        <div class="relative w-full h-full flex items-center justify-center">
                                            <!-- Leggings Back Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/equastarian/leggings%20back%20(1).png" class="w-full h-full object-contain pointer-events-none" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/equastarian/leggings%20back%20(1).png', getPartColor('leggings', '#1E3A2F'))"></div>
                                            </div>
                                            <!-- Top Back Layer -->
                                            <div class="absolute inset-0">
                                                <img src="/equastarian/back%20(2)%20(1).png" class="w-full h-full object-contain pointer-events-none drop-shadow-md" />
                                                <div class="absolute inset-0" :style="getPartMaskStyle('/equastarian/back%20(2)%20(1).png', getPartColor('top', '#1E3A2F'))"></div>
                                            </div>
                                        </div>
                                    </template>
                                    </div>
                                </div>
                                <div class="w-full mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                                    <span class="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">BACK ELEVATION</span>
                                    <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold whitespace-nowrap">Rear Spec</span>
                                </div>
                            </div>

                        </div>

                        <!-- Garment Component & Parts Color Palette -->
                        <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
                            <div class="flex items-center justify-between border-b border-slate-800/80 pb-2">
                                <span class="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-[#D10115]"></span>
                                    Garment Color Mapping
                                </span>
                                <span class="text-[10px] font-mono text-slate-400 uppercase">Factory Dye Match</span>
                            </div>

                            <div class="grid grid-cols-2 gap-2 text-xs">
                                <template x-for="(hex, part) in (selectedPack?.parts_colors || {})" :key="part">
                                    <div class="flex items-center justify-between bg-slate-900/90 border border-slate-800/60 p-2 rounded-lg">
                                        <span class="text-slate-400 uppercase font-mono text-[10px] truncate max-w-[80px]" x-text="part"></span>
                                        <div class="flex items-center gap-1.5 shrink-0">
                                            <span class="w-3.5 h-3.5 rounded border border-white/20 shrink-0" :style="'background-color: ' + hex"></span>
                                            <span class="font-mono text-[10px] text-slate-200 font-bold" x-text="hex"></span>
                                        </div>
                                    </div>
                                </template>
                                <template x-if="!selectedPack?.parts_colors || Object.keys(selectedPack.parts_colors).length === 0">
                                    <div class="col-span-2 text-slate-500 text-[11px] font-mono py-1">
                                        Standard single-dye studio wash colorway.
                                    </div>
                                </template>
                            </div>
                        </div>

                        <!-- Commercial Buyer & Order Identity Card -->
                        <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs font-mono" x-show="selectedPack?.customer">
                            <div class="flex items-center justify-between border-b border-slate-800/80 pb-2">
                                <span class="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                                    Commercial Buyer Account
                                </span>
                                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase">
                                    Verified Client
                                </span>
                            </div>
                            <template x-if="selectedPack?.customer?.company_name">
                                <div class="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-900 pb-1">
                                    <span>Brand / Company:</span>
                                    <strong class="text-white font-sans truncate max-w-[200px]" x-text="selectedPack?.customer?.company_name"></strong>
                                </div>
                            </template>
                            <div class="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-900 pb-1">
                                <span>Contact Name:</span>
                                <strong class="text-slate-200" x-text="((selectedPack?.customer?.first_name || '') + ' ' + (selectedPack?.customer?.last_name || '')).trim()"></strong>
                            </div>
                            <div class="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-900 pb-1">
                                <span>Email Address:</span>
                                <strong class="text-blue-400" x-text="selectedPack?.customer?.email"></strong>
                            </div>
                            <template x-if="selectedPack?.customer?.phone">
                                <div class="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-900 pb-1">
                                    <span>Phone / WhatsApp:</span>
                                    <strong class="text-emerald-400" x-text="selectedPack?.customer?.phone"></strong>
                                </div>
                            </template>
                            <template x-if="selectedPack?.order_items && selectedPack.order_items.length > 0 && selectedPack.order_items[0].order">
                                <div class="flex items-center justify-between text-slate-400 text-[11px] pt-0.5">
                                    <span>Order Reference:</span>
                                    <a :href="'/admin/orders/' + selectedPack.order_items[0].order.id" class="text-blue-400 font-bold hover:underline" x-text="'#' + selectedPack.order_items[0].order.order_number"></a>
                                </div>
                            </template>
                        </div>

                        <!-- Technical Specification Summary Card -->
                        <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs font-mono">
                            <div class="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-900 pb-1.5">
                                <span>Fabrication:</span>
                                <strong class="text-slate-200 font-sans truncate max-w-[220px]" x-text="selectedPack?.fabric_spec"></strong>
                            </div>
                            <div class="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-900 pb-1.5">
                                <span>Weight Target:</span>
                                <strong class="text-blue-400 font-bold" x-text="selectedPack?.target_gsm + ' GSM'"></strong>
                            </div>
                            <div class="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-900 pb-1.5">
                                <span>Manufacturing Season:</span>
                                <strong class="text-slate-200" x-text="selectedPack?.season"></strong>
                            </div>
                            <div class="flex items-center justify-between text-slate-400 text-[11px]">
                                <span>Quality Norm:</span>
                                <strong class="text-emerald-400">AQL 2.5 Major / 4.0 Minor</strong>
                            </div>
                        </div>

                    </div>

                    <!-- Right Column (7 Cols): Custom Branding Vault, BOM, POM & Quality -->
                    <div class="lg:col-span-7 space-y-5">
                        
                        <!-- ================================================================= -->
                        <!-- CUSTOM BRANDING, ARTWORK & DECORATION VAULT (USER UPLOADS & SPECS) -->
                        <!-- ================================================================= -->
                        <div class="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-md">
                            <div class="flex items-center justify-between border-b border-slate-800/80 pb-2">
                                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    Custom Branding, Artwork & Decoration Vault
                                </h4>
                                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                                    Production Assets Ready
                                </span>
                            </div>

                            <!-- Decoration Technique & Wash Finish Badges -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div class="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between">
                                    <span class="text-[11px] text-slate-400 font-mono">Decoration Method:</span>
                                    <span class="text-xs font-bold text-purple-400 flex items-center gap-1">
                                        🧵 <span x-text="selectedPack?.decoration_method || '3D High-Density Puff Embroidery'"></span>
                                    </span>
                                </div>
                                <div class="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between">
                                    <span class="text-[11px] text-slate-400 font-mono">Garment Wash Finish:</span>
                                    <span class="text-xs font-bold text-cyan-400 flex items-center gap-1">
                                        💧 <span x-text="selectedPack?.wash_type || 'Heavy Silicone Softener Enzyme Wash'"></span>
                                    </span>
                                </div>
                            </div>

                            <!-- Uploaded Artwork Logos (Real Image Previews & High-Res Download Links) -->
                            <template x-if="getArtworkLayers().length > 0">
                                <div class="space-y-2 pt-1 border-t border-slate-900">
                                    <div class="text-[11px] font-bold text-slate-300 font-mono flex items-center gap-1.5">
                                        <span>🖼️ Uploaded Logo Artwork Files:</span>
                                    </div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <template x-for="(art, idx) in getArtworkLayers()" :key="idx">
                                            <div class="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center gap-3">
                                                <div class="w-12 h-12 rounded-lg bg-black/60 border border-slate-700/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                                    <img :src="art.url || art.dataUrl" class="max-w-full max-h-full object-contain" />
                                                </div>
                                                <div class="min-w-0 flex-1 space-y-1">
                                                    <div class="text-xs font-bold text-slate-200 truncate" x-text="art.name || ('Custom Logo #' + (idx + 1))"></div>
                                                    <div class="text-[10px] text-slate-400 font-mono" x-text="'Position: X ' + (art.x ?? 50) + '%, Y ' + (art.y ?? 30) + '% • Scale: ' + Math.round((art.scale ?? 1) * 100) + '%'"></div>
                                                    <a 
                                                        :href="art.url || art.dataUrl" 
                                                        target="_blank" 
                                                        download="custom_artwork_logo"
                                                        class="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 underline font-mono"
                                                    >
                                                        <span>📥 Download High-Res File</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </template>

                            <!-- Monogram Typography & Thread Specification -->
                            <template x-if="getMonogram() && getMonogram().text">
                                <div class="space-y-1.5 pt-1 border-t border-slate-900">
                                    <div class="text-[11px] font-bold text-slate-300 font-mono">
                                        🔤 Custom Monogram / Typography Spec:
                                    </div>
                                    <div class="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs">
                                        <div class="flex items-center gap-3">
                                            <span class="text-lg font-black tracking-widest px-2.5 py-0.5 rounded bg-black/50 border border-slate-700 text-white" x-text="getMonogram().text"></span>
                                            <div>
                                                <div class="text-[11px] text-slate-300 font-bold" x-text="'Font: ' + (getMonogram().font || 'Collegiate Block')"></div>
                                                <div class="text-[10px] text-slate-400 font-mono" x-text="'Placement: Chest Elevation • Scale: ' + (getMonogram().scale ?? 1) + 'x'"></div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-1.5">
                                            <span class="w-3.5 h-3.5 rounded border border-white/20 shrink-0" :style="'background-color: ' + (getMonogram().embroideryColor || getMonogram().fillColor || '#FFFFFF')"></span>
                                            <span class="font-mono text-[11px] text-slate-200 font-bold" x-text="getMonogram().embroideryColor || getMonogram().fillColor || '#FFFFFF'"></span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <!-- 1. Bill of Materials (BOM) Table -->
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    1. Bill of Materials (BOM) Specification
                                </h4>
                                <span class="text-[10px] font-mono text-slate-400" x-text="(selectedPack?.bill_of_materials?.length || 0) + ' Component Items'"></span>
                            </div>
                            <div class="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                                <div class="overflow-x-auto">
                                    <table class="w-full text-left text-xs">
                                        <thead class="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                                            <tr>
                                                <th class="p-2.5 w-[30%]">Component Item</th>
                                                <th class="p-2.5 w-[45%]">Specification</th>
                                                <th class="p-2.5 w-[25%] text-right">Consumption</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-800/80 font-mono">
                                            <template x-for="(bom, idx) in (selectedPack?.bill_of_materials || [])" :key="idx">
                                                <tr class="hover:bg-slate-900/40 transition">
                                                    <td class="p-2.5 font-bold text-slate-200 font-sans" x-text="bom.item"></td>
                                                    <td class="p-2.5 text-slate-400 text-[11px]" x-text="bom.spec"></td>
                                                    <td class="p-2.5 text-blue-400 text-right font-bold text-[11px]" x-text="bom.consumption"></td>
                                                </tr>
                                            </template>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- 2. Points of Measure (POM) Grading Matrix (Real HTML Table) -->
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-[#D10115]"></span>
                                    2. Points of Measure (POM) Grading Matrix
                                </h4>
                                <span class="text-[10px] font-mono text-slate-400">Unit: cm • Tol: ±1.0 cm</span>
                            </div>

                            <div class="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                                <div class="overflow-x-auto">
                                    <table class="w-full text-left text-xs border-collapse">
                                        <thead class="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                                            <tr>
                                                <th class="p-2.5 w-[34%]">Measurement Point (POM)</th>
                                                <th class="p-2 text-center w-[8%]">XS</th>
                                                <th class="p-2 text-center w-[8%]">S</th>
                                                <th class="p-2 text-center w-[8%]">M</th>
                                                <th class="p-2 text-center w-[8%]">L</th>
                                                <th class="p-2 text-center w-[8%]">XL</th>
                                                <th class="p-2 text-center w-[8%]">2XL</th>
                                                <th class="p-2 text-center w-[8%]">3XL</th>
                                                <th class="p-2 text-center w-[8%] text-slate-500">Tol.</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-800/80 font-mono text-[11px]">
                                            <!-- Row 1: Chest Width -->
                                            <tr class="hover:bg-slate-900/40">
                                                <td class="p-2.5 font-bold text-slate-200 font-sans">Chest Width (1" below armhole)</td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('XS', 'chest_width')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('S', 'chest_width')"></td>
                                                <td class="p-2 text-center text-slate-300 font-bold text-white bg-blue-950/20" x-text="getPomVal('M', 'chest_width')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('L', 'chest_width')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('XL', 'chest_width')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('2XL', 'chest_width')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('3XL', 'chest_width')"></td>
                                                <td class="p-2 text-center text-slate-500">±1.0</td>
                                            </tr>

                                            <!-- Row 2: Body Length -->
                                            <tr class="hover:bg-slate-900/40">
                                                <td class="p-2.5 font-bold text-slate-200 font-sans">Body Length (HPS to bottom hem)</td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('XS', 'body_length')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('S', 'body_length')"></td>
                                                <td class="p-2 text-center text-slate-300 font-bold text-white bg-blue-950/20" x-text="getPomVal('M', 'body_length')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('L', 'body_length')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('XL', 'body_length')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('2XL', 'body_length')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('3XL', 'body_length')"></td>
                                                <td class="p-2 text-center text-slate-500">±1.0</td>
                                            </tr>

                                            <!-- Row 3: Shoulder Drop -->
                                            <tr class="hover:bg-slate-900/40">
                                                <td class="p-2.5 font-bold text-slate-200 font-sans">Across Shoulders / Drop</td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('XS', 'shoulder_drop')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('S', 'shoulder_drop')"></td>
                                                <td class="p-2 text-center text-slate-300 font-bold text-white bg-blue-950/20" x-text="getPomVal('M', 'shoulder_drop')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('L', 'shoulder_drop')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('XL', 'shoulder_drop')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('2XL', 'shoulder_drop')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('3XL', 'shoulder_drop')"></td>
                                                <td class="p-2 text-center text-slate-500">±1.0</td>
                                            </tr>

                                            <!-- Row 4: Sleeve Length -->
                                            <tr class="hover:bg-slate-900/40">
                                                <td class="p-2.5 font-bold text-slate-200 font-sans">Sleeve Length (from shoulder point)</td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('XS', 'sleeve_length')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('S', 'sleeve_length')"></td>
                                                <td class="p-2 text-center text-slate-300 font-bold text-white bg-blue-950/20" x-text="getPomVal('M', 'sleeve_length')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('L', 'sleeve_length')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('XL', 'sleeve_length')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('2XL', 'sleeve_length')"></td>
                                                <td class="p-2 text-center text-slate-300" x-text="getPomVal('3XL', 'sleeve_length')"></td>
                                                <td class="p-2 text-center text-slate-500">±1.0</td>
                                            </tr>

                                            <!-- Batch Allocation Units Breakdown Row -->
                                            <tr class="bg-blue-950/40 border-t-2 border-blue-500/30 text-blue-300 font-bold">
                                                <td class="p-2.5 font-sans flex items-center justify-between">
                                                    <span>Batch Size Allocation (Units)</span>
                                                    <span class="text-[10px] text-emerald-400 font-mono" x-text="'Total: ' + getTotalUnits() + ' pcs'"></span>
                                                </td>
                                                <td class="p-2 text-center font-mono" x-text="getSizeBreakdown()?.['XS'] ?? '-'"></td>
                                                <td class="p-2 text-center font-mono" x-text="getSizeBreakdown()?.['S'] ?? '-'"></td>
                                                <td class="p-2 text-center font-mono text-white font-black" x-text="getSizeBreakdown()?.['M'] ?? '-'"></td>
                                                <td class="p-2 text-center font-mono" x-text="getSizeBreakdown()?.['L'] ?? '-'"></td>
                                                <td class="p-2 text-center font-mono" x-text="getSizeBreakdown()?.['XL'] ?? '-'"></td>
                                                <td class="p-2 text-center font-mono" x-text="getSizeBreakdown()?.['2XL'] ?? '-'"></td>
                                                <td class="p-2 text-center font-mono" x-text="getSizeBreakdown()?.['3XL'] ?? '-'"></td>
                                                <td class="p-2 text-center text-emerald-400 font-mono" x-text="getTotalUnits() > 0 ? getTotalUnits() : '-'"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- 3. Stitching & QC Guidelines -->
                        <div class="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">3. Stitching Guidelines & QC Protocol</span>
                            <p class="text-xs text-slate-300 leading-relaxed font-sans" x-text="selectedPack?.stitching_notes || 'Double-needle flatlock topstitching on high-stress seams. 100% pre-shrunk wash test under AQL 2.5 protocol.'"></p>
                        </div>

                    </div>

                </div>
            </div>

            <!-- Bottom Action Footer (Sticky, Never Overflows) -->
            <div class="shrink-0 p-3 sm:p-4 border-t border-slate-800 bg-[#0A0E17] flex items-center justify-between">
                <div class="text-[11px] font-mono text-slate-500 hidden sm:block">
                    TAWFIQ INDUSTRIES &bull; ATELIER SPECIFICATION SHEET
                </div>

                <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    <button 
                        @click="printTechPack()"
                        class="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition cursor-pointer"
                    >
                        Print Specification
                    </button>
                    <button 
                        @click="selectedPack = null" 
                        class="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition shadow-sm cursor-pointer"
                    >
                        Close Tech Pack
                    </button>
                </div>
            </div>
        </div>
    </div>

</div>

@push('styles')
<style>
/* Clean Custom Scrollbar for Modal Body */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.6);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(51, 65, 85, 0.8);
    border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 116, 139, 1);
}

@media print {
    body * {
        visibility: hidden !important;
    }
    #tech-pack-printable-modal, #tech-pack-printable-modal * {
        visibility: visible !important;
    }
    #tech-pack-printable-modal {
        position: fixed !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        max-height: 100% !important;
        background: white !important;
        color: black !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        overflow: visible !important;
        z-index: 999999 !important;
    }
    #tech-pack-printable-modal * {
        color: black !important;
        background: transparent !important;
        border-color: #cbd5e1 !important;
    }
    .no-print {
        display: none !important;
    }
}
</style>
@endpush
@endsection
