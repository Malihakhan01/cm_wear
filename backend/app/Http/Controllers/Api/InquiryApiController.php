<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Customer;
use App\Models\NewsletterSubscription;
use App\Models\Rfq;
use Illuminate\Http\Request;

class InquiryApiController extends Controller
{
    /**
     * Store an RFQ / Custom Manufacturing Inquiry from the 3D Customizer or Quote form.
     */
    public function storeRfq(Request $request)
    {
        $validated = $request->validate([
            'inquiry_type' => 'nullable|string',
            'full_name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'company' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:100',
            'quantity' => 'nullable|integer|min:1',
            'target_price' => 'nullable|numeric',
            'target_lead_days' => 'nullable|integer',
            'incoterm' => 'nullable|string|max:20',
            'destination_port' => 'nullable|string|max:100',
            'message' => 'nullable|string',
            'product_id' => 'nullable|exists:products,id',
            'items' => 'nullable|array',
            'requirements' => 'nullable|array',
            'files' => 'nullable|array',
        ]);

        $fullName = !empty($validated['full_name']) ? trim($validated['full_name']) : 'Brand Buyer / Designer';
        $email = strtolower(trim($validated['email']));

        // Auto-associate or create Customer profile in core factory CRM
        $customer = null;
        try {
            $nameParts = explode(' ', $fullName, 2);
            $firstName = $nameParts[0] ?: 'Brand';
            $lastName = $nameParts[1] ?? 'Client';

            $customer = Customer::firstOrCreate(
                ['email' => $email],
                [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'company_name' => $validated['company'] ?? null,
                    'phone' => $validated['phone'] ?? null,
                    'whatsapp' => $validated['phone'] ?? null,
                    'status' => 'active',
                ]
            );

            // Update company or phone if provided
            if ($customer && (!$customer->company_name && !empty($validated['company']))) {
                $customer->update(['company_name' => $validated['company']]);
            }
            if ($customer && (!$customer->phone && !empty($validated['phone']))) {
                $customer->update(['phone' => $validated['phone'], 'whatsapp' => $validated['phone']]);
            }
        } catch (\Throwable $e) {
            \Log::warning("Customer auto-linking fallback: " . $e->getMessage());
        }

        $rfq = Rfq::create([
            'customer_id' => $customer?->id,
            'inquiry_type' => $validated['inquiry_type'] ?? 'bulk_manufacturing',
            'full_name' => $fullName,
            'email' => $email,
            'company' => $validated['company'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'country' => $validated['country'] ?? null,
            'quantity' => $validated['quantity'] ?? null,
            'target_price' => $validated['target_price'] ?? null,
            'target_lead_days' => $validated['target_lead_days'] ?? null,
            'incoterm' => $validated['incoterm'] ?? 'FOB',
            'destination_port' => $validated['destination_port'] ?? null,
            'message' => $validated['message'] ?? null,
            'product_id' => $validated['product_id'] ?? null,
            'items' => $validated['items'] ?? null,
            'requirements' => $validated['requirements'] ?? null,
            'files' => $validated['files'] ?? null,
            'status' => 'new',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your manufacturing quote inquiry has been received. Our studio team will review your specifications.',
            'rfq_number' => $rfq->rfq_number,
            'id' => $rfq->id,
        ], 201);
    }

    /**
     * Store a general contact message.
     */
    public function storeContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        $contactName = !empty($validated['name']) ? trim($validated['name']) : 'Prospective Brand Client';

        $contact = ContactMessage::create([
            'name' => $contactName,
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'company' => $validated['company'] ?? null,
            'subject' => $validated['subject'] ?? 'Website Inquiry',
            'message' => $validated['message'],
            'ip_address' => $request->ip(),
            'status' => 'unread',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully. Our support team will get in touch.',
            'id' => $contact->id,
        ], 201);
    }

    /**
     * Store a newsletter subscription.
     */
    public function storeNewsletter(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        NewsletterSubscription::firstOrCreate(
            ['email' => $validated['email']],
            ['source' => 'website_footer', 'is_subscribed' => true]
        );

        return response()->json([
            'success' => true,
            'message' => 'Subscribed to our manufacturing drops & studio updates.',
        ], 201);
    }
}
