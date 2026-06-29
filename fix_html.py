import re

html_path = 'd:/2nd Semester Btech/Projects/Material Informatics/Suman datta Website/teaching_classroom_portal/index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix arrow text
content = content.replace('<div class="course-card-arrow">➔</div>', '<span>Access Unit Notes & Timetable &rarr;</span>')

# 2. Fix GitHub links
content = content.replace('https://github.com/sd3ph/sd3ph.github.io', 'https://github.com/aids-a-b/Website')
content = content.replace('value="sd3ph/sd3ph.github.io"', 'value="aids-a-b/Website"')
content = content.replace('https://github.com/Dr-Suman-Dutta/Suman-Dutta-Research-Group.git', 'https://github.com/aids-a-b/Website.git')

# 3. Shorten the timetable for 23mat204
start_204 = content.find('id="course-23mat204"')
end_204 = content.find('<!-- END CLASSROOM SECTION -->', start_204)
if end_204 == -1:
    end_204 = len(content)

table_chunk = content[start_204:end_204]

# Remove the empty rows
table_chunk = re.sub(r'<tr>\s*<td>08:00 - 08:50</td>\s*<td></td><td></td><td></td><td></td><td></td>\s*</tr>', '', table_chunk)
table_chunk = re.sub(r'<tr>\s*<td>10:45 - 11:35</td>\s*<td></td><td></td><td></td><td></td><td></td>\s*</tr>', '', table_chunk)
table_chunk = re.sub(r'<tr>\s*<td>01:15 - 02:05</td>\s*<td></td><td></td><td></td><td></td><td></td>\s*</tr>', '', table_chunk)
table_chunk = re.sub(r'<tr>\s*<td>04:35 - 06:15</td>\s*<td></td><td></td><td></td><td></td><td></td>\s*</tr>', '', table_chunk)

content = content[:start_204] + table_chunk + content[end_204:]

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Edits applied successfully.')
