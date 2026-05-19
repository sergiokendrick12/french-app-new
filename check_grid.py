f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()
idx = c.find('gridTemplateColumns')
while idx != -1:
    print(repr(c[idx:idx+80]))
    print('---')
    idx = c.find('gridTemplateColumns', idx+1)
