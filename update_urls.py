import os
import re

for root, dirs, files in os.walk('./src'):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # fetch('http://127.0.0.1:8000/api/leaves/') -> fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/leaves/`)
            content = re.sub(
                r'fetch\(\s*[\'"]http://127\.0\.0\.1:8000([^\'"]+)[\'"]\s*(.*?)\)',
                r'fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}\1`\2)',
                content
            )
            
            # : 'http://127.0.0.1:8000/api/schedules/' -> : `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/schedules/`
            content = re.sub(
                r':\s*[\'"]http://127\.0\.0\.1:8000([^\'"]+)[\'"]',
                r': `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}\1`',
                content
            )
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
print("Done")
