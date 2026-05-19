f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Add team card CSS
old = ".sec-title { font-family: 'Playfair Display', serif;"
new = ".team-card { transition: transform 0.3s, box-shadow 0.3s; } .team-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); } .team-card:hover .linkedin-btn { opacity: 1 !important; } .sec-title { font-family: 'Playfair Display', serif;"
count = c.count(old)
print('css found:', count)
c = c.replace(old, new, 1)

f = open('src/App.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
