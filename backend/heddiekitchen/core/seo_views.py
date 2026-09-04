"""SEO helpers: robots.txt, sitemap.xml, and bot OG previews for menu items."""
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET
from django.conf import settings

BOT_UA_FRAGMENTS = (
    'facebookexternalhit',
    'Facebot',
    'Twitterbot',
    'WhatsApp',
    'Slackbot',
    'LinkedInBot',
    'Discordbot',
    'TelegramBot',
)


def _site_origin(request) -> str:
    configured = getattr(settings, 'SITE_URL', None) or getattr(settings, 'FRONTEND_URL', None)
    if configured:
        return configured.rstrip('/')
    return request.build_absolute_uri('/').rstrip('/')


@require_GET
def robots_txt(request):
    origin = _site_origin(request)
    body = f"""User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /checkout
Disallow: /cart

Sitemap: {origin}/sitemap.xml
"""
    return HttpResponse(body, content_type='text/plain')


@require_GET
def sitemap_xml(request):
    from heddiekitchen.menu.models import MenuItem

    origin = _site_origin(request)
    urls = [
        '',
        '/menu',
        '/about',
        '/contact',
        '/meal-plans',
        '/catering',
        '/shipping',
        '/blog',
    ]
    items = MenuItem.objects.filter(is_available=True).only('id', 'updated_at', 'slug')

    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for path in urls:
        parts.append(
            f'<url><loc>{origin}{path}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>'
        )
    for item in items:
        parts.append(
            f'<url><loc>{origin}/menu/{item.id}</loc>'
            f'<lastmod>{item.updated_at.date().isoformat()}</lastmod>'
            f'<changefreq>weekly</changefreq><priority>0.7</priority></url>'
        )
    parts.append('</urlset>')
    return HttpResponse('\n'.join(parts), content_type='application/xml')


def is_social_bot(request) -> bool:
    ua = (request.META.get('HTTP_USER_AGENT') or '').lower()
    return any(frag.lower() in ua for frag in BOT_UA_FRAGMENTS)


@require_GET
def menu_item_share_page(request, item_id: int):
    """
    For social crawlers: return OG HTML with image/name/description.
    For normal browsers: serve the SPA index.html so React Router handles /menu/:id.
    """
    from django.views.generic import TemplateView

    if not is_social_bot(request):
        return TemplateView.as_view(template_name='index.html')(request)

    from heddiekitchen.menu.models import MenuItem
    from heddiekitchen.menu.serializers import MenuItemDetailSerializer

    item = get_object_or_404(MenuItem, pk=item_id)
    origin = _site_origin(request)
    page_url = f'{origin}/menu/{item.id}'
    try:
        data = MenuItemDetailSerializer(item, context={'request': request}).data
        image_url = data.get('image_url') or ''
        description = (data.get('description') or '')[:200]
        name = data.get('name') or item.name
        price = data.get('price') or item.price
    except Exception:
        image_url = request.build_absolute_uri(item.image.url) if item.image else ''
        description = (item.description or '')[:200]
        name = item.name
        price = item.price

    # Escape quotes for attribute safety
    def esc(s: str) -> str:
        return (
            str(s)
            .replace('&', '&amp;')
            .replace('"', '&quot;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
        )

    title = esc(f'{name} | HEDDIEKITCHEN')
    desc = esc(description or f'Order {name} from HEDDIEKITCHEN — NGN {price}')
    name_esc = esc(name)
    image_esc = esc(image_url)
    page_esc = esc(page_url)

    og_image = f'<meta property="og:image" content="{image_esc}" />' if image_url else ''
    tw_image = f'<meta name="twitter:image" content="{image_esc}" />' if image_url else ''

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>{title}</title>
  <meta name="description" content="{desc}" />
  <meta property="og:type" content="product" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{desc}" />
  <meta property="og:url" content="{page_esc}" />
  <meta property="og:site_name" content="HEDDIEKITCHEN" />
  {og_image}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{title}" />
  <meta name="twitter:description" content="{desc}" />
  {tw_image}
  <link rel="canonical" href="{page_esc}" />
</head>
<body>
  <h1>{name_esc}</h1>
  <p>{desc}</p>
  <p><a href="{page_esc}">View on HEDDIEKITCHEN</a></p>
</body>
</html>"""
    return HttpResponse(html, content_type='text/html')

