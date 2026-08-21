import os
import re

for root, dirs, files in os.walk('./src'):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # fetch(`http://127.0.0.1:8000/api/leaves/`) -> fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/leaves/`)
            # Note: I need to replace `http://127.0.0.1:8000
            content = content.replace("`http://127.0.0.1:8000", "`${process.env.NEXT_PUBLIC_API_URL || \"http://127.0.0.1:8000\"}")
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
print("Done")
