import re

f = r'c:\Users\AMADILE MAJID\Wetlabs\apps\web\src\pages\PrototypePage.tsx'
with open(f, 'r', encoding='utf-8') as fh:
    c = fh.read()

S = " style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}"

# Fix broken className= (missing quotes) then add style
c = c.replace('className=bg-[#0f0f0f]' + S[1:], 'className="bg-[#0f0f0f]"' + S)
c = c.replace('className=bg-[#f5f5f0]' + S[1:], 'className="bg-[#f5f5f0]"' + S)
c = c.replace('className=flex items-center justify-center bg-[#0f0f0f] gap-4' + S[1:], 'className="flex items-center justify-center bg-[#0f0f0f] gap-4"' + S)
c = c.replace('className=flex items-center justify-center bg-[#f5f5f0] gap-4' + S[1:], 'className="flex items-center justify-center bg-[#f5f5f0] gap-4"' + S)
c = c.replace('className=bg-gradient-to-b from-emerald-900 to-black' + S[1:], 'className="bg-gradient-to-b from-emerald-900 to-black"' + S)

with open(f, 'w', encoding='utf-8') as fh:
    fh.write(c)
print("Done")
