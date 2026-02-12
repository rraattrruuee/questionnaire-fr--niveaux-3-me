#!/bin/bash

# 1. Lister les fichiers proprement (gestion des espaces et caractères spéciaux)
FILES=$(find . -maxdepth 3 -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.svg" -o -name "*.png" -o -name "*.json" \) \
    ! -path "./.*" \
    ! -name "generate-sw.sh" \
    | sed 's|^\.||' | sort | sed 's/^/  "/' | sed 's/$/",/')

# 2. Créer le nouveau contenu du service worker
# On lit le fichier jusqu'à BEGIN, on ajoute les fichiers, puis on lit après END
awk -v files="$FILES" '
  /\/\/ BEGIN_ASSETS/ { print "// BEGIN_ASSETS"; print "const STATIC_ASSETS = ["; print files; print "];"; skip=1; next }
  /\/\/ END_ASSETS/ { print "// END_ASSETS"; skip=0; next }
  !skip { print }
' service-worker.js > service-worker.js.tmp && mv service-worker.js.tmp service-worker.js

echo "✅ service-worker.js mis à jour."