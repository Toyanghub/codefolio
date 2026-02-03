<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000',
        ]);

        ContactMessage::create($validated);

        return back()->with('success', 'Thank you for your message! We\'ll get back to you soon.');
    }

    public function index()
    {
        $messages = ContactMessage::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('admin/contacts', [
            'messages' => $messages,
        ]);
    }

    public function deleteMultiple(Request $request)
    {
        $validated = $request->validate([
            'message_ids' => 'required|array',
            'message_ids.*' => 'integer|exists:contact_messages,id',
        ]);

        ContactMessage::whereIn('id', $validated['message_ids'])->delete();

        return back()->with('success', 'Selected messages have been deleted successfully.');
    }
}
