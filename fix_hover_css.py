f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Remove complex hover handlers completely
old = 'onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px)";e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.15)";const b=e.currentTarget.querySelector("a");if(b)b.style.opacity="1";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";const b=e.currentTarget.querySelector("a");if(b)b.style.opacity="0";}}'
new = 'className="team-card"'
count = c.count(old)
print('hover found:', count)
c = c.replace(old, new, 1)

# Add CSS for team card hover
old2 = "body{background:var(--bg);color:var(--text);min-height:100vh;}"
if old2 not in c:
    # Find another CSS insertion point
    idx = c.find("*{font-family:")
    print("css at:", idx)
    print(repr(c[idx:idx+100]))
else:
    print('body css found')

f = open('src/App.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
