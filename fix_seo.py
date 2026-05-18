content = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0d1b2a" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>International French Academy | Kigali, Rwanda</title>
    <meta name="title" content="International French Academy | Kigali, Rwanda" />
    <meta name="description" content="Rwanda's premier French language academy. Prepare for DELF, DALF, TCF, TEF certifications with expert FLE trainers at Norrsken House, Kigali." />
    <meta name="keywords" content="French academy Rwanda, DELF Kigali, TCF Rwanda, TEF Rwanda, DALF Kigali, learn French Rwanda, French certification Kigali, cours de francais Kigali" />
    <meta name="author" content="International French Academy" />
    <meta name="robots" content="index, follow" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://internationalfrenchacademy.org/" />
    <meta property="og:title" content="International French Academy | Kigali, Rwanda" />
    <meta property="og:description" content="Rwanda's premier French language academy. Get certified in DELF, DALF, TCF, TEF. Expert trainers at Norrsken House, Kigali." />
    <meta property="og:image" content="https://internationalfrenchacademy.org/logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="International French Academy | Kigali, Rwanda" />
    <meta name="twitter:description" content="Rwanda's premier French language academy. Get certified in DELF, DALF, TCF, TEF." />
    <meta name="twitter:image" content="https://internationalfrenchacademy.org/logo.png" />
    <meta name="geo.region" content="RW-01" />
    <meta name="geo.placename" content="Kigali, Rwanda" />
    <link rel="canonical" href="https://internationalfrenchacademy.org/" />
  </head>
  <body>
    <noscript>International French Academy - Rwanda's premier French language academy in Kigali. DELF, DALF, TCF, TEF certifications.</noscript>
    <div id="root"></div>
  </body>
</html>
"""
f = open('public/index.html', 'w', encoding='utf-8')
f.write(content)
f.close()
print('Done!')
