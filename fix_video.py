f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '<div style={{maxWidth:"400px",margin:"0 auto",borderRadius:"20px",overflow:"hidden",boxShadow:"0 30px 60px rgba(0,0,0,0.4)",border:"2px solid rgba(201,168,67,0.3)"}}>'
new = '<div style={{maxWidth:"320px",margin:"0 auto",borderRadius:"20px",overflow:"hidden",boxShadow:"0 30px 60px rgba(0,0,0,0.4)",border:"2px solid rgba(201,168,67,0.3)"}}>'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

old2 = '<video controls style={{width:"100%",display:"block",background:"#000"}} poster="">'
new2 = '<video controls style={{width:"100%",height:"100%",display:"block",background:"#000",objectFit:"cover"}} poster="">'
count2 = c.count(old2)
print('video found:', count2)
c = c.replace(old2, new2, 1)

f = open('src/App.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
