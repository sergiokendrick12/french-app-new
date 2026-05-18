f = open('public/index.html', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '    <link rel="canonical" href="https://internationalfrenchacademy.org/" />'
new = '    <link rel="canonical" href="https://internationalfrenchacademy.org/" />\n    <meta name="google-site-verification" content="WhPR0UH-TDK0Ap4_I1it-u9f_pLrBt-L3C1LMAsBf1g" />'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('public/index.html', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
