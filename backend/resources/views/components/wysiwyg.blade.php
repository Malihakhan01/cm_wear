@props([
    'name',
    'value' => '',
    'placeholder' => 'Write description...',
    'height' => '160px',
    'compact' => false,
    'id' => null,
    'required' => false,
])

@php
    $editorId = $id ?? ('wysiwyg_' . str_replace(['[', ']', '.'], '_', $name) . '_' . uniqid());
    $initialValue = old($name, $value);
@endphp

<div {{ $attributes->merge(['class' => 'wysiwyg-wrapper']) }}
     x-data="wysiwyg({
         value: {{ json_encode($initialValue ?? '') }},
         placeholder: {{ json_encode($placeholder) }},
         height: {{ json_encode($height) }},
         compact: {{ $compact ? 'true' : 'false' }}
     })">
    <div x-ref="editorContainer" id="{{ $editorId }}" class="w-full"></div>
    <input type="hidden" 
           name="{{ $name }}" 
           x-ref="hiddenInput" 
           :value="content" 
           {{ $required ? 'required' : '' }}>
</div>
