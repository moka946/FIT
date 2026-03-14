import urllib.request, json, sys

run_id = '23098145725'
url = f'https://api.github.com/repos/moka946/FIT/actions/runs/{run_id}/jobs'

try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
        for job in data.get('jobs', []):
            if job['conclusion'] == 'failure':
                print(f"Job failed: {job['name']}")
                for step in job.get('steps', []):
                    if step['conclusion'] == 'failure':
                        print(f"Step failed: {step['name']}")
                
                # We can't easily get the raw logs without auth if it's zipped or requires API, but wait! Public repos allow fetching logs.
                log_url = f"https://api.github.com/repos/moka946/FIT/actions/jobs/{job['id']}/logs"
                try:
                    log_req = urllib.request.Request(log_url)
                    with urllib.request.urlopen(log_req) as log_resp:
                        logs = log_resp.read().decode('utf-8')
                        print("\n--- ERROR LOG ---")
                        # print last 50 lines
                        print('\n'.join(logs.split('\n')[-50:]))
                except Exception as e:
                    print(f"Could not fetch logs directly: {e}")
                    
except Exception as e:
    print(f"Error: {e}")
