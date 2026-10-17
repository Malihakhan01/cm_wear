@extends('layouts.admin')

@section('title', 'Whitelabel & Platform Settings')
@section('header_title', 'Platform & Studio Settings')

@section('content')
<div class="space-y-6 max-w-4xl">
    
    <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Whitelabel Configuration</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">Configure store branding, currency, default MOQ rules, and studio preferences</p>
    </div>

    <form method="POST" action="{{ route('admin.settings.update') }}" class="space-y-6">
        @csrf
        @method('PUT')

        <!-- General Branding Card -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Store Identity & Branding</h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Store / Brand Name</label>
                    <input type="text" name="site_name" value="{{ old('site_name', $settings['site_name']->value ?? 'CM SPORTS WEAR') }}" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Contact Inquiries Email</label>
                    <input type="email" name="contact_email" value="{{ old('contact_email', $settings['contact_email']->value ?? 'inquiries@example.com') }}" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Tagline / Header Description</label>
                <input type="text" name="site_tagline" value="{{ old('site_tagline', $settings['site_tagline']->value ?? 'Next-generation apparel customizer and manufacturing platform') }}" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
            </div>
        </div>

        <!-- Pricing & Factory Defaults Card -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Pricing & Factory Defaults</h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Currency Symbol</label>
                    <input type="text" name="currency_symbol" value="{{ old('currency_symbol', $settings['currency_symbol']->value ?? '$') }}" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">ISO Currency Code</label>
                    <input type="text" name="currency_code" value="{{ old('currency_code', $settings['currency_code']->value ?? 'USD') }}" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Default Factory MOQ</label>
                    <input type="number" name="default_moq" value="{{ old('default_moq', $settings['default_moq']->value ?? 50) }}" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Default Sample Price ($)</label>
                    <input type="number" step="0.01" name="default_sample_price" value="{{ old('default_sample_price', $settings['default_sample_price']->value ?? 75.00) }}" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Lead Time (Days)</label>
                    <input type="number" name="default_lead_time_days" value="{{ old('default_lead_time_days', $settings['default_lead_time_days']->value ?? 25) }}" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>
            </div>
        </div>

        <div>
            <button type="submit" class="rounded-xl bg-blue-600 hover:bg-blue-500 px-8 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition">
                Save Platform Settings
            </button>
        </div>
    </form>

</div>
@endsection
