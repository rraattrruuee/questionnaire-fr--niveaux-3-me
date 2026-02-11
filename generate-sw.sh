#!/bin/bash

# 1. Lister les fichiers (exclure les dossiers cachés, le script lui-même et le workflow)
# On entoure chaque fichier de guillemets et on ajoute une virgule
FILES=$(find . -maxdepth 3 -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.svg" -o -name "*.png" -o -name "*.json" \) \
    ! -path "./.*" \
    ! -name "generate-assets.sh" \
    | sed 's|^\.||' | sort | sed 's/^/  "/' | sed 's/$/",/')

# 2. Créer le contenu du tableau JS
LIST_CONTENT="const STATIC_ASSETS = [\n$FILES\n];"

# 3. Remplacer le bloc dans service-worker.js
# On cherche les balises de commentaires pour savoir où injecter
sed -i '/\/\/ BEGIN_ASSETS/,/\/\/ END_ASSETS/c\/\/ BEGIN_ASSETS\n'"$LIST_CONTENT"'\n\/\/ END_ASSETS' service-worker.js

echo "✅ Liste des assets mise à jour dans service-worker.js"