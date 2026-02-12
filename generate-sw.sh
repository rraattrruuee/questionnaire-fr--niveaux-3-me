#!/bin/bash

# 1. Lister les fichiers et créer une chaîne propre
FILES=$(find . -maxdepth 3 -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.svg" -o -name "*.png" -o -name "*.json" \) \
    ! -path "./.*" \
    ! -name "generate-sw.sh" \
    | sed 's|^\.||' | sort | sed 's/^/  "/' | sed 's/$/"/' | paste -sd "," - | sed 's/,/,\n/g')

# 2. Préparer le contenu
LIST_CONTENT="const STATIC_ASSETS = [\n$FILES\n];"

# 3. Injecter dans le fichier
# On utilise un fichier temporaire pour éviter les erreurs de lecture/écriture simultanées
sed "/\/\/ BEGIN_ASSETS/,/\/\/ END_ASSETS/c\/\/ BEGIN_ASSETS\n$LIST_CONTENT\n\/\/ END_ASSETS" service-worker.js > service-worker.js.tmp && mv service-worker.js.tmp service-worker.js

echo "✅ service-worker.js mis à jour avec les nouveaux fichiers."