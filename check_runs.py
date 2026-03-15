import urllib.request, json
data = json.loads(urllib.request.urlopen("https://api.github.com/repos/moka946/FIT/actions/runs").read())
runs = data.get("workflow_runs", [])[:5]
for r in runs:
    print(f"{r['name']}: {r['status']} ({r['conclusion']})")
