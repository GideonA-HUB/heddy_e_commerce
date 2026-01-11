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
    subject = 'Welcome to HEDDIEKITCHEN Newsletter!'
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #dc2626; color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; background-color: #f9f9f9; }}
            .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            .button {{ display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to HEDDIEKITCHEN!</h1>
            </div>
            <div class="content">
                <p>Dear Valued Customer,</p>
                <p>Thank you for subscribing to our newsletter! We're excited to have you join our community.</p>
                <p>You'll now receive:</p>
                <ul>
                    <li>Exclusive offers and discounts</li>
                    <li>New menu items and seasonal specials</li>
                    <li>Cooking tips and recipes</li>
                    <li>Updates on delivery services</li>
                </ul>
                <p>We're committed to bringing you the best of authentic African cuisine, delivered fresh to your doorstep.</p>
                <p style="text-align: center;">
                    <a href="{settings.FRONTEND_URL or 'https://heddyecommerce-production.up.railway.app'}" class="button">Visit Our Website</a>
                </p>
                <p>If you have any questions, feel free to reach out to us at <a href="mailto:heddiekitchen@gmail.com">heddiekitchen@gmail.com</a> or call us at +234 903 523 4365.</p>
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
    
    # Calculate estimated delivery time (e.g., 2-3 hours for local, 1-2 days for shipping)
    if order.shipping_city and order.shipping_city.lower() in ['abuja', 'lagos']:
        delivery_time = "2-3 hours"
        delivery_note = "Your order will be delivered within 2-3 hours to your location in " + order.shipping_city
    else:
        delivery_time = "1-2 business days"
        delivery_note = "Your order will be shipped and delivered within 1-2 business days"
    
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
                            <td style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
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
                    <p><strong>Estimated Delivery Time:</strong> {delivery_time}</p>
                    <p>{delivery_note}.</p>
                    <p>You'll receive a notification once your order is out for delivery.</p>
                </div>
                
                <p style="text-align: center;">
                    <a href="{settings.FRONTEND_URL or 'https://heddyecommerce-production.up.railway.app'}/orders/{order.id}" class="button">Track Your Order</a>
                </p>
                
                <p>If you have any questions about your order, please contact us at:</p>
                <ul>
                    <li>Email: <a href="mailto:heddiekitchen@gmail.com">heddiekitchen@gmail.com</a></li>
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

