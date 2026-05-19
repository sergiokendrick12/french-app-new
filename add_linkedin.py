f = open('src/App.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Add linkedin to each team member
old = '{name:"KWIBUKA Erick",role:lang==="en"?"Certification Manager & Head of Pedagogy":"Responsable de la Certification & Chargé Pédagogique",photo:"staff-erick.jpeg",featured:true,pos:"center 20%"},'
new = '{name:"KWIBUKA Erick",role:lang==="en"?"Certification Manager & Head of Pedagogy":"Responsable de la Certification & Chargé Pédagogique",photo:"staff-erick.jpeg",featured:true,pos:"center 20%",linkedin:"https://linkedin.com/in/kwibuka-ruhingana-erick-6b08952a8/"},'
c = c.replace(old, new, 1)

old2 = '{name:"Banda Clément",role:lang==="en"?"Lead Teacher & Sound Technician":"Professeur Titulaire & Technicien de son",photo:"staff-banda.jpeg",featured:false},'
new2 = '{name:"Banda Clément",role:lang==="en"?"Lead Teacher & Sound Technician":"Professeur Titulaire & Technicien de son",photo:"staff-banda.jpeg",featured:false,linkedin:"https://www.linkedin.com/in/clement-banda-53b3b561/"},'
c = c.replace(old2, new2, 1)

old3 = '{name:"Ingabire Germaine",role:lang==="en"?"Secretary General & Communications":"Secrétaire Générale & Chargée de la communication",photo:"staff-germaine.jpeg",featured:false},'
new3 = '{name:"Ingabire Germaine",role:lang==="en"?"Secretary General & Communications":"Secrétaire Générale & Chargée de la communication",photo:"staff-germaine.jpeg",featured:false,linkedin:"https://www.linkedin.com/in/germaine-ingabire-39bb5340b/"},'
c = c.replace(old3, new3, 1)

old4 = '{name:"Kabandana Ghislaine",role:lang==="en"?"Reception & Media Library Assistant":"Chargée d\'Accueil & Assistante médiathèque",photo:"staff-ghislaine.jpeg",featured:false},'
new4 = '{name:"Kabandana Ghislaine",role:lang==="en"?"Reception & Media Library Assistant":"Chargée d\'Accueil & Assistante médiathèque",photo:"staff-ghislaine.jpeg",featured:false,linkedin:"https://www.linkedin.com/in/gyslaine-kabandana-803010273/"},'
c = c.replace(old4, new4, 1)

old5 = '{name:"Joas Irahoza",role:lang==="en"?"Multi-skilled Agent":"Agent polyvalent",photo:"staff-joas.jpeg",featured:false},'
new5 = '{name:"Joas Irahoza",role:lang==="en"?"Multi-skilled Agent":"Agent polyvalent",photo:"staff-joas.jpeg",featured:false,linkedin:"https://www.linkedin.com/in/joas-irahoza-464589339/"},'
c = c.replace(old5, new5, 1)

old6 = '{name:"Serges Ndinda",role:lang==="en"?"Software Engineer":"Ingénieur Logiciel",photo:"staff-serges.jpeg",featured:false},'
new6 = '{name:"Serges Ndinda",role:lang==="en"?"Software Engineer":"Ingénieur Logiciel",photo:"staff-serges.jpeg",featured:false,linkedin:"https://www.linkedin.com/in/serges-ndinda/"},'
c = c.replace(old6, new6, 1)

print("LinkedIn added!")

# Now update the card rendering to add hover animation with LinkedIn button
old7 = '<div style={{background:m.featured?"var(--navy)":"var(--cream)",borderRadius:"16px",overflow:"hidden",border:m.featured?"2px solid var(--gold)":"1px solid var(--cream-dark)",transition:"all 0.3s",textAlign:"center"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>'
new7 = '''<div style={{background:m.featured?"var(--navy)":"var(--cream)",borderRadius:"16px",overflow:"hidden",border:m.featured?"2px solid var(--gold)":"1px solid var(--cream-dark)",transition:"all 0.3s",textAlign:"center",position:"relative"}}
  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px)";e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.2)";const btn=e.currentTarget.querySelector(".linkedin-btn");if(btn)btn.style.opacity="1";}}
  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";const btn=e.currentTarget.querySelector(".linkedin-btn");if(btn)btn.style.opacity="0";}}>'''
count7 = c.count(old7)
print("card found:", count7)
c = c.replace(old7, new7, 1)

f = open('src/App.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
