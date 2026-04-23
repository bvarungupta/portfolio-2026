import os
import re

directory = 'app'

replacements = {
    r'alt="SA"': r'alt="Product Design Work"',
    r'alt="SA26"': r'alt="Varun Gupta Portfolio Logo"',
    r'alt="Varun"': r'alt="Varun Gupta at work"',
}

for root_dir, _, files in os.walk(directory):
    for filename in files:
        if filename.endswith('.tsx') or filename.endswith('.ts'):
            filepath = os.path.join(root_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            new_content = content
            for old, new in replacements.items():
                new_content = re.sub(old, new, new_content)

            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")