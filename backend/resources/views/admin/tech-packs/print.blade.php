<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FACTORY TECH PACK SPECIFICATION — {{ $techPack->code }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: #ffffff;
            color: #0f172a;
            padding: 24px;
            font-size: 11px;
            line-height: 1.4;
        }
        .header-bar {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 12px;
            margin-bottom: 16px;
        }
        .brand-title {
            font-size: 18px;
            font-weight: 800;
            letter-spacing: -0.5px;
            text-transform: uppercase;
        }
        .meta-badge {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 4px;
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
        }
        .status-badge {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 4px;
            color: #ffffff;
            background: #16a34a;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }
        .section-box {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
            background: #f8fafc;
        }
        .section-title {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #475569;
            margin-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }
        th, td {
            padding: 6px 8px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        th {
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            font-size: 9px;
        }
        .color-swatch-chip {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 3px;
            border: 1px solid rgba(0,0,0,0.2);
            vertical-align: middle;
            margin-right: 4px;
        }
        .preview-container {
            display: flex;
            gap: 12px;
            justify-content: center;
            align-items: center;
            background: #0f172a;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
        }
        .preview-img-box {
            width: 180px;
            height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .preview-img-box img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        .stamp-box {
            border: 2px dashed #94a3b8;
            border-radius: 6px;
            padding: 8px;
            text-align: center;
            font-size: 9px;
            color: #64748b;
        }
        @media print {
            body { padding: 0; font-size: 10px; }
            .no-print { display: none; }
            @page { margin: 12mm; }
        }
    </style>
</head>
<body>

    <!-- Non-print Action Header -->
    <div class="no-print" style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; background: #0f172a; color: white; padding: 12px 16px; border-radius: 8px;">
        <span style="font-weight: 700; font-family: 'JetBrains Mono', monospace;">FACTORY TECH PACK SPEC SHEET — {{ $techPack->code }}</span>
        <div>
            <button onclick="window.print()" style="padding: 6px 14px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; margin-right: 8px;">
                🖨️ Print / Save as PDF
            </button>
            <button onclick="window.close()" style="padding: 6px 12px; background: #334155; color: white; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;">
                Close
            </button>
        </div>
    </div>

    <!-- Factory Document Header -->
    <div class="header-bar">
        <div>
            <div class="brand-title">TAWFIQ INDUSTRIES — FACTORY SPECIFICATION SHEET</div>
            <div style="font-size: 13px; font-weight: 700; margin-top: 4px;">{{ $techPack->style_name }}</div>
            <div style="font-size: 10px; color: #64748b; font-family: 'JetBrains Mono', monospace; margin-top: 2px;">
                Fabric: {{ $techPack->fabric_spec }} ({{ $techPack->target_gsm }} GSM) • Season: {{ $techPack->season }} • Version: v{{ $techPack->version ?? '1.0' }}
            </div>
        </div>

        <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
            <span class="meta-badge">CODE: {{ $techPack->code }}</span>
            <span class="status-badge" style="background: {{ $techPack->status === 'approved' ? '#16a34a' : ($techPack->status === 'rejected' ? '#dc2626' : '#2563eb') }};">
                STATUS: {{ strtoupper($techPack->status ?? 'SUBMITTED') }}
            </span>
            <span style="font-size: 9px; color: #64748b;">Generated: {{ $techPack->created_at->format('Y-m-d H:i') }}</span>
        </div>
    </div>

    <!-- Elevation Mockups (Front & Back) -->
    <div class="preview-container">
        <div style="text-align: center;">
            <div class="preview-img-box">
                <img src="{{ $techPack->preview_front ?: asset('hoodie/front_body.png') }}" alt="Front Elevation" />
            </div>
            <span style="color: #94a3b8; font-family: 'JetBrains Mono', monospace; font-size: 9px; text-transform: uppercase;">Front Elevation</span>
        </div>

        <div style="text-align: center;">
            <div class="preview-img-box">
                <img src="{{ $techPack->preview_back ?: asset('hoodie/back_body.png') }}" alt="Back Elevation" />
            </div>
            <span style="color: #94a3b8; font-family: 'JetBrains Mono', monospace; font-size: 9px; text-transform: uppercase;">Back Elevation</span>
        </div>
    </div>

    <div class="grid-2">
        <!-- 1. Colorways & Placement Spec -->
        <div class="section-box">
            <div class="section-title">Garment Component Colorways</div>
            <table>
                <thead>
                    <tr>
                        <th>Zone / Component</th>
                        <th>Color Spec</th>
                        <th>Hex Code</th>
                    </tr>
                </thead>
                <tbody>
                    @php $colors = is_array($techPack->parts_colors) ? $techPack->parts_colors : (json_decode($techPack->parts_colors, true) ?: []); @endphp
                    @forelse($colors as $part => $hex)
                        <tr>
                            <td style="font-weight: 700; text-transform: capitalize;">{{ str_replace('_', ' ', $part) }}</td>
                            <td>
                                <span class="color-swatch-chip" style="background-color: {{ $hex }}"></span>
                                <span>{{ $hex }}</span>
                            </td>
                            <td style="font-family: 'JetBrains Mono', monospace;">{{ $hex }}</td>
                        </tr>
                    @empty
                        <tr><td colspan="3" style="text-align: center; color: #94a3b8;">Standard Atelier Colorway</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- 2. Manufacturing Guidelines & Bill of Materials -->
        <div class="section-box">
            <div class="section-title">Bill of Materials (BOM)</div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Specification</th>
                        <th>Consumption</th>
                    </tr>
                </thead>
                <tbody>
                    @php $boms = is_array($techPack->bill_of_materials) ? $techPack->bill_of_materials : (json_decode($techPack->bill_of_materials, true) ?: []); @endphp
                    @forelse($boms as $bom)
                        <tr>
                            <td style="font-weight: 700;">{{ $bom['item'] ?? '-' }}</td>
                            <td>{{ $bom['spec'] ?? '-' }}</td>
                            <td style="font-family: 'JetBrains Mono', monospace;">{{ $bom['consumption'] ?? '1 pc' }}</td>
                        </tr>
                    @empty
                        <tr><td colspan="3" style="text-align: center; color: #94a3b8;">Atelier Default BOM</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- 3. Points of Measure (POM) Grading Table -->
    <div class="section-box" style="margin-bottom: 16px;">
        <div class="section-title">Points of Measure (POM) Grading Matrix (Tolerance: ±1.0 cm)</div>
        @php 
            $pom = is_array($techPack->pom_measurements) ? $techPack->pom_measurements : (json_decode($techPack->pom_measurements, true) ?: []);
            $matrix = $pom['grading_matrix'] ?? ($pom['matrix'] ?? null);
        @endphp
        @if($matrix && is_array($matrix))
            <table>
                <thead>
                    <tr>
                        <th>Size</th>
                        @foreach(array_keys(reset($matrix)) as $col)
                            <th>{{ str_replace('_', ' ', $col) }}</th>
                        @endforeach
                    </tr>
                </thead>
                <tbody>
                    @foreach($matrix as $sz => $vals)
                        <tr>
                            <td style="font-weight: 800; font-family: 'JetBrains Mono', monospace; color: #2563eb;">{{ $sz }}</td>
                            @foreach($vals as $v)
                                <td style="font-family: 'JetBrains Mono', monospace;">{{ $v }} cm</td>
                            @endforeach
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p style="color: #64748b;">Standard grading matrix according to factory pattern #SF-PAT-01.</p>
        @endif
    </div>

    <!-- 4. Stitching, Embellishments & Approval Sign-Off -->
    <div class="grid-2">
        <div class="section-box">
            <div class="section-title">Stitching & Embellishment Guidelines</div>
            <p style="font-size: 10px; margin-bottom: 6px;"><strong>Decoration Method:</strong> {{ $techPack->decoration_method ?? '3D Puff Embroidery / Direct Print' }}</p>
            <p style="font-size: 10px; margin-bottom: 6px;"><strong>Wash Standard:</strong> {{ $techPack->wash_type ?? 'Clean Raw Mill Finish' }}</p>
            <p style="font-size: 10px; color: #475569;"><strong>Stitching Notes:</strong> {{ $techPack->stitching_notes ?? 'Double-needle flatlock topstitching along seams. 100% pre-shrunk wash test under AQL 2.5 protocol.' }}</p>
        </div>

        <div class="section-box">
            <div class="section-title">Quality Assurance & Factory Approval Stamp</div>
            <div class="grid-2" style="margin-bottom: 0;">
                <div class="stamp-box">
                    <strong>PATTERN MAKER SIGN-OFF</strong><br>
                    <span style="font-size: 8px;">CAD Pattern Verified</span><br>
                    <span style="font-family: 'JetBrains Mono', monospace;">APPROVED</span>
                </div>
                <div class="stamp-box" style="border-color: {{ $techPack->status === 'approved' ? '#16a34a' : '#94a3b8' }};">
                    <strong>FACTORY PRODUCTION QA</strong><br>
                    <span>{{ $techPack->approver->name ?? 'QA Inspector' }}</span><br>
                    <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: {{ $techPack->status === 'approved' ? '#16a34a' : '#64748b' }};">
                        {{ strtoupper($techPack->status ?? 'PENDING') }}
                    </span>
                </div>
            </div>
        </div>
    </div>

    <div style="margin-top: 16px; text-align: center; font-size: 9px; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">
        CONFIDENTIAL FACTORY PRODUCTION SPECIFICATION • TAWFIQ INDUSTRIES SIALKOT FACILITY 01 • DOCUMENT ID: {{ $techPack->code }}
    </div>

</body>
</html>
