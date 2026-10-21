<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"
      x-data="{ 
          darkMode: $persist(false), 
          sidebarOpen: false, 
          sidebarExpanded: $persist(true) 
      }"
      x-init="
          $watch('darkMode', val => {
              if (val) {
                  document.documentElement.classList.add('dark');
              } else {
                  document.documentElement.classList.remove('dark');
              }
          });
          if (darkMode) {
              document.documentElement.classList.add('dark');
          } else {
              document.documentElement.classList.remove('dark');
          }
      "
      :class="{ 'dark': darkMode }">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title', 'Admin Dashboard') — {{ \App\Models\Setting::get('site_name', config('app.name', 'CM SPORTS WEAR')) }}</title>



    <!-- Google Fonts: Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- ApexCharts Library -->
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

    <script>
        if (localStorage.getItem('_x_darkMode') === 'true' || (!('_x_darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else if (localStorage.getItem('_x_darkMode') === 'false') {
            document.documentElement.classList.remove('dark');
        }
    </script>

    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        [x-cloak] { display: none !important; }

        /* WYSIWYG Editor Table Responsiveness */
        .wysiwyg-wrapper .ql-container,
        .wysiwyg-wrapper .ql-editor {
            overflow-x: auto !important;
            max-width: 100% !important;
        }
        .wysiwyg-wrapper .ql-editor table {
            width: 100% !important;
            min-width: 780px !important;
            border-collapse: collapse !important;
            margin: 0.75rem 0 !important;
            table-layout: auto !important;
        }
        .wysiwyg-wrapper .ql-editor th,
        .wysiwyg-wrapper .ql-editor td {
            border: 1px solid #cbd5e1 !important;
            padding: 0.5rem 0.75rem !important;
            font-size: 0.75rem !important;
            line-height: 1.45 !important;
            vertical-align: top !important;
            text-align: left !important;
            min-width: 130px !important;
            white-space: normal !important;
            word-break: normal !important;
        }
        .wysiwyg-wrapper .ql-editor th {
            background-color: #f1f5f9 !important;
            font-weight: 700 !important;
            color: #1e293b !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
        }
        .wysiwyg-wrapper .ql-editor tr:nth-child(even) td {
            background-color: #f8fafc !important;
        }
        .dark .wysiwyg-wrapper .ql-editor table {
            border-color: #334155 !important;
        }
        .dark .wysiwyg-wrapper .ql-editor th,
        .dark .wysiwyg-wrapper .ql-editor td {
            border-color: #334155 !important;
            color: #e2e8f0 !important;
        }
        .dark .wysiwyg-wrapper .ql-editor th {
            background-color: #1e293b !important;
            color: #f8fafc !important;
        }
        .dark .wysiwyg-wrapper .ql-editor tr:nth-child(even) td {
            background-color: rgba(30, 41, 59, 0.4) !important;
        }
        .wysiwyg-description .ql-editor {
            max-height: 550px !important;
            overflow-y: auto !important;
        }
    </style>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('styles')
</head>
<body class="bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
    <div class="flex h-screen overflow-hidden">
        
        <!-- Sidebar Navigation -->
        @include('components.sidebar')

        <!-- Main Content Wrapper -->
        <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            
            <!-- Top Navigation Header -->
            @include('components.header')

            <!-- Main Page Body -->
            <main class="flex-1 p-4 sm:p-6 lg:p-8 2xl:p-10 w-full max-w-[1600px] mx-auto">
                <!-- Alerts / Flash Messages -->
                @if(session('success'))
                    <div x-data="{ show: true }" x-show="show" x-transition class="mb-6 flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-600 dark:text-emerald-400">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span class="text-sm font-semibold">{{ session('success') }}</span>
                        </div>
                        <button @click="show = false" class="text-emerald-500 hover:text-emerald-700">&times;</button>
                    </div>
                @endif

                @if(session('error'))
                    <div x-data="{ show: true }" x-show="show" x-transition class="mb-6 flex items-center justify-between rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-600 dark:text-rose-400">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span class="text-sm font-semibold">{{ session('error') }}</span>
                        </div>
                        <button @click="show = false" class="text-rose-500 hover:text-rose-700">&times;</button>
                    </div>
                @endif

                @yield('content')
            </main>

            <!-- Admin Footer -->
            <footer class="mt-auto shrink-0 border-t border-slate-200 bg-white/50 px-6 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                &copy; {{ date('Y') }} {{ \App\Models\Setting::get('site_name', config('app.name', 'CM SPORTS WEAR')) }} — Core Commerce Engine.
            </footer>
        </div>
    </div>

    @stack('scripts')
</body>
</html>
