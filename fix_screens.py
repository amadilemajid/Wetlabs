import re

f = r'c:\Users\AMADILE MAJID\Wetlabs\apps\web\src\pages\PrototypePage.tsx'
with open(f, 'r', encoding='utf-8') as fh:
    c = fh.read()

S = "style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}"

replacements = [
    ('className="phone-screen bg-[#0f0f0f]"',                                    f'className="bg-[#0f0f0f]" {S}'),
    ('className="phone-screen bg-[#f5f5f0]"',                                    f'className="bg-[#f5f5f0]" {S}'),
    ('className="phone-screen items-center justify-center bg-[#0f0f0f] gap-4"',  f'className="flex items-center justify-center bg-[#0f0f0f] gap-4" {S}'),
    ('className="phone-screen items-center justify-center bg-[#f5f5f0] gap-4"',  f'className="flex items-center justify-center bg-[#f5f5f0] gap-4" {S}'),
    # locked screen still has old inline style - fix it too
    ("style={{width:'100%',height:'460px',display:'flex',flexDirection:'column',overflow:'hidden',background:'linear-gradient(to bottom, #064e3b, #000000)'}}",
     f'className="bg-gradient-to-b from-emerald-900 to-black" {S}'),
]

for old, new in replacements:
    c = c.replace(old, new)

with open(f, 'w', encoding='utf-8') as fh:
    fh.write(c)

print("Done")
# verify
import re
matches = re.findall(r'phone-screen|minHeight', c)
print(f"phone-screen remaining: {matches.count('phone-screen')}, minHeight count: {matches.count('minHeight')}")
