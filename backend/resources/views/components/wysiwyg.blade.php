@props([
    'name',
    'value' => '',
    'placeholder' => 'Write description...',
    'height' => '160px',
    'maxHeight' => null,
    'compact' => false,
    'id' => null,
    'required' => false,
])

@php
    $editorId = $id ?? ('wysiwyg_' . str_replace(['[', ']', '.'], '_', $name) . '_' . uniqid());
    $initialValue = old($name, $value);
@endphp

@if($maxHeight)
<style>
#{{ $editorId }} .ql-editor {
    max-height: {{ $maxHeight }} !important;
    overflow-y: auto !important;
}
</style>
@endif

<div {{ $attributes->merge(['class' => 'wysiwyg-wrapper']) }}
     x-data="wysiwyg({
         value: {{ json_encode($initialValue ?? '') }},
         placeholder: {{ json_encode($placeholder) }},
         height: {{ json_encode($height) }},
         maxHeight: {{ json_encode($maxHeight) }},
         compact: {{ $compact ? 'true' : 'false' }}
     })">
    <div x-ref="editorContainer" id="{{ $editorId }}" class="w-full"></div>
    <input type="hidden" 
           name="{{ $name }}" 
           x-ref="hiddenInput" 
           :value="content" 
           {{ $required ? 'required' : '' }}>
</div>
