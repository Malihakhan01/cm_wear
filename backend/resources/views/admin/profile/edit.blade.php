@extends('layouts.admin')

@section('title', 'Admin Profile')
@section('header_title', 'User Profile & Account Settings')

@section('content')
<div class="space-y-8 max-w-6xl">

    <!-- Top Breadcrumb / Title Bar -->
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Account Profile</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Manage your personal credentials, profile picture, and account security</p>
        </div>
    </div>

    <!-- Error Summary (if any) -->
    @if ($errors->any())
        <div class="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <div class="flex items-center gap-2 mb-2 font-bold">
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Please correct the errors below:</span>
            </div>
            <ul class="list-disc list-inside space-y-1 ml-1">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left 4 Cols: User Mini Profile Card & Role Summary -->
        <div class="lg:col-span-4 space-y-6">
            
            <div class="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div class="relative mx-auto h-24 w-24 rounded-3xl overflow-hidden shadow-lg border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-3xl">
                    @if($user->avatar_url)
                        <img src="{{ $user->avatar_url }}" alt="{{ $user->name }}" class="h-full w-full object-cover">
                    @else
                        <span>{{ $user->initials }}</span>
                    @endif
                </div>

                <h3 class="mt-4 text-lg font-extrabold text-slate-900 dark:text-white">{{ $user->name }}</h3>
                <p class="text-xs text-slate-400 dark:text-slate-500 truncate">{{ $user->email }}</p>

                <div class="mt-3 flex items-center justify-center gap-2">
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        {{ $user->roles->first()?->name ? ucfirst($user->roles->first()->name) : 'Super Admin' }}
                    </span>
                    <span class="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Active
                    </span>
                </div>

                <div class="mt-6 border-t border-slate-100 pt-5 text-left text-xs space-y-3 dark:border-slate-800">
                    <div class="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span class="font-medium">User ID</span>
                        <span class="font-mono font-bold text-slate-900 dark:text-white">#{{ $user->id }}</span>
                    </div>
                    <div class="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span class="font-medium">Member Since</span>
                        <span class="font-semibold text-slate-900 dark:text-white">{{ $user->created_at->format('M d, Y') }}</span>
                    </div>
                    <div class="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span class="font-medium">Account Type</span>
                        <span class="font-semibold text-slate-900 dark:text-white">Full Administrator</span>
                    </div>
                </div>

                @if($user->avatar)
                    <form method="POST" action="{{ route('admin.profile.avatar.remove') }}" class="mt-5" onsubmit="return confirm('Remove custom profile avatar?');">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-xs font-bold text-rose-500 hover:text-rose-700 hover:underline">
                            Remove Custom Avatar
                        </button>
                    </form>
                @endif
            </div>

            <!-- Quick Link to Platform Settings -->
            <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <div class="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
                    <span>Store & Platform Settings</span>
                </div>
                <p>
                    Looking to configure store name, factory MOQ rules, or default currency? Head to <a href="{{ route('admin.settings.index') }}" class="text-blue-500 font-bold hover:underline">Platform Settings</a>.
                </p>
            </div>

        </div>

        <!-- Right 8 Cols: Edit Forms -->
        <div class="lg:col-span-8 space-y-8">
            
            <!-- Section 1: Profile Information -->
            <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-slate-900 dark:text-white">Personal Information</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400">Update your name, email address, and avatar image</p>
                    </div>
                </div>

                <form method="POST" action="{{ route('admin.profile.update') }}" enctype="multipart/form-data" class="space-y-6" x-data="{ avatarPreview: null }">
                    @csrf
                    @method('PUT')

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Full Name *</label>
                            <input type="text" 
                                   name="name" 
                                   value="{{ old('name', $user->name) }}" 
                                   required 
                                   class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                        </div>

                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Email Address *</label>
                            <input type="email" 
                                   name="email" 
                                   value="{{ old('email', $user->email) }}" 
                                   required 
                                   class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                        </div>
                    </div>

                    <!-- Avatar Upload -->
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Profile Avatar (Optional)</label>
                        
                        <div class="flex items-center gap-5">
                            <div class="h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 flex-shrink-0">
                                <template x-if="avatarPreview">
                                    <img :src="avatarPreview" class="h-full w-full object-cover">
                                </template>
                                <template x-if="!avatarPreview">
                                    @if($user->avatar_url)
                                        <img src="{{ $user->avatar_url }}" alt="{{ $user->name }}" class="h-full w-full object-cover">
                                    @else
                                        <span class="text-sm font-bold text-slate-400">{{ $user->initials }}</span>
                                    @endif
                                </template>
                            </div>

                            <div class="flex-1">
                                <input type="file" 
                                       name="avatar" 
                                       id="avatar" 
                                       accept="image/*" 
                                       @change="const file = $event.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (e) => { avatarPreview = e.target.result; }; reader.readAsDataURL(file); }"
                                       class="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 dark:file:bg-slate-800 dark:file:text-slate-300 dark:hover:file:bg-slate-700 cursor-pointer">
                                <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-1">PNG, JPG, WEBP, or SVG up to 2MB.</p>
                            </div>
                        </div>
                    </div>

                    <div class="pt-2 flex justify-end">
                        <button type="submit" class="rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition">
                            Save Profile Details
                        </button>
                    </div>
                </form>
            </div>

            <!-- Section 2: Security & Password Update -->
            <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-slate-900 dark:text-white">Security & Password</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400">Ensure your account is using a long, random password</p>
                    </div>
                </div>

                <form method="POST" action="{{ route('admin.profile.password') }}" class="space-y-5" x-data="{ showPass: false }">
                    @csrf
                    @method('PUT')

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Current Password *</label>
                        <input :type="showPass ? 'text' : 'password'" 
                               name="current_password" 
                               required 
                               autocomplete="current-password"
                               placeholder="••••••••"
                               class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">New Password *</label>
                            <input :type="showPass ? 'text' : 'password'" 
                                   name="password" 
                                   required 
                                   autocomplete="new-password"
                                   placeholder="Minimum 8 characters"
                                   class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                        </div>

                        <div>
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Confirm New Password *</label>
                            <input :type="showPass ? 'text' : 'password'" 
                                   name="password_confirmation" 
                                   required 
                                   autocomplete="new-password"
                                   placeholder="Re-type new password"
                                   class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                        </div>
                    </div>

                    <div class="flex items-center justify-between pt-1">
                        <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <input type="checkbox" x-model="showPass" class="rounded border-slate-300 text-blue-600 focus:ring-0">
                            <span>Show passwords in plain text</span>
                        </label>

                        <button type="submit" class="rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white px-6 py-2.5 text-xs font-bold text-white shadow-md transition">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>

        </div>

    </div>

</div>
@endsection
