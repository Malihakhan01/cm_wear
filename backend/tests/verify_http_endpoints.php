<?php

$routes = [
    'http://127.0.0.1:8000/api/v1/health' => 'API Health Core',
    'http://127.0.0.1:8000/api/v1/customizer/config' => 'Customizer Dynamic Config',
    'http://127.0.0.1:8000/api/v1/customizer/artworks' => 'Artwork Library API',
    'http://localhost:3000/customize/custom-varsity-jacket' => 'Frontend Varsity Customizer',
    'http://localhost:3000/customize/custom-hoodie' => 'Frontend Hoodie Customizer',
    'http://localhost:3000/saved-designs' => 'Frontend Saved Designs Page'
];

echo "=== TAWFIQ INDUSTRIES: HTTP ENDPOINT VERIFICATION ===\n\n";

foreach ($routes as $url => $name) {
    $ctx = stream_context_create(['http' => ['timeout' => 8, 'ignore_errors' => true]]);
    $content = @file_get_contents($url, false, $ctx);
    $status = isset($http_response_header[0]) ? $http_response_header[0] : 'FAILED';
    $bytes = strlen($content ?: '');
    echo "[HTTP] {$name}\n";
    echo "       URL: {$url}\n";
    echo "       Status: {$status} | Size: {$bytes} bytes\n\n";
}
