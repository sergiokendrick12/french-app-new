f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Fix card hover - simplify the onMouseEnter/Leave
old = '''onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px)";e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.15)";const btn=e.currentTarget.querySelector(".linkedin-btn");if(btn)btn.style.opacity="1";btn&&(btn.style.transform="translateY(0)");}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";const btn=e.currentTarget.querySelector(".linkedin-btn");if(btn)btn.style.opacity="0";btn&&(btn.style.transform="translateY(10px)");}}'''
new = 'onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px)";e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.15)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

# Fix linkedin button - always visible
old2 = 'opacity:0,transform:"translateY(10px)",transition:"all 0.3s ease"'
new2 = 'opacity:1,transition:"all 0.3s ease"'
count2 = c.count(old2)
print('opacity found:', count2)
c = c.replace(old2, new2, 1)

f = open('src/App.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
