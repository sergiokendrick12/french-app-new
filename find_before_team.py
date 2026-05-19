f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Find the section tag before Meet Our Team
idx = c.find('Meet Our Team')
print(repr(c[idx-400:idx-200]))
