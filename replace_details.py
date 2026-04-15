import os
import re

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        return

    original_content = content

    # Replace Email
    content = content.replace('satishdezn@gmail.com', 'bvarungupta@gmail.com')
    
    # Replace Domain Links
    content = content.replace('satishhebbal.design', 'bvarungupta.com')
    content = content.replace('satishhebbal.com', 'bvarungupta.com')
    
    # Replace Social Links
    content = content.replace('https://www.linkedin.com/in/satish-hebbal/', 'https://linkedin.com/in/bvarungupta')
    content = content.replace('https://www.behance.net/satish-designs', 'https://behance.net/bvarungupta')
    content = content.replace('https://dribbble.com/Satish-Hebbal', 'https://dribbble.com/bvarungupta')

    # Names (Full)
    content = content.replace('Satish Hebbal', 'Varun Gupta')
    content = content.replace('SATISH HEBBAL', 'VARUN GUPTA')
    
    # Names (First) - carefully excluding font names
    # We want to replace " Satish " or "Satish" etc, but preserve "SatishSans"
    
    # This regex looks for 'Satish' not followed by 'Sans' or 'CapsSans' and not part of file path
    # and not part of font names. Wait, let's just use negative lookaheads.
    # We don't want to replace SatishSans, SatishCapsSans, satish-font, satish-caps-sans, satish.
    # What about images? "/images/HomeImages/Satish-about.png" -> don't rename images unless they are also literally renamed.
    # The prompt actually says don't worry about internal font names or image paths.
    
    # Let's replace only text Content. But sometimes it's literally alt="Satish".
    # Alt text is fine to replace.
    
    # Let's do a strict negative lookahead:
    # Not followed by Sans, -logo, -about, -image
    pattern = re.compile(r'Satish(?!(Sans|-|0profile|\.))')
    content = pattern.sub('Varun', content)

    # Let's also do "satish" for lowercase, same logic
    pattern_lower = re.compile(r'satish(?!(dezn|-font|-caps|-logo|-image|\.|hebbal))')
    content = pattern_lower.sub('varun', content)

    # Specific Hero Text Replacements
    # In page.tsx and galleries there's the spans with first letter separated
    # <span style={{ fontFamily: 'SatishCapsSans, sans-serif', fontSize: '1.5em' }}>S</span><span style={{ fontFamily: 'SatishSans, sans-serif', marginLeft: '4px' }}>atish </span>
    content = content.replace('>S</span><span style={{ fontFamily: \'SatishSans, sans-serif\', marginLeft: \'4px\' }}>atish', '>V</span><span style={{ fontFamily: \'SatishSans, sans-serif\', marginLeft: \'4px\' }}>arun')
    content = content.replace('>S</span><span style={{ fontFamily: \'SatishSans, sans-serif\' }}>atish', '>V</span><span style={{ fontFamily: \'SatishSans, sans-serif\' }}>arun')
    
    content = content.replace('>H</span><span style={{ fontFamily: \'SatishSans, sans-serif\', marginLeft: \'4px\' }}>ebbal', '>G</span><span style={{ fontFamily: \'SatishSans, sans-serif\', marginLeft: \'4px\' }}>upta')
    content = content.replace('>H</span><span style={{ fontFamily: \'SatishSans, sans-serif\' }}>ebbal', '>G</span><span style={{ fontFamily: \'SatishSans, sans-serif\' }}>upta')

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('app'):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css', '.md', '.json', '.html')):
            process_file(os.path.join(root, file))

