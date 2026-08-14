import os
import urllib.request
import json

icons = [
  {"name": "HTML5", "url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"},
  {"name": "CSS3", "url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"},
  {"name": "JavaScript", "url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"},
  {"name": "TypeScript", "url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"},
  {"name": "Python", "url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"},
  {"name": "Flutter", "url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg"},
  {"name": "Dart", "url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg"},
  {"name": "SQLite", "url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg"},
  {"name": "Git", "url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"},
  {"name": "GitHub", "url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"},
  {"name": "React", "url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"},
  {"name": "Tailwind CSS", "url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"},
  {"name": "VS Code", "url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"},
  {"name": "Figma", "url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg"}
]

out_dir = r"c:\Users\Dagim\Desktop\portfolio\My_portfolio\public\icons"
os.makedirs(out_dir, exist_ok=True)

for item in icons:
    filename = item["url"].split('/')[-1]
    out_path = os.path.join(out_dir, filename)
    print(f"Downloading {filename}...")
    try:
        urllib.request.urlretrieve(item["url"], out_path)
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
