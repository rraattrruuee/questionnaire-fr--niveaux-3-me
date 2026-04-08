const fs = require('fs');
const path = require('path');

const IGNORE = [
    'index.html',
    'offline.html',
    'QuizMaster_Dynamique_:_Générateur_&_Importateur_de_Questionnaires.html'
];

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'capture' && file !== '.git') {
                walkDir(fullPath);
            }
        } else if (fullPath.endsWith('.html') && !IGNORE.includes(path.basename(fullPath))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Remove previous injected script
            const scriptStart = content.indexOf('<!-- BOUTON RETOUR PWA -->');
            if (scriptStart !== -1) {
                const endTag = '</body>';
                let before = content.substring(0, scriptStart);
                content = before + '\n</body>' + content.substring(content.indexOf('</body>') + 7);
            }
            
            // Calculate relative path to root index.html
            // fullPath is relative to root, e.g. "math/quiz.html" or "quiz.html"
            const dirOfFile = path.dirname(fullPath); // "math" or "."
            let relPath = path.relative(dirOfFile, '.'); // ".." or ""
            relPath = relPath ? relPath + '/index.html' : './index.html';
            
            const BACK_BTN_SCRIPT = `
    <!-- BOUTON RETOUR PWA -->
    <script>
      (function() {
        const checkAndAddButton = () => {
          const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                        window.matchMedia('(display-mode: fullscreen)').matches || 
                        navigator.standalone;
          
          if (isPWA && !window.location.pathname.endsWith('index.html')) {
            const btn = document.createElement('button');
            btn.innerHTML = '← Retour';
            btn.style.position = 'fixed';
            btn.style.top = '15px';
            btn.style.left = '15px';
            btn.style.zIndex = '9999';
            btn.style.background = '#4CAF50';
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.padding = '10px 20px';
            btn.style.borderRadius = '8px';
            btn.style.cursor = 'pointer';
            btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
            btn.style.fontWeight = 'bold';
            btn.style.fontFamily = 'Arial, sans-serif';
            btn.style.fontSize = '16px';
            btn.style.transition = 'background 0.3s, transform 0.3s';
            
            btn.onmouseover = () => {
                btn.style.background = '#45a049';
                btn.style.transform = 'scale(1.05)';
            };
            btn.onmouseout = () => {
                btn.style.background = '#4CAF50';
                btn.style.transform = 'scale(1)';
            };
            
            btn.onclick = () => {
               window.location.href = '${relPath}';
            };
            
            document.body.appendChild(btn);
          }
        };

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', checkAndAddButton);
        } else {
          checkAndAddButton();
        }
      })();
    </script>
</body>`;
            
            content = content.replace('</body>', BACK_BTN_SCRIPT);
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log('Fixed injection for ' + fullPath + ' with path ' + relPath);
        }
    });
}

walkDir('.');
