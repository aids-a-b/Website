import json
import re

json_path = 'd:/2nd Semester Btech/Projects/Material Informatics/Suman datta Website/teaching_classroom_portal/assets/data/courses_data.json'
js_path = 'd:/2nd Semester Btech/Projects/Material Informatics/Suman datta Website/teaching_classroom_portal/assets/js/main.js'

syllabus_data = [
    {
        "unit": "Unit 1",
        "title": "Optimization and Linear Algebra",
        "description": "Direct methods for convex functions - sparsity inducing penalty functions- Constrained Convex Optimization problems - Krylov subspace -Conjugate gradient method - formulating problems as LP and QP - Lagrangian multiplier method-KKT conditions - support vector machines- solving by packages (CVXOPT) - Introduction to RKS - Introduction to DMD-Tensor and HoSVD- Linear algebra for AI."
    },
    {
        "unit": "Unit 2",
        "title": "PDEs and Computational Experiments",
        "description": "Introduction to PDEs - Formulation and numerical solution methods (Finite difference and Fourier) for PDEs in Physics and Engineering- Computational experiments using Matlab/Excel/Simulink."
    },
    {
        "unit": "Unit 3",
        "title": "Stochastic Processes",
        "description": "Multivariate Gaussian and weighted least squares - Markov chains - Markov decision Process"
    },
    {
        "unit": "Unit 4",
        "title": "Quantum Computing",
        "description": "Introduction to quantum computing-Bells inequality-Quantum gates"
    }
]

# 1. Update courses_data.json
try:
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    if "23mat204" in data:
        data["23mat204"]["syllabus"] = syllabus_data
        if "lectures" not in data["23mat204"]: data["23mat204"]["lectures"] = []
        if "assignments" not in data["23mat204"]: data["23mat204"]["assignments"] = []
        if "projects" not in data["23mat204"]: data["23mat204"]["projects"] = []
        
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    print("Updated courses_data.json successfully.")
except Exception as e:
    print(f"Error updating json: {e}")

# 2. Update main.js
# We'll just read main.js, find the "23mat204" object in DEFAULT_COURSES_DATA, and replace it completely or inject the arrays.
try:
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where "23mat204" starts
    idx = content.find('"23mat204": {')
    if idx != -1:
        # Find the end of the 23mat204 object
        # It's at the end of the dictionary. We can just add the keys right before the first property if we want, or just before the closing brace of 23mat204.
        
        # To be precise, let's insert after the schedule array ends.
        # Find "schedule": [ ... ]
        schedule_idx = content.find('"schedule": [', idx)
        if schedule_idx != -1:
            end_schedule = content.find(']', schedule_idx)
            
            # The next characters might be }, then closing for the course.
            # Let's find the closing brace for the 23mat204 object.
            # We can just string replace "schedule": [...] with "schedule": [...], "syllabus": [...], "lectures": [], "assignments": [], "projects": []
            
            # Using regex to find schedule array
            match = re.search(r'"schedule":\s*\[.*?\]', content[idx:], re.DOTALL)
            if match:
                schedule_str = match.group(0)
                syllabus_str = json.dumps(syllabus_data, indent=4)
                # Adjust indent
                syllabus_str = syllabus_str.replace('\n', '\n                    ')
                
                replacement = schedule_str + ',\n                    "syllabus": ' + syllabus_str + ',\n                    "lectures": [],\n                    "assignments": [],\n                    "projects": []'
                
                new_content = content[:idx] + content[idx:].replace(schedule_str, replacement, 1)
                
                with open(js_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print("Updated main.js successfully.")
except Exception as e:
    print(f"Error updating main.js: {e}")
