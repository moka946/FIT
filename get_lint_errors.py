import subprocess
import json
import os
import sys

# Set stdout to UTF-8 to avoid encoding issues
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def get_lint_errors():
    try:
        # Use shell=True for Windows to find npx
        result = subprocess.run('npx eslint . --quiet --format json', shell=True, capture_output=True, text=True, encoding='utf-8')
        if not result.stdout:
            print("No output from eslint")
            print("Stderr:", result.stderr)
            return
            
        data = json.loads(result.stdout)
        for entry in data:
            if entry.get('errorCount', 0) > 0:
                print(f"\nFile: {entry['filePath']}")
                for msg in entry['messages']:
                    if msg.get('severity') == 2:
                        print(f"  Line {msg['line']}:{msg['column']} - {msg['message']} ({msg.get('ruleId')})")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_lint_errors()
