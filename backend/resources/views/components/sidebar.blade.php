<!-- Mobile Backdrop -->
<div x-show="sidebarOpen" 
     x-transition:enter="transition-opacity ease-linear duration-300"
     x-transition:enter-start="opacity-0"
     x-transition:enter-end="opacity-100"
     x-transition:leave="transition-opacity ease-linear duration-300"
     x-transition:leave-start="opacity-100"
     x-transition:leave-end="opacity-0"
     @click="sidebarOpen = false" 
     class="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden" 
     x-cloak></div>

<!-- TailAdmin Collapsible Sidebar Container -->
<aside :class="{
           'translate-x-0': sidebarOpen, 
           '-translate-x-full': !sidebarOpen,
           'lg:w-72': sidebarExpanded,
           'lg:w-20': !sidebarExpanded
       }"
       class="fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0">
    
    <!-- Brand Header -->
    <div class="flex h-20 min-h-[5rem] max-h-[5rem] shrink-0 items-center border-b border-slate-200 dark:border-slate-800"
         :class="sidebarExpanded ? 'justify-between px-5' : 'justify-center px-2'">
        
        <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-3 overflow-hidden">
            <div x-show="!sidebarExpanded" class="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-extrabold text-sm tracking-wider">
                CM
            </div>
            <div x-show="sidebarExpanded" x-transition.opacity.duration.200ms class="flex flex-col whitespace-nowrap overflow-hidden">
                <span class="text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                    {{ \App\Models\Setting::get('site_name', config('app.name', 'CM SPORTS WEAR')) }}
                </span>
                <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    Studio & Factory
                </span>
            </div>
        </a>

        <!-- Close button on mobile only -->
        <button @click="sidebarOpen = false" class="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    </div>

    <!-- Navigation Links -->
    <div class="flex flex-1 flex-col overflow-y-auto px-3 py-5 space-y-1 custom-scrollbar">
        
        <!-- Section: Overview -->
        <div x-show="sidebarExpanded" class="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Overview
        </div>
        <div x-show="!sidebarExpanded" class="py-2 flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs font-black tracking-widest">
            •••
        </div>

        <a href="{{ route('admin.dashboard') }}" 
           :title="!sidebarExpanded ? 'Dashboard' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.dashboard') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">Dashboard</span>
        </a>

        <!-- Section: Product Catalog -->
        <div x-show="sidebarExpanded" class="pt-4 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Product Catalog
        </div>
        <div x-show="!sidebarExpanded" class="py-2 flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs font-black tracking-widest">
            •••
        </div>

        <a href="{{ route('admin.products.index') }}" 
           :title="!sidebarExpanded ? 'Products' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.products.*') && !request()->routeIs('admin.products.import*') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">Products</span>
        </a>

        <a href="{{ route('admin.products.import') }}" 
           :title="!sidebarExpanded ? 'WooCommerce CSV Import' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.products.import*') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">WooCommerce CSV</span>
            <span x-show="sidebarExpanded" class="ml-auto rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Import</span>
        </a>

        <a href="{{ route('admin.categories.index') }}" 
           :title="!sidebarExpanded ? 'Categories' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.categories.*') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">Categories</span>
        </a>

        <a href="{{ route('admin.menus.index') }}" 
           :title="!sidebarExpanded ? 'Header Menu' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.menus.*') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">Header Menu</span>
            <span x-show="sidebarExpanded" class="ml-auto rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">Mega</span>
        </a>


        <!-- Section: Manufacturing & Orders -->
        <div x-show="sidebarExpanded" class="pt-4 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Manufacturing & Orders
        </div>
        <div x-show="!sidebarExpanded" class="py-2 flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs font-black tracking-widest">
            •••
        </div>

        <a href="{{ route('admin.orders.index') }}" 
           :title="!sidebarExpanded ? 'All Orders' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.orders.index') || request()->routeIs('admin.orders.show') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">All Orders</span>
        </a>

        <a href="{{ route('admin.orders.kanban') }}" 
           :title="!sidebarExpanded ? 'Factory Kanban' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.orders.kanban') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">Factory Kanban</span>
            <span x-show="sidebarExpanded" class="ml-auto rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">Live</span>
        </a>

        <a href="{{ route('admin.tech-packs.index') }}" 
           :title="!sidebarExpanded ? 'Tech Packs' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.tech-packs.*') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">Tech Packs</span>
        </a>

        <!-- Section: Customizer Studio -->
        <div x-show="sidebarExpanded" class="pt-4 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Customizer Studio
        </div>
        <div x-show="!sidebarExpanded" class="py-2 flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs font-black tracking-widest">
            •••
        </div>

        <a href="{{ route('admin.customizer.designs') }}" 
           :title="!sidebarExpanded ? 'Saved Designs' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.customizer.designs*') || request()->routeIs('admin.customizer.show') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">Saved Designs</span>
            @php $newDesignCount = \App\Models\CustomizerDesign::where('status', 'submitted')->count(); @endphp
            @if($newDesignCount > 0)
                <span x-show="sidebarExpanded" class="ml-auto rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-400">{{ $newDesignCount }}</span>
            @endif
        </a>

        <a href="{{ route('admin.customizer.settings') }}" 
           :title="!sidebarExpanded ? 'Customizer Engine' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.customizer.settings*') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">Customizer Engine</span>
        </a>

        <!-- Section: Leads & Inquiries -->
        <div x-show="sidebarExpanded" class="pt-4 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Leads & Inquiries
        </div>
        <div x-show="!sidebarExpanded" class="py-2 flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs font-black tracking-widest">
            •••
        </div>

        <a href="{{ route('admin.inquiries.index') }}" 
           :title="!sidebarExpanded ? 'RFQs & Quotes' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.inquiries.*') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">RFQs & Quotes</span>
            @php $newRfqCount = \App\Models\Rfq::where('status', 'new')->count(); @endphp
            @if($newRfqCount > 0)
                <span x-show="sidebarExpanded" class="ml-auto rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-white">{{ $newRfqCount }}</span>
            @endif
        </a>

        <a href="{{ route('admin.customers.index') }}" 
           :title="!sidebarExpanded ? 'Buyers & Clients' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.customers.*') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">Buyers & Clients</span>
        </a>

        <!-- Section: Content & Marketing -->
        <div x-show="sidebarExpanded" class="pt-4 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Content & Marketing
        </div>
        <div x-show="!sidebarExpanded" class="py-2 flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs font-black tracking-widest">
            •••
        </div>

        <a href="{{ route('admin.blogs.index') }}" 
           :title="!sidebarExpanded ? 'Editorial & Blogs' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.blogs.*') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">Editorial & Blogs</span>
        </a>

        <a href="{{ route('admin.testimonials.index') }}" 
           :title="!sidebarExpanded ? 'Testimonials' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.testimonials.*') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">Testimonials</span>
        </a>

        <a href="{{ route('admin.faqs.index') }}" 
           :title="!sidebarExpanded ? 'FAQs' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.faqs.*') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">FAQs</span>
        </a>

        <!-- Section: System -->
        <div x-show="sidebarExpanded" class="pt-4 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            System
        </div>
        <div x-show="!sidebarExpanded" class="py-2 flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs font-black tracking-widest">
            •••
        </div>

        <a href="{{ route('admin.settings.index') }}" 
           :title="!sidebarExpanded ? 'Settings' : ''"
           class="flex items-center rounded-2xl font-semibold text-sm transition-all duration-150 {{ request()->routeIs('admin.settings.*') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white' }}"
           :class="sidebarExpanded ? 'gap-3 px-3.5 py-2.5' : 'justify-center p-3'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
            <span x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="truncate">Settings</span>
        </a>
    </div>

    <!-- User Mini Profile Footer -->
    <div class="shrink-0 border-t border-slate-200 p-3.5 dark:border-slate-800">
        <div class="flex items-center" :class="sidebarExpanded ? 'gap-3' : 'justify-center'">
            <a href="{{ route('admin.profile.edit') }}" class="flex h-9 w-9 min-w-[2.25rem] items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-md shadow-blue-600/20 overflow-hidden hover:opacity-90 transition" title="{{ auth()->user()->name ?? 'Admin' }}">
                @if(auth()->user()?->avatar_url)
                    <img src="{{ auth()->user()->avatar_url }}" alt="{{ auth()->user()->name }}" class="h-full w-full object-cover">
                @else
                    {{ auth()->user()?->initials ?? 'A' }}
                @endif
            </a>
            <div x-show="sidebarExpanded" x-transition.opacity.duration.150ms class="flex-1 min-w-0">
                <a href="{{ route('admin.profile.edit') }}" class="text-xs font-bold truncate text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 block transition">
                    {{ auth()->user()->name ?? 'Administrator' }}
                </a>
                <p class="text-[11px] text-slate-400 truncate dark:text-slate-500">{{ auth()->user()->email ?? 'admin@example.com' }}</p>
            </div>
            <form x-show="sidebarExpanded" method="POST" action="{{ route('admin.logout') }}">
                @csrf
                <button type="submit" title="Sign Out" class="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
            </form>
        </div>
    </div>
</aside>
