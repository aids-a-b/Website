import urllib.request
import sys

def test_admin_features():
    print("Testing Classroom Teaching Portal Admin Features...")
    
    try:
        # 1. Fetch the main HTML
        html_response = urllib.request.urlopen('http://localhost:8080/index.html')
        html_content = html_response.read().decode('utf-8')
        
        # 2. Fetch the JS logic
        js_response = urllib.request.urlopen('http://localhost:8080/assets/js/main.js')
        js_content = js_response.read().decode('utf-8')

        errors = []

        # Check HTML for Admin Login Form
        if 'id="password-form"' not in html_content:
            errors.append("Admin password form not found in HTML.")
        if 'id="passcode-input"' not in html_content:
            errors.append("Passcode input not found in HTML.")
        
        # Check JS for Admin Role Assignment Logic
        if 'sessionStorage.setItem(\'classroomUserRole\', \'admin\')' not in js_content and 'userRole = \'admin\'' not in js_content:
            errors.append("Admin role assignment logic not found in JS.")
            
        # Check JS for Add Note / Give Note feature
        if 'window.addLecture = (event, courseKey)' not in js_content:
            errors.append("addLecture function (Give Notes feature) missing in JS.")
            
        # Check JS for Rendering/Reading notes
        if 'renderCourseDetail' not in js_content:
            errors.append("renderCourseDetail function (Read Notes feature) missing in JS.")

        if errors:
            print("FAILURE: Admin features check failed!")
            for err in errors:
                print(f" - {err}")
            sys.exit(1)
        else:
            print("SUCCESS: Admin features (login, give notes, read notes) verified successfully.")
            sys.exit(0)

    except Exception as e:
        print(f"FAILURE: Could not connect to the local server. Is it running? {e}")
        sys.exit(1)

if __name__ == '__main__':
    test_admin_features()
