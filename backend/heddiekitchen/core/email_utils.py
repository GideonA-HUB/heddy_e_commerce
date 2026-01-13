"""
Email utility functions for sending transactional emails.
Uses Resend API instead of SMTP to avoid Railway network restrictions.
With a verified custom domain (heddiekitchen.com), Resend works perfectly.
"""
import requests
import threading
import traceback
from django.conf import settings
from django.utils.html import strip_tags


def _send_email_via_resend_api(to_email: str, subject: str, html_content: str, text_content: str = None):
    """
    Send email using Resend REST API with verified custom domain (heddiekitchen.com).
    Returns True if successful, False otherwise.
    """
    # Check if Resend API key is configured
    resend_api_key = getattr(settings, 'RESEND_API_KEY', None)
    if not resend_api_key:
        # Fallback: try to get from EMAIL_HOST_PASSWORD if it's a Resend key
        email_password = getattr(settings, 'EMAIL_HOST_PASSWORD', '')
        if email_password and email_password.startswith('re_'):
            resend_api_key = email_password
        else:
            print("RESEND_API_KEY not configured - cannot send email")
            return False
    
    # Get from email - use verified domain or fallback to Resend default domain
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@heddiekitchen.com')
    
    # If domain is not verified, fallback to Resend's default domain
    # This allows emails to work while domain verification is pending
    if '@heddiekitchen.com' in from_email:
        # Check if we should use fallback (domain not verified)
        # Try to use Resend's default domain as fallback
        # Format: onboarding@resend.dev (works without domain verification)
        use_fallback = getattr(settings, 'RESEND_USE_FALLBACK_DOMAIN', 'False').lower() == 'true'
        if use_fallback:
            from_email = 'onboarding@resend.dev'
        # Otherwise, try the custom domain first, and if it fails, we'll catch the error
    
    # Resend API endpoint
    url = "https://api.resend.com/emails"
    
    headers = {
        "Authorization": f"Bearer {resend_api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "from": from_email,
        "to": [to_email],
        "subject": subject,
        "html": html_content,
    }
    
    # Add text content if provided
    if text_content:
        payload["text"] = text_content
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Email sent successfully via Resend API to {to_email}. ID: {response_data.get('id', 'N/A')}")
            return True
        elif response.status_code == 403:
            # Domain not verified - try fallback domain
            error_data = response.json()
            if 'domain is not verified' in error_data.get('message', '').lower():
                print(f"Domain not verified. Attempting fallback domain...")
                # Retry with Resend's default domain
                payload['from'] = 'onboarding@resend.dev'
                try:
                    retry_response = requests.post(url, json=payload, headers=headers, timeout=30)
                    if retry_response.status_code == 200:
                        retry_data = retry_response.json()
                        print(f"Email sent successfully via Resend API (fallback domain) to {to_email}. ID: {retry_data.get('id', 'N/A')}")
                        return True
                    else:
                        print(f"Resend API fallback also failed ({retry_response.status_code}): {retry_response.text}")
                except Exception as e:
                    print(f"Resend API fallback request failed: {e}")
            
            error_msg = response.text
            print(f"Resend API error ({response.status_code}): {error_msg}")
            return False
        else:
            error_msg = response.text
            print(f"Resend API error ({response.status_code}): {error_msg}")
            return False
            
    except requests.exceptions.Timeout:
        print(f"Resend API request timed out for {to_email}")
        return False
    except requests.exceptions.RequestException as e:
        print(f"Resend API request failed for {to_email}: {e}")
        traceback.print_exc()
        return False
    except Exception as e:
        print(f"Unexpected error sending email via Resend API to {to_email}: {e}")
        traceback.print_exc()
        return False


def _send_email_async(to_email: str, subject: str, html_content: str, text_content: str = None):
    """Helper to send email in a separate thread (non-blocking)."""
    thread = threading.Thread(
        target=_send_email_via_resend_api,
        args=(to_email, subject, html_content, text_content)
    )
    thread.daemon = True
    thread.start()


def send_newsletter_welcome_email(email: str):
    """Send welcome email to newsletter subscribers using Resend API with verified domain."""
    subject = '🎉 Welcome to HEDDIEKITCHEN - Your Taste Buds Just Joined the VIP Club!'
    
    frontend_url = settings.FRONTEND_URL or 'https://heddiekitchen.com'
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; }}
            .header {{ background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 40px 20px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }}
            .content {{ padding: 35px 30px; background-color: #ffffff; }}
            .content p {{ margin: 0 0 18px 0; font-size: 16px; color: #333; }}
            .content p.greeting {{ font-size: 20px; font-weight: 600; color: #dc2626; margin-bottom: 20px; }}
            .content p.highlight {{ font-size: 18px; color: #dc2626; font-weight: 600; margin: 25px 0 15px 0; }}
            .benefits {{ background-color: #fef2f2; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #dc2626; }}
            .benefits ul {{ margin: 0; padding-left: 25px; }}
            .benefits li {{ margin: 12px 0; font-size: 16px; color: #4b5563; line-height: 1.8; }}
            .footer {{ text-align: center; padding: 30px 20px; background-color: #f9fafb; color: #6b7280; font-size: 13px; border-top: 1px solid #e5e7eb; }}
            .button {{ display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; text-decoration: none; border-radius: 8px; margin: 30px 0; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3); transition: transform 0.2s; }}
            .button:hover {{ transform: translateY(-2px); box-shadow: 0 6px 12px rgba(220, 38, 38, 0.4); }}
            .signature {{ margin-top: 30px; padding-top: 25px; border-top: 2px solid #fee2e2; text-align: center; }}
            .signature p {{ margin: 8px 0; color: #dc2626; font-weight: 600; }}
            .emoji {{ font-size: 1.2em; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to HEDDIEKITCHEN! 🎉</h1>
            </div>
            <div class="content">
                <p class="greeting">Hey lover of good food! 👋</p>
                
                <p>We're so happy you're here, and your taste buds officially joined the VIP club! 🎊</p>
                
                <p>Thank you for subscribing to <strong>HEDDIEKITCHEN</strong>. From now on, expect mouth-watering updates and delicious surprises straight to your inbox! 🍽️✨</p>
                
                <p class="highlight">Here's what you'll be getting:</p>
                
                <div class="benefits">
                    <ul>
                        <li>🎁 <strong>Exclusive discounts and foodie deals</strong> - Save more, eat more!</li>
                        <li>🍛 <strong>New menu drops and seasonal specials</strong> - Be the first to know!</li>
                        <li>👨‍🍳 <strong>Cooking tips and yummy recipe inspiration</strong> - Become a kitchen pro!</li>
                        <li>🚚 <strong>Delivery updates so you don't miss your cravings</strong> - Stay in the loop!</li>
                    </ul>
                </div>
                
                <p>We're committed to bringing you the best of authentic African cuisine, delivered fresh to your doorstep. We can't wait to feed you, literally! 😄</p>
                
                <p style="text-align: center; margin: 35px 0;">
                    <a href="{frontend_url}" class="button">🌐 Visit Our Website</a>
                </p>
                
                <p style="margin-top: 30px;">If you have any questions, feel free to reach out to us at <a href="mailto:contact@heddiekitchen.com" style="color: #dc2626; text-decoration: none; font-weight: 600;">contact@heddiekitchen.com</a> or call us at <strong>+234 903 523 4365</strong>. 📞</p>
                
                <div class="signature">
                    <p style="font-size: 18px; margin-bottom: 10px;">Welcome to the HEDDIEKITCHEN family! 👨‍👩‍👧‍👦</p>
                    <p style="font-size: 16px; margin-top: 15px;">Made with ❤️</p>
                    <p style="font-size: 16px; margin-top: 5px;">The HEDDIEKITCHEN Team 🍳</p>
                </div>
            </div>
            <div class="footer">
                <p style="margin: 5px 0;"><strong>© 2025 HEDDIEKITCHEN. All rights reserved.</strong></p>
                <p style="margin: 5px 0;">📍 Abuja, Nigeria</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    # Send email asynchronously (non-blocking)
    _send_email_async(email, subject, html_message, plain_message)
    return True  # Return True immediately, email is sent in background


def send_order_confirmation_email(order):
    """Send order confirmation email with receipt using Resend API."""
    customer_email = order.user.email if order.user else order.guest_email
    if not customer_email:
        customer_email = order.shipping_email  # Fallback to shipping email
    
    if not customer_email:
        print(f"No email address found for order {order.order_number}")
        return False
    
    subject = f'Order Confirmation - Order #{order.order_number}'
    
    # Determine which delivery time applies to this order
    shipping_city_lower = order.shipping_city.lower() if order.shipping_city else ''
    shipping_country_lower = order.shipping_country.lower() if order.shipping_country else ''
    
    # Determine applicable delivery time for this specific order
    if shipping_city_lower == 'abuja':
        applicable_delivery = "Abuja: 45 minutes"
    elif shipping_country_lower and shipping_country_lower != 'nigeria':
        applicable_delivery = "International: 5-7 business days"
    else:
        applicable_delivery = "Outside Abuja (Nigeria): 1-2 business days"
    
    # Build order items list
    items_html = ""
    for item in order.items.all():
        items_html += f"""
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">{item.item_name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">{item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₦{item.unit_price:,.2f}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₦{(item.unit_price * item.quantity):,.2f}</td>
        </tr>
        """
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #dc2626; color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; background-color: #f9f9f9; }}
            .order-details {{ background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }}
            .order-items {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            .order-items th {{ background-color: #f0f0f0; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }}
            .order-items td {{ padding: 10px; border-bottom: 1px solid #ddd; }}
            .total-row {{ font-weight: bold; background-color: #f9f9f9; }}
            .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            .button {{ display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
            .info-box {{ background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Confirmation</h1>
                <p>Thank you for your order!</p>
            </div>
            <div class="content">
                <p>Dear {order.shipping_name},</p>
                <p>We've received your order and are preparing it for delivery. Here are your order details:</p>
                
                <div class="order-details">
                    <h2>Order Information</h2>
                    <p><strong>Order Number:</strong> {order.order_number}</p>
                    <p><strong>Order Date:</strong> {order.created_at.strftime('%B %d, %Y at %I:%M %p')}</p>
                    <p><strong>Order Status:</strong> {order.get_status_display()}</p>
                    <p><strong>Payment Method:</strong> {order.payment_method.title() if order.payment_method else 'Paystack'}</p>
                </div>
                
                <div class="order-details">
                    <h2>Order Items</h2>
                    <table class="order-items">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th style="text-align: center;">Quantity</th>
                                <th style="text-align: right;">Unit Price</th>
                                <th style="text-align: right;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items_html}
                        </tbody>
                    </table>
                    
                    <table style="width: 100%; margin-top: 20px;">
                        <tr>
                            <td style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                            <td style="padding: 10px; text-align: right;">₦{order.subtotal:,.2f}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; text-align: right;"><strong>Delivery Fee:</strong></td>
                            <td style="padding: 10px; text-align: right;">₦{order.shipping_fee:,.2f}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; text-align: right;"><strong>Tax (7.5%):</strong></td>
                            <td style="padding: 10px; text-align: right;">₦{order.tax:,.2f}</td>
                        </tr>
                        <tr class="total-row">
                            <td style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                            <td style="padding: 10px; text-align: right;"><strong>₦{order.total:,.2f}</strong></td>
                        </tr>
                    </table>
                </div>
                
                <div class="order-details">
                    <h2>Delivery Information</h2>
                    <p><strong>Name:</strong> {order.shipping_name}</p>
                    <p><strong>Email:</strong> {order.shipping_email}</p>
                    <p><strong>Phone:</strong> {order.shipping_phone}</p>
                    <p><strong>Address:</strong> {order.shipping_address}</p>
                    <p><strong>City:</strong> {order.shipping_city}</p>
                    <p><strong>State:</strong> {order.shipping_state}</p>
                    <p><strong>Country:</strong> {order.shipping_country}</p>
                    {f'<p><strong>ZIP Code:</strong> {order.shipping_zip}</p>' if order.shipping_zip else ''}
                    {f'<p><strong>Delivery Date:</strong> {order.delivery_date.strftime("%B %d, %Y")}</p>' if order.delivery_date else ''}
                    {f'<p><strong>Special Instructions:</strong> {order.special_instructions}</p>' if order.special_instructions else ''}
                </div>
                
                <div class="info-box">
                    <h3 style="margin-top: 0;">📦 Delivery Information</h3>
                    <p><strong>Estimated Delivery Times:</strong></p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>Abuja:</strong> 45 minutes</li>
                        <li><strong>Outside Abuja (Nigeria):</strong> 1-2 business days</li>
                        <li><strong>International:</strong> 5-7 business days</li>
                    </ul>
                    <p style="margin-top: 10px;"><strong>Your Order:</strong> {applicable_delivery}</p>
                    <p>You'll receive a notification once your order is out for delivery.</p>
                </div>
                
                <p style="text-align: center;">
                    <a href="{settings.FRONTEND_URL or 'https://heddiekitchen.com'}/orders/{order.id}" class="button" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Track Your Order</a>
                </p>
                
                <p>If you have any questions about your order, please contact us at:</p>
                <ul>
                    <li>Email: <a href="mailto:contact@heddiekitchen.com">contact@heddiekitchen.com</a></li>
                    <li>Phone: +234 903 523 4365</li>
                </ul>
                
                <p>Thank you for choosing HEDDIEKITCHEN!</p>
                <p>Best regards,<br>The HEDDIEKITCHEN Team</p>
            </div>
            <div class="footer">
                <p>© 2025 HEDDIEKITCHEN. All rights reserved.</p>
                <p>Abuja, Nigeria</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    # Send email asynchronously (non-blocking)
    _send_email_async(customer_email, subject, html_message, plain_message)
    return True  # Return True immediately, email is sent in background

