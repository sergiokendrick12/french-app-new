f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = 'gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"2rem",flexWrap:"wrap"'
new = 'gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"1.5rem",flexWrap:"wrap"'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('src/App.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
