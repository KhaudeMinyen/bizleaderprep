
import csv
import io

source_file = '/home/linuxpod/Downloads/FBLA_HS_Competitive_Events_Shuffled(1).csv'

# Mappings for event names to match Dashboard.tsx
event_mapping = {
    'Business Communications': 'Business Communication'
}

output_lines = []

with open(source_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        event = row['Event'].strip()
        # Remap event name if needed
        if event in event_mapping:
            event = event_mapping[event]
            
        question = row['Question'].strip()
        opt_a = row['Option A'].strip()
        opt_b = row['Option B'].strip()
        opt_c = row['Option C'].strip()
        opt_d = row['Option D'].strip()
        correct = row['Correct Answer'].strip()
        
        # Format: Event Level,Category,Question,Answer A,Answer B,Answer C,Answer D,Correct
        # We need to manually quote strings to match the existing format's style, 
        # although standard CSV writers handle this, the existing file uses explicit quotes for text fields.
        
        # Helper to escape quotes
        def q(s):
            return '"' + s.replace('"', '""') + '"'
            
        line = f"High School,{event},{q(question)},{q(opt_a)},{q(opt_b)},{q(opt_c)},{q(opt_d)},{correct}"
        output_lines.append(line)

# Print all lines to stdout
print('\n'.join(output_lines))
