f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '<div style={{background:m.featured?"var(--navy)":"var(--cream)",borderRadius:"16px",overflow:"hidden",border:m.featured?"2px solid var(--gold)":"1px solid var(--cream-dark)",transition:"all 0.3s",textAlign:"center"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-6px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>'
new = '<div style={{background:m.featured?"var(--navy)":"var(--cream)",borderRadius:"16px",overflow:"hidden",border:m.featured?"2px solid var(--gold)":"1px solid var(--cream-dark)",transition:"all 0.3s",textAlign:"center",position:"relative"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px)";e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.15)";const btn=e.currentTarget.querySelector(".linkedin-btn");if(btn)btn.style.opacity="1";btn&&(btn.style.transform="translateY(0)");}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";const btn=e.currentTarget.querySelector(".linkedin-btn");if(btn)btn.style.opacity="0";btn&&(btn.style.transform="translateY(10px)");}}>'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('src/App.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
