import sys
import codecs

target_file = '/home/linuxpod/Downloads/bizleaderprep-main/data/questionBank.ts'
data_file = '/home/linuxpod/Downloads/bizleaderprep-main/HS_transformed.csv'

with codecs.open(target_file, 'r', 'utf-8') as f:
    text = f.read()

with codecs.open(data_file, 'r', 'utf-8') as f:
    new_hs_data = f.read().strip()

# Find where the High School data starts
start_idx = text.find('\nHigh School,')
if start_idx == -1:
    print("Could not find High School section")
    sys.exit(1)

# Find where the High School data ends (the end of the RAW_CSV string)
end_idx = text.find('\n`;', start_idx)
if end_idx == -1:
    print("Could not find end of RAW_CSV")
    sys.exit(1)

new_text = text[:start_idx] + '\n' + new_hs_data + text[end_idx:]

with codecs.open(target_file, 'w', 'utf-8') as f:
    f.write(new_text)

print("Replaced successfully")
