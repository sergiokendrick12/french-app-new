f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '                    <p style={{fontSize:"0.78rem",color:m.featured?"rgba(255,255,255,0.6)":"var(--text-light)",lineHeight:1.5}}>{m.role}</p>\n                  </div>\n                </div>'
new = '                    <p style={{fontSize:"0.78rem",color:m.featured?"rgba(255,255,255,0.6)":"var(--text-light)",lineHeight:1.5}}>{m.role}</p>\n                    {m.linkedin&&<div style={{padding:"0.5rem 0 1rem"}}><a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-btn" style={{display:"inline-flex",alignItems:"center",gap:"6px",background:"#0077b5",color:"#fff",padding:"6px 14px",borderRadius:"20px",fontSize:"0.75rem",fontWeight:600,textDecoration:"none",opacity:0,transform:"translateY(10px)",transition:"all 0.3s ease"}}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.736 1.75-1.736 1.75.79 1.75 1.764-.783 1.736-1.75 1.736zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>LinkedIn</a></div>}\n                  </div>\n                </div>'
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('src/App.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
