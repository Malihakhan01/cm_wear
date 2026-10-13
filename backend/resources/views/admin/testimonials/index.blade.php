@extends('layouts.admin')

@section('title', 'Testimonials & Reviews')
@section('header_title', 'Client Testimonials & Social Proof')

@section('content')
<div class="space-y-6">
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Add Testimonial (1 Col) -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Add Client Review</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Add authentic B2B client testimonials and feedback</p>

            <form method="POST" action="{{ route('admin.testimonials.store') }}" class="space-y-4 pt-2">
                @csrf

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Client Full Name *</label>
                    <input type="text" name="client_name" required placeholder="e.g. Marcus Vance" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Role / Title</label>
                        <input type="text" name="client_role" placeholder="Founder & Creative Lead" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Brand / Company</label>
                        <input type="text" name="company" placeholder="VANCE Heavyweight UK" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Country / City</label>
                        <input type="text" name="country" placeholder="London, United Kingdom" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Rating (1-5 Stars)</label>
                        <select name="rating" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                            <option value="5" selected>5 Stars (Excellent)</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Client Testimonial Quote *</label>
                    <x-wysiwyg name="quote" placeholder="Describe their experience with garment quality, lead times, or customizer workflow..." height="140px" :compact="true" :required="true" />
                </div>

                <div class="pt-2">
                    <label class="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" name="is_featured" value="1" checked class="rounded border-slate-300 text-blue-600 focus:ring-0">
                        <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Feature on Homepage</span>
                    </label>
                </div>

                <button type="submit" class="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition">
                    Save Testimonial
                </button>
            </form>
        </div>

        <!-- Right Column: Testimonials List (2 Cols) -->
        <div class="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 class="text-base font-bold text-slate-900 dark:text-white mb-4">Published Testimonials</h3>

            @if($testimonials->isEmpty())
                <div class="py-12 text-center text-slate-400 text-sm">
                    No testimonials added yet.
                </div>
            @else
                <div class="space-y-4">
                    @foreach($testimonials as $t)
                        <div class="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-950/60 space-y-3">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h4 class="font-bold text-slate-900 dark:text-white">{{ $t->client_name }}</h4>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ $t->client_role }} @if($t->company)&bull; {{ $t->company }}@endif @if($t->country)({{ $t->country }})@endif</p>
                                </div>

                                <div class="flex items-center gap-3">
                                    <div class="flex text-amber-400 text-xs">
                                        @for($i = 0; $i < $t->rating; $i++)
                                            ★
                                        @endfor
                                    </div>

                                    <form method="POST" action="{{ route('admin.testimonials.destroy', $t->id) }}" onsubmit="return confirm('Delete testimonial?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-xs font-bold text-rose-500 hover:text-rose-700">Delete</button>
                                    </form>
                                </div>
                            </div>

                            <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                &ldquo;{!! strip_tags($t->quote) !!}&rdquo;
                            </p>
                        </div>
                    @endforeach
                </div>

                <div class="mt-6">
                    {{ $testimonials->links() }}
                </div>
            @endif
        </div>

    </div>

</div>
@endsection
