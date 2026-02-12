#!/bin/bash

# 1. Lister les fichiers et créer une chaîne propre
FILES=$(find . -maxdepth 3 -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.svg" -o -name "*.png" -o -name "*.json" \) \
    ! -path "./.*" \
    ! -name "generate-sw.sh" \
    | sed 's|^\.||' | sort | sed 's/^/  "/' | sed 's/$/",/')

# 2. Préparer le bloc de remplacement
NEW_CONTENT=$(printf "// BEGIN_ASSETS\nconst STATIC_ASSETS = [\n$FILES\n];\n// END_ASSETS")

# 3. Remplacement complet via Perl (plus fiable que sed sur GitHub Actions)
perl -i -0777 -pe "s/\/\/ BEGIN_ASSETS.*?\/\/ END_ASSETS/$NEW_CONTENT/s" service-worker.js

echo "✅ service-worker.js a été mis à jour avec la liste des fichiers."