f = r'c:\Users\AMADILE MAJID\Wetlabs\apps\web\src\pages\PrototypePage.tsx'
with open(f, 'r', encoding='utf-8') as fh:
    c = fh.read()

S = "style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}"

# Fix all broken patterns (missing quotes around className value)
import re
# Pattern: className=SOMETHING style={{...}}"  ->  className="SOMETHING" style={{...}}
def fix(m):
    cls = m.group(1).strip()
    return f'className="{cls}" {S}'

c = re.sub(r'className=([^"{\n]+?) ' + re.escape(S) + r'"', fix, c)

with open(f, 'w', encoding='utf-8') as fh:
    fh.write(c)

# Verify
lines = c.split('\n')
for i, l in enumerate(lines):
    if 'className=' in l and '"' not in l.split('className=')[1][:5]:
        print(f"Still broken line {i+1}: {l[:80]}")
print("Done - checking for remaining issues...")
broken = [i+1 for i,l in enumerate(lines) if re.search(r'className=[^"\s{]', l)]
print(f"Broken classNames on lines: {broken}")
