import re

html_path = 'd:/2nd Semester Btech/Projects/Material Informatics/Suman datta Website/teaching_classroom_portal/index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add course info section in teaching block
teaching_info = """
                        <div class="course-info-section">
                            <h3>Mathematics for Intelligent Systems 3</h3>
                            <p class="course-card-meta">23MAT204 · Fall 2025 · BTech AID</p>
                            <p class="course-card-desc">Advanced intelligent systems modeling and applied mathematics.</p>
                        </div>
"""
# find the end of the course-info-grid
if '23MAT204' not in content:
    idx = content.find('<div class="course-info-section">', content.find('23CHY115'))
    if idx == -1:
        # fallback, find closing div of course-info-grid
        idx = content.find('</div>', content.find('23CHY115')) + 6
        content = content[:idx] + teaching_info + content[idx:]
    else:
        # we found another one? no, there's only 2.
        idx = content.find('</div>', content.find('23CHY115')) + 6
        content = content[:idx] + teaching_info + content[idx:]

# 2. Add course card in classroom grid
course_card = """
                        <div class="course-card" onclick="openCourse('course-23mat204')">
                            <div>
                                <h3>Mathematics for Intelligent Systems 3</h3>
                                <p class="course-card-meta">Code: 23MAT204 · Credits: 4</p>
                                <p>Advanced intelligent systems modeling and applied mathematics.</p>
                            </div>
                            <div class="course-card-arrow">➔</div>
                        </div>
"""
if "openCourse('course-23mat204')" not in content:
    idx_grid = content.find('<div class="course-card" onclick="openCourse(\'course-23chy115\')">')
    idx_grid_end = content.find('</div>', content.find('</div>', content.find('</div>', idx_grid)+1)+1)+6
    content = content[:idx_grid_end] + course_card + content[idx_grid_end:]

# 3. Add course detail view
schedule_tbody = """
                                            <tbody>
                                                <tr>
                                                    <td>08:00 - 08:50</td>
                                                    <td></td><td></td><td></td><td></td><td></td>
                                                </tr>
                                                <tr>
                                                    <td>08:50 - 09:40</td>
                                                    <td><span class="sec-badge sec-a-badge">Section A</span></td><td></td><td></td><td></td><td></td>
                                                </tr>
                                                <tr>
                                                    <td>09:40 - 10:30</td>
                                                    <td></td><td></td><td><span class="sec-badge sec-b-badge">Section B</span></td><td></td><td><span class="sec-badge sec-a-badge">Section A</span></td>
                                                </tr>
                                                <tr class="break-row">
                                                    <td>10:30 - 10:45</td>
                                                    <td colspan="5" class="break-cell">Break</td>
                                                </tr>
                                                <tr>
                                                    <td>10:45 - 11:35</td>
                                                    <td></td><td></td><td></td><td></td><td></td>
                                                </tr>
                                                <tr>
                                                    <td>11:35 - 12:25</td>
                                                    <td></td><td></td><td></td><td></td><td><span class="sec-badge sec-b-badge">Section B</span></td>
                                                </tr>
                                                <tr class="break-row">
                                                    <td>12:25 - 01:15</td>
                                                    <td colspan="5" class="break-cell">Lunch Break</td>
                                                </tr>
                                                <tr>
                                                    <td>01:15 - 02:05</td>
                                                    <td></td><td></td><td></td><td></td><td></td>
                                                </tr>
                                                <tr>
                                                    <td>02:05 - 02:55</td>
                                                    <td><span class="sec-badge sec-b-badge">Section B</span></td><td></td><td></td><td></td><td></td>
                                                </tr>
                                                <tr>
                                                    <td>02:55 - 03:45</td>
                                                    <td><span class="sec-badge sec-b-badge">Section B</span></td><td><span class="sec-badge sec-a-badge">Section A</span></td><td></td><td></td><td></td>
                                                </tr>
                                                <tr>
                                                    <td>03:45 - 04:35</td>
                                                    <td></td><td><span class="sec-badge sec-a-badge">Section A</span></td><td></td><td></td><td></td>
                                                </tr>
                                                <tr>
                                                    <td>04:35 - 06:15</td>
                                                    <td></td><td></td><td></td><td></td><td></td>
                                                </tr>
                                            </tbody>
"""

if 'id="course-23mat204"' not in content:
    # Copy course-23mat106 to use as a template
    start_106 = content.find('<div id="course-23mat106" class="course-detail-view hidden">')
    end_106 = content.find('<div id="course-23chy115" class="course-detail-view hidden">')
    template = content[start_106:end_106]
    
    # Replace IDs and texts
    template = template.replace('course-23mat106', 'course-23mat204')
    template = template.replace('announcements-23mat106', 'announcements-23mat204')
    template = template.replace('syllabus-23mat106', 'syllabus-23mat204')
    template = template.replace('notes-23mat106', 'notes-23mat204')
    template = template.replace('assignments-23mat106', 'assignments-23mat204')
    template = template.replace('projects-23mat106', 'projects-23mat204')
    template = template.replace('23MAT106', '23MAT204')
    template = template.replace('Mathematics for Intelligent Systems', 'Mathematics for Intelligent Systems 3')
    
    # Replace schedule table tbody
    tbody_start = template.find('<tbody>')
    tbody_end = template.find('</tbody>') + 8
    template = template[:tbody_start] + schedule_tbody.strip() + template[tbody_end:]
    
    # Append after 23chy115
    end_chy = content.find('</section>', end_106) # Find end of classroom section
    # Actually wait, there is a final closing div for course-23chy115
    # Since we know course-23chy115 ends where </section> begins, minus some divs.
    # We can just insert right before </section> <!-- END CLASSROOM SECTION -->
    idx_section_end = content.find('<!-- ==================== 5. FOOTER ==================== -->')
    idx_insert = content.rfind('</section>', 0, idx_section_end)
    
    content = content[:idx_insert] + '\n' + template + '\n' + content[idx_insert:]

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML injection complete.")
