content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://internationalfrenchacademy.org/</loc>
    <lastmod>2026-05-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
"""
f = open('public/sitemap.xml', 'w', encoding='utf-8')
f.write(content)
f.close()
print('Done!')
