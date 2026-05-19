f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '      {/* TEAM */}\n      <section id="team" style={{background:"#fff",padding:"5.5rem 2rem"}}>'
new = '''      {/* VIDEO */}
      <section style={{background:"var(--navy)",padding:"5rem 2rem",textAlign:"center"}}>
        <div className="container">
          <FadeIn>
            <div className="eyebrow" style={{justifyContent:"center",marginBottom:"1rem"}}>{lang==="en"?"See Our Academy":"Découvrez Notre Académie"}</div>
            <h2 className="sec-title" style={{color:"#fff",marginBottom:"0.75rem"}}>{lang==="en"?"Experience IFA":"Vivez l\'expérience IFA"}</h2>
            <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.95rem",marginBottom:"2.5rem",maxWidth:"520px",margin:"0 auto 2.5rem"}}>{lang==="en"?"Take a look inside the International French Academy":"Découvrez l\'International French Academy de l\'intérieur"}</p>
            <div style={{maxWidth:"400px",margin:"0 auto",borderRadius:"20px",overflow:"hidden",boxShadow:"0 30px 60px rgba(0,0,0,0.4)",border:"2px solid rgba(201,168,67,0.3)"}}>
              <video controls style={{width:"100%",display:"block",background:"#000"}} poster="">
                <source src="https://res.cloudinary.com/dpwqj15y7/video/upload/ifa_kg8pbs.mp4" type="video/mp4"/>
              </video>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" style={{background:"#fff",padding:"5.5rem 2rem"}}>'''
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('src/App.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
