f = r'c:\Users\AMADILE MAJID\Wetlabs\apps\web\src\pages\PrototypePage.tsx'
with open(f, 'r', encoding='utf-8') as fh:
    c = fh.read()

# Print line 109 to see exact content
lines = c.split('\n')
print(repr(lines[108]))
