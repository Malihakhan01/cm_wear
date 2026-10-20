@extends('layouts.auth')

@section('title', 'Admin Sign In')

@section('content')
<div class="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
    
    <!-- Header -->
    <div class="text-center mb-8">
        <h1 class="text-2xl font-extrabold text-white tracking-tight">
            {{ \App\Models\Setting::get('site_name', config('app.name', 'CM SPORTS WEAR')) }}
        </h1>
        <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1">
            Manufacturing & Admin Studio
        </p>
    </div>

    <!-- Error Alert -->
    @if ($errors->any())
        <div class="mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-semibold text-rose-400">
            <ul class="list-disc list-inside space-y-1">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <!-- Form -->
    <form method="POST" action="{{ route('admin.login.submit') }}" class="space-y-5">
        @csrf

        <div>
            <label for="email" class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Email Address</label>
            <input type="email" 
                   name="email" 
                   id="email" 
                   value="{{ old('email') }}" 
                   placeholder="Enter your email"
                   required 
                   autofocus
                   autocomplete="email"
                   class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition">
        </div>

        <div>
            <div class="flex items-center justify-between mb-2">
                <label for="password" class="block text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
            </div>
            <input type="password" 
                   name="password" 
                   id="password" 
                   required 
                   autocomplete="current-password"
                   placeholder="••••••••"
                   class="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition">
        </div>

        <div class="flex items-center justify-between pt-1">
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="remember" class="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0">
                <span class="text-xs font-medium text-slate-400">Remember session</span>
            </label>
        </div>

        <button type="submit" 
                class="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition duration-150">
            Sign In to Dashboard
        </button>
    </form>
</div>
@endsection
