f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '{name:"Joas Irahoza",role:lang==="en"?"Multi-skilled Agent":"Agent polyvalent",photo:"staff-joas.jpeg",featured:false},'
new = '{name:"Joas Irahoza",role:lang==="en"?"Multi-skilled Agent":"Agent polyvalent",photo:"staff-joas.jpeg",featured:false},\n{name:"Serges Ndinda",role:lang==="en"?"Software Engineer":"Ingénieur Logiciel",photo:"staff-serges.jpeg",featured:false},'

count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('src/App.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
