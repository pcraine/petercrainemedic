import re
import os

def get_var(content, varname):
    # Flexible match for var NAME = ...; or NAME = ...;
    # It handles cases with/without 'var', and optional spaces.
    pattern = fr'(?:var\s+)?{varname}\s*=\s*'
    match = re.search(pattern, content)
    if not match:
        return None

    start = match.end()
    stack = []
    end = -1
    in_str = False
    q = ''

    for i in range(start, len(content)):
        c = content[i]
        if not in_str:
            if c in '"\'`':
                in_str = True
                q = c
            elif c in '[{':
                stack.append(c)
            elif c == ']' and stack and stack[-1] == '[':
                stack.pop()
            elif c == '}' and stack and stack[-1] == '{':
                stack.pop()
            elif c == ';' and not stack:
                end = i
                break
        else:
            if c == q and (i == 0 or content[i-1] != '\\'):
                in_str = False

    if end != -1:
        return content[start:end].strip()
    return None

def main():
    if not os.path.exists('index.html'):
        return

    with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    os.makedirs('css', exist_ok=True)
    os.makedirs('js/data', exist_ok=True)

    # 1. CSS
    m = re.search(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
    if m:
        css = m.group(1).strip()
        with open('css/style.css', 'w', encoding='utf-8') as f:
            f.write(css)

    # 2. Extract Data
    data_vars = ['JOURNAL_POSTS', 'MEDS', 'TR_CORE', 'TR_SPEC', 'TR_ADD', 'TR_WA', 'TR_EM',
                 'EM_STAFF', 'EM_EQ', 'EM_PKGS', 'EM_WELFARE', 'EM_OPS', 'EM_HMAP', 'EM_BMAP', 'EM_WA', 'EM_MAIL',
                 'GATED_CODES', 'RHYTHM_NAMES', 'DEPLOYMENTS', 'TICKER_MESSAGES']

    found_vars = {}
    for v in data_vars:
        val = get_var(content, v)
        if val:
            # Basic sanitization for common problematic characters
            val = val.replace('\u2019', "'").replace('\u2026', '...').replace('\u2014', '--').replace('\u00b7', '.')
            found_vars[v] = val

    data_files = {
        'journal.js': ['JOURNAL_POSTS'],
        'medications.js': ['MEDS'],
        'training.js': ['TR_WA', 'TR_EM', 'TR_CORE', 'TR_SPEC', 'TR_ADD'],
        'medic.js': ['EM_WA', 'EM_MAIL', 'EM_STAFF', 'EM_EQ', 'EM_PKGS', 'EM_WELFARE', 'EM_OPS', 'EM_HMAP', 'EM_BMAP'],
        'common.js': ['GATED_CODES', 'RHYTHM_NAMES', 'DEPLOYMENTS', 'TICKER_MESSAGES']
    }

    for fname, vars in data_files.items():
        with open(f'js/data/{fname}', 'w', encoding='utf-8') as f:
            for v in vars:
                if v in found_vars:
                    f.write(f'window.{v} = {found_vars[v]};\n\n')

    # 3. Helpers
    h_names = ['jP', 'jH', 'jLine', 'jAnon', 'jPull']
    helpers_code = ""
    for h in h_names:
        m = re.search(fr'function\s+{h}\s*\(.*?\)\s*{{.*?}}', content, re.DOTALL)
        if m:
            code = re.sub(r'^function\s+([a-zA-Z0-9_]+)', r'window.\1 = function', m.group(0))
            helpers_code += code + ';\n'
    with open('js/data/common.js', 'a', encoding='utf-8') as f:
        f.write('\n// Helpers\n' + helpers_code)

    # 4. Main Logic
    scripts = re.findall(r'<script(?![^>]*application/ld\+json)[^>]*>(.*?)</script>', content, re.DOTALL)
    logic_blocks = []

    for s in scripts:
        s = s.strip()
        if not s or 'src=' in s: continue

        # Determine if this script is just data or logic
        # We'll remove all data var assignments from the logic blocks
        original_s = s
        for v in data_vars:
            # This regex is a bit more aggressive to catch the whole assignment
            # It looks for the start of the assignment and then tries to find the ending semicolon
            pattern = fr'(?:var\s+)?{v}\s*=\s*'
            mv = re.search(pattern, s)
            if mv:
                # Find the end of this specific assignment
                start_idx = mv.start()
                stack = []
                end_idx = -1
                in_str = False
                for i in range(mv.end(), len(s)):
                    char = s[i]
                    if not in_str:
                        if char in '"\'`': in_str = True
                        elif char in '[{': stack.append(char)
                        elif char == ']' and stack and stack[-1] == '[': stack.pop()
                        elif char == '}' and stack and stack[-1] == '{': stack.pop()
                        elif char == ';' and not stack:
                            end_idx = i
                            break
                    else:
                        if char in '"\'`' and (i==0 or s[i-1] != '\\'): in_str = False
                if end_idx != -1:
                    s = s[:start_idx] + s[end_idx+1:]

        # Remove helpers too
        for h in h_names:
            s = re.sub(fr'function\s+{h}\s*\(.*?\)\s*{{.*?}}', '', s, flags=re.DOTALL)

        s = s.strip()
        if s:
            # Prefix functions and modernize
            s = re.sub(r'(^|\n)function\s+([a-zA-Z0-9_]+)', r'\1window.\2 = function', s)
            s = s.replace('var ', 'let ')
            # Clean up potential leading/trailing commas/semicolons
            s = re.sub(r'^\s*[,;]\s*', '', s)
            s = re.sub(r'[,;]\s*$', '', s)
            logic_blocks.append(s)

    combined = "\n\n;\n\n".join(logic_blocks)
    combined = combined.replace("document.querySelector('.hero-role-type')", "document.querySelector('.tw-text')")
    combined = combined.replace('window.initTypewriter = function() {', 'window.initTypewriter = function() {\n  if (window._twTimeout) clearTimeout(window._twTimeout);')
    combined = re.sub(r'setTimeout\(type,\s*(\d+)\)', r'window._twTimeout = setTimeout(type, \1)', combined)
    combined = combined.replace('\u2019', "'").replace('\u2026', '...').replace('\u2014', '--').replace('\u00b7', '.')

    combined += r"""
;window.hideTicker = function() {
    const ticker = document.getElementById('ticker');
    if (ticker) ticker.classList.add('hidden');
};

document.addEventListener('click', function(e) {
    const target = e.target.closest('[data-click]');
    if (!target) return;
    const action = target.getAttribute('data-click');
    const value = target.getAttribute('data-value');
    if (typeof window[action] === 'function') {
        if (value && value.includes(',')) {
            const args = value.split(',');
            if (args[1] === 'this') { window[action](args[0], target); }
            else { window[action](...args); }
        } else { window[action](value, target); }
        e.preventDefault();
    }
});
"""
    with open('js/main.js', 'w', encoding='utf-8') as f:
        f.write(combined)

    # 5. Update index.html
    new_html = re.sub(r'<style[^>]*>.*?</style>', '<link rel="stylesheet" href="css/style.css">', content, flags=re.DOTALL)
    new_html = re.sub(r'<script(?![^>]*application/ld\+json)[^>]*>.*?</script>', '', new_html, flags=re.DOTALL)
    scripts_tag = '\n<script src="js/data/common.js"></script>\n<script src="js/data/journal.js"></script>\n<script src="js/data/medications.js"></script>\n<script src="js/data/training.js"></script>\n<script src="js/data/medic.js"></script>\n<script src="js/main.js"></script>\n'
    new_html = new_html.replace('</body>', scripts_tag + '</body>')

    pattern = r'onclick="([a-zA-Z0-9_]+)\((.*?)\)(?:;return false)?"'
    def replacer(match):
        func, args = match.group(1), match.group(2).strip()
        if args:
            clean_arg = args.replace("'", "").replace('"', "")
            return f'data-click="{func}" data-value="{clean_arg}"'
        return f'data-click="{func}"'
    new_html = re.sub(pattern, replacer, new_html)
    new_html = re.sub(r'onclick="document\.getElementById\(\'ticker\'\)\.classList\.add\(\'hidden\'\)"', 'data-click="hideTicker"', new_html)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)

if __name__ == "__main__":
    main()
