f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Make LinkedIn button hidden by default, show on hover using CSS
old = 'opacity:1,transition:"all 0.3s ease"'
new = 'opacity:0,transition:"all 0.3s ease"'
count = c.count(old)
print('opacity found:', count)
c = c.replace(old, new, 1)

# Add CSS for hover effect
old2 = 'onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px)";e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.15)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}'
new2 = 'onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px)";e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.15)";const b=e.currentTarget.querySelector("a");if(b)b.style.opacity="1";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";const b=e.currentTarget.querySelector("a");if(b)b.style.opacity="0";}}'
count2 = c.count(old2)
print('hover found:', count2)
c = c.replace(old2, new2, 1)

f = open('src/App.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
