<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Newsletter</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .content p {
            color: #4b5563;
            font-size: 16px;
            margin-bottom: 20px;
        }
        .benefits {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .benefits h3 {
            color: #92400e;
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 15px;
            font-weight: 600;
        }
        .benefits ul {
            margin: 0;
            padding-left: 20px;
            color: #78350f;
        }
        .benefits li {
            margin-bottom: 10px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            color: #6b7280;
            font-size: 14px;
            margin: 10px 0;
        }
        .footer a {
            color: #f59e0b;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .unsubscribe {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .unsubscribe a {
            color: #9ca3af;
            font-size: 12px;
        }
        @media only screen and (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            .header h1 {
                font-size: 24px;
            }
            .content h2 {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>🎉 Welcome to Our Newsletter!</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <h2>Thank you for subscribing{{ $subscription->name ? ', ' . $subscription->name : '' }}!</h2>
            
            <p>
                We're thrilled to have you join our community! You've successfully subscribed to our newsletter 
                and will now receive the latest updates, exclusive content, and special offers directly in your inbox.
            </p>

            <p>
                Your subscription was confirmed at <strong>{{ $subscription->email }}</strong> on 
                {{ $subscription->subscribed_at->format('F j, Y') }}.
            </p>

            <!-- Benefits Box -->
            <div class="benefits">
                <h3>📬 What You'll Receive:</h3>
                <ul>
                    <li><strong>Latest Updates:</strong> Stay informed about our newest features and announcements</li>
                    <li><strong>Exclusive Content:</strong> Access to premium articles and resources</li>
                    <li><strong>Special Offers:</strong> Early access to promotions and events</li>
                    <li><strong>Industry Insights:</strong> Expert tips and best practices</li>
                    <li><strong>Community News:</strong> Connect with fellow subscribers and share experiences</li>
                </ul>
            </div>

            <p>
                We respect your inbox and promise to send only valuable, relevant content. No spam, ever.
            </p>

            <center>
                <a href="{{ url('/') }}" class="cta-button">
                    Visit Our Website
                </a>
            </center>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                If you have any questions or feedback, feel free to reply to this email. We'd love to hear from you!
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                <strong>{{ config('app.name') }}</strong><br>
                Building amazing experiences together
            </p>
            
            <p>
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </p>

            <div class="unsubscribe">
                <p style="font-size: 11px; color: #9ca3af; margin-top: 10px;">
                    This email was sent to {{ $subscription->email }} because you subscribed to our newsletter.<br>
                    You can unsubscribe at any time by replying to this email.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
