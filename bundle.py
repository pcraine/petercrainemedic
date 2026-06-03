import re
import os

def bundle():
    with open('index.html', 'r') as f:
        html = f.read()

    # Inline CSS
    with open('css/style.css', 'r') as f:
        css = f.read()
    html = html.replace('<link rel="stylesheet" href="css/style.css">', f'<style>\n{css}\n</style>')

    # Inline Scripts
    scripts = [
        'js/data/common.js',
        'js/data/journal.js',
        'js/data/medications.js',
        'js/data/training.js',
        'js/data/medic.js',
        'js/main.js'
    ]

    scripts_html = ""
    for s in scripts:
        with open(s, 'r') as f:
            content = f.read()
        scripts_html += f'<script>\n{content}\n</script>\n'
        html = re.sub(fr'<script src="{s}"></script>', '', html)

    html = html.replace('</body>', f'{scripts_html}</body>')

    with open('PETER_CRAINE_EXECUTIVE_10_10.html', 'w') as f:
        f.write(html)
    print("Bundled to PETER_CRAINE_EXECUTIVE_10_10.html")

if __name__ == "__main__":
    bundle()
