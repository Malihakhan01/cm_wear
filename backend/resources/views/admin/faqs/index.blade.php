@extends('layouts.admin')

@section('title', 'FAQs Management')
@section('header_title', 'Frequently Asked Questions')

@section('content')
<div class="space-y-6">
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Add FAQ (1 Col) -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Add FAQ Question</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Add answers to common manufacturing, MOQ, shipping, and customizer queries</p>

            <form method="POST" action="{{ route('admin.faqs.store') }}" class="space-y-4 pt-2">
                @csrf

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Topic Group *</label>
                    <input type="text" name="topic" required placeholder="e.g. Manufacturing & Lead Times" list="topicList" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                    <datalist id="topicList">
                        <option value="General">
                        <option value="Customizer & 3D Tools">
                        <option value="MOQ & Bulk Pricing">
                        <option value="Manufacturing & Lead Times">
                        <option value="Sampling & Prototypes">
                        <option value="Worldwide Shipping & Duties">
                    </datalist>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Question *</label>
                    <input type="text" name="question" required placeholder="e.g. What is your minimum order quantity for custom fleece hoodies?" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Detailed Answer *</label>
                    <x-wysiwyg name="answer" placeholder="Provide clear factory guidelines, policies, or explanations..." height="140px" :compact="true" :required="true" />
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Sort Order</label>
                    <input type="number" name="sort_order" value="0" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>

                <button type="submit" class="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition">
                    Add FAQ Item
                </button>
            </form>
        </div>

        <!-- Right Column: FAQs List (2 Cols) -->
        <div class="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">FAQ Directory</h3>
                @if($topics->isNotEmpty())
                    <div class="flex items-center gap-2">
                        <a href="{{ route('admin.faqs.index') }}" class="rounded-lg px-2.5 py-1 text-xs font-bold {{ !request('topic') ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' }}">All</a>
                        @foreach($topics as $t)
                            <a href="{{ route('admin.faqs.index', ['topic' => $t]) }}" class="rounded-lg px-2.5 py-1 text-xs font-bold {{ request('topic') === $t ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' }}">{{ $t }}</a>
                        @endforeach
                    </div>
                @endif
            </div>

            @if($faqs->isEmpty())
                <div class="py-12 text-center text-slate-400 text-sm">
                    No FAQ items registered yet.
                </div>
            @else
                <div class="space-y-4">
                    @foreach($faqs as $faq)
                        <div class="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-950/60 space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                                    {{ $faq->topic }}
                                </span>

                                <form method="POST" action="{{ route('admin.faqs.destroy', $faq->id) }}" onsubmit="return confirm('Delete FAQ?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-xs font-bold text-rose-500 hover:text-rose-700">Delete</button>
                                </form>
                            </div>

                            <h4 class="font-bold text-sm text-slate-900 dark:text-white">
                                {{ $faq->question }}
                            </h4>

                            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                {!! strip_tags($faq->answer) !!}
                            </p>
                        </div>
                    @endforeach
                </div>

                <div class="mt-6">
                    {{ $faqs->links() }}
                </div>
            @endif
        </div>

    </div>

</div>
@endsection
