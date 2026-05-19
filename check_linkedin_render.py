f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Check what's happening around the linkedin button rendering
idx = c.find('{m.linkedin&&')
print('linkedin render found:', idx)
print(repr(c[idx:idx+400]))
