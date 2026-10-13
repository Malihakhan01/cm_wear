@extends('layouts.admin')

@section('title', 'Edit Article: ' . $post->title)
@section('header_title', 'Edit Blog Article')

@section('content')
<div class="space-y-6">
    
    <div class="flex items-center justify-between">
        <a href="{{ route('admin.blogs.index') }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Back to Articles
        </a>
    </div>

    <form method="POST" action="{{ route('admin.blogs.update', $post->id) }}" 
          x-data="{
              title: {{ json_encode(old('title', $post->title)) }},
              summary: {{ json_encode(old('summary', $post->summary ?? '')) }},
              metaTitle: {{ json_encode(old('meta_title', $post->meta_title ?? '')) }},
              metaDescription: {{ json_encode(old('meta_description', $post->meta_description ?? '')) }},
              metaTitleManuallyEdited: {{ old('meta_title', $post->meta_title) ? 'true' : 'false' }},
              metaDescManuallyEdited: {{ old('meta_description', $post->meta_description) ? 'true' : 'false' }},

              onTitleInput() {
                  if (!this.metaTitleManuallyEdited || this.metaTitle.trim() === '') {
                      this.metaTitle = this.title;
                  }
              },
              onSummaryInput() {
                  if (!this.metaDescManuallyEdited || this.metaDescription.trim() === '') {
                      this.metaDescription = this.summary.slice(0, 160);
                  }
              }
          }"
          class="space-y-8">
        @csrf
        @method('PUT')

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Left Column: Article Body (2 Cols) -->
            <div class="lg:col-span-2 space-y-6">
                
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Article Content</h3>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Article Title *</label>
                        <input type="text" name="title" x-model="title" @input="onTitleInput()" value="{{ old('title', $post->title) }}" required class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Custom Slug</label>
                        <input type="text" name="slug" value="{{ old('slug', $post->slug) }}" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Summary / Teaser</label>
                        <x-wysiwyg name="summary" :value="old('summary', $post->summary)" placeholder="Brief 1-2 sentence overview shown in blog cards and social sharing..." height="110px" :compact="true" />
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Full Body Content *</label>
                        <x-wysiwyg name="content" :value="old('content', $post->content)" placeholder="Write article content here..." height="320px" :required="true" />
                    </div>
                </div>

                <!-- SEO Card -->
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-bold text-slate-900 dark:text-white">SEO & Social Meta Tags</h3>
                        <span class="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">Auto-Generates if empty</span>
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Meta Title</label>
                            <span class="text-[11px] text-slate-400 dark:text-slate-500" x-text="metaTitle ? metaTitle.length + ' chars' : 'Auto'"></span>
                        </div>
                        <input type="text" name="meta_title" x-model="metaTitle" @input="metaTitleManuallyEdited = (metaTitle.trim() !== '')" placeholder="Leave empty to auto write from title" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                        <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Leave empty to auto write from article title.
                        </p>
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Meta Description</label>
                            <span class="text-[11px] text-slate-400 dark:text-slate-500" x-text="metaDescription ? metaDescription.length + ' chars' : 'Auto'"></span>
                        </div>
                        <textarea name="meta_description" rows="3" x-model="metaDescription" @input="metaDescManuallyEdited = (metaDescription.trim() !== '')" placeholder="Leave empty to auto write from summary or body..." class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">{{ old('meta_description', $post->meta_description) }}</textarea>
                        <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Leave empty to auto write from teaser summary or article content (up to 160 characters).
                        </p>
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Keywords (Comma separated)</label>
                        <input type="text" name="meta_keywords" value="{{ old('meta_keywords', $post->meta_keywords) }}" placeholder="e.g. custom apparel manufacturing, streetwear blanks, fleece hoodie GSM" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                        <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">Target search queries separated by commas.</p>
                    </div>
                </div>

            </div>

            <!-- Right Column: Settings & Publishing (1 Col) -->
            <div class="space-y-6">
                
                <!-- Status & Publish Card -->
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Publishing</h3>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Status</label>
                        <select name="status" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                            <option value="published" {{ $post->status === 'published' ? 'selected' : '' }}>Published (Public Live)</option>
                            <option value="draft" {{ $post->status === 'draft' ? 'selected' : '' }}>Draft (Private)</option>
                            <option value="archived" {{ $post->status === 'archived' ? 'selected' : '' }}>Archived</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Category</label>
                        <select name="blog_category_id" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                            <option value="">Uncategorized</option>
                            @foreach($categories as $cat)
                                <option value="{{ $cat->id }}" {{ $post->blog_category_id == $cat->id ? 'selected' : '' }}>{{ $cat->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="pt-2">
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="is_featured" value="1" {{ $post->is_featured ? 'checked' : '' }} class="rounded border-slate-300 text-blue-600 focus:ring-0">
                            <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Feature on Blog Header</span>
                        </label>
                    </div>

                    <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button type="submit" class="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition">
                            Save Changes
                        </button>
                    </div>
                </div>

                <!-- Cover Image Card -->
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Cover Image</h3>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Image URL / Path</label>
                        <input type="text" name="cover_image" value="{{ old('cover_image', $post->cover_image) }}" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                    </div>

                    @if($post->cover_image)
                        <div class="rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden h-36 border border-slate-200 dark:border-slate-700">
                            <img src="{{ $post->cover_image }}" alt="{{ $post->title }}" class="h-full w-full object-cover">
                        </div>
                    @endif
                </div>

            </div>

        </div>
    </form>

</div>
@endsection
