f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '      {/* VIDEO */}\n      <section style={{background:"var(--navy)",padding:"5rem 2rem",textAlign:"center"}}>\n        <div className="container">\n          <FadeIn>'
new = '      {/* VIDEO */}\n      <section style={{background:"var(--navy)",padding:"5rem 2rem",textAlign:"center"}}>\n        <div className="container">\n          <div>'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

old2 = '          </FadeIn>\n        </div>\n      </section>\n\n      {/* TEAM */}'
new2 = '          </div>\n        </div>\n      </section>\n\n      {/* TEAM */}'
count2 = c.count(old2)
print('FadeIn close found:', count2)
c = c.replace(old2, new2, 1)

f = open('src/App.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
