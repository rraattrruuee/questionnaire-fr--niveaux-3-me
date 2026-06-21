# 🎓 Portail de Questionnaires Interactifs (Niveau 3ème)

[![PWA Status](https://img.shields.io/badge/PWA-Ready-blue.svg)](https://rraattrruuee.github.io/questionnaire-fr--niveaux-3-me/)
[![Platform](https://img.shields.io/badge/Platform-Kubuntu%20|%20Android%20|%20Web-brightgreen.svg)]()

Bienvenue sur le portail des questionnaires interactifs conçus spécifiquement pour le programme de **3ème**.
Boostez vos révisions pour le Brevet avec des outils modernes, rapides et accessibles hors-ligne !

## 📸 Aperçu de l'interface

|           Accueil (Desktop)           |           Interface Mobile            |          Mode Questionnaire           |
| :-----------------------------------: | :-----------------------------------: | :-----------------------------------: |
| <img src="capture/1.png" width="400"> | <img src="capture/2.png" width="200"> | <img src="capture/4.png" width="200"> |
|       _Sélection par matières_        |       _Accès rapide nouveautés_       |           _QCM interactif_            |

---

## 🚀 Démarrage Rapide

Accédez instantanément aux révisions sans installation, ou installez-le comme une application sur votre téléphone ou ordinateur (Kubuntu, Windows, Android).

➡️ **[ACCÉDER AU PORTAIL DES QUESTIONNAIRES](https://rraattrruuee.github.io/questionnaire-fr--niveaux-3-me/)** ⬅️

---

## 🎯 Points Forts du Projet

- ✅ **Révision Efficace :** Concentrez-vous sur les notions essentielles du brevet.
- 🧠 **Format Interactif :** QCM avec correction immédiate et explications détaillées.
- 📶 **Mode Offline (PWA) :** Une fois ouvert, le portail fonctionne même sans connexion internet.
- 📱 **Multi-plateforme :** Optimisé pour les écrans tactiles et les ordinateurs.

---

## 🛠 Contribuer au Projet

Vous avez trouvé une erreur ? Une question manque à l'appel ? Votre aide est précieuse !

### 📝 Signaler un problème (Issue)

1. Rendez-vous sur l'onglet **[Issues](https://github.com/rraattrruuee/questionnaire-fr--niveaux-3-me/issues)**.
2. Cliquez sur **"New issue"**.
3. Utilisez un titre clair : `[ERREUR] SVT - Question sur la génétique`.
4. Décrivez l'erreur et la correction attendue.

---

## ⚙️ Guide Technique : Ajouter des Questions

Le projet utilise le format JSON pour stocker les questions.

### 1. Structure Standard

Pour les matières générales (Français, SVT, EMC...) :

```json
{
  "q": "Titre de la question",
  "answers": ["Choix A", "Choix B", "Choix C"],
  "correct": "Choix B"
}
```

# ⚙️ fonctionnement du format JSON math

Pour générer de nouvelles questions compatibles avec le format JSON (Math) de l'application sans écrire le code à la main, copiez-collez la consigne ci-dessous dans une IA (ChatGPT, Claude, Mistral, etc.).

**Remplacez simplement `[INSÉRER TON SUJET ICI]` à la fin par le thème de votre choix (ex: "Les Vecteurs", "Fonctions Affines").**

```text
Je veux que tu agisses comme un générateur d'exercices de mathématiques pour une application Web spécifique. Je vais te donner un sujet et tu dois générer le code JSON correspondant.

RÈGLES STRICTES DE FORMATAGE :

1. Format de sortie : Tu dois fournir UNIQUEMENT un tableau JSON valide ([...]). Pas de texte avant ou après.
2. Interdiction LaTeX : N'utilise JAMAIS de symboles LaTeX comme $$, \frac, \times. N'utilise jamais de dollars $$$$.
3. Formatage Mathématique HTML :
   - Pour les fractions, utilise EXACTEMENT ce format HTML : <div class='math-frac'><span class='math-num'>NUMÉRATEUR</span><span class='math-den'>DÉNOMINATEUR</span></div>
   - Pour les puissances, utilise : x<sup>2</sup>
   - Pour les multiplications, utilise le caractère × (et non * pour l'affichage).
4. Structure JSON :
   Le JSON doit être une liste d'objets "Catégorie". Voici le modèle exact à respecter :

[
  {
    "category": "Nom de la Catégorie",
    "questions": [
      {
        "text": "Énoncé de la question (avec HTML pour les maths)",
        "type": "mcq", 
        "options": ["Choix 1", "Choix 2", "Choix 3"],
        "correct": 0, 
        "solution": "Explication détaillée.",
        "image": "data:image..."                // (Texte/Optionnel) Code Base64 de l'image (image n'est pas obligatoire)
      },
      {
        "text": "Énoncé de la question",
        "type": "text",
        "accepted": ["réponse1", "réponse 2", "3.5"],
        "solution": "Explication détaillée."
        "image": "data:image..."                // (Texte/Optionnel) Code Base64 de l'image (image n'est pas obligatoire)
      }
    ]
  }
]

Détails des champs :
- type "mcq" (QCM) : "options" est la liste des choix. "correct" est l'index de la bonne réponse (0 = 1er choix).
- type "text" (Réponse libre) : "accepted" est une liste de toutes les variantes de texte acceptées.

Sujet demandé :
Génère-moi maintenant une catégorie JSON sur le thème : [INSÉRER TON SUJET ICI] avec 5 questions variées.
```

---

### ⚙️ Générateur de Sujets de Brevet (DNB)

Pour générer un sujet complet de Brevet (Français, Mathématiques, SVT, etc.) compatible avec l'application, copiez cette consigne pour votre IA :

```text
Tu es un expert en conception d'examens pour le Diplôme National du Brevet (DNB) en France et un ingénieur de données spécialisé en format JSON.
Ton but est de générer un sujet complet sous la forme d'un objet JSON strictement valide et directement intégrable.

RÈGLES DE CONTENU STRICTES :
1. Choisis une matière parmi : "Français", "Mathématiques", "Physique-Chimie", "SVT", "Histoire-Géographie".
2. Barème total : 20 points (répartis rigoureusement entre les exercices et questions).
3. Structure : Au moins 2 exercices distincts, contenant chacun plusieurs questions.
4. Rôle du champ "description" : Il s'agit du support principal de l'épreuve.
   - En Français : Le texte littéraire complet.
   - En Sciences / Histoire-Géo : Le contexte, la situation-problème ou la présentation des documents.
   - MISE EN FORME : Tu DOIS utiliser du HTML enrichi pour structurer ce contenu (balises <p>, <br>, <strong>, <ul>, <li>, <hr>).

5. INTÉGRATION D'IMAGES (Optionnel mais recommandé) :
   - Si le sujet nécessite une illustration, un schéma, un graphique ou une photo d'œuvre, insère une balise HTML <img> DIRECTEMENT dans le texte du champ "description".
   - Syntaxe stricte pour l'image : <div style='margin: 1.5rem 0; text-align:center;'><img src='chemin/vers/image.svg' alt='Description de l'image' style='max-width: 400px; width: 100%;'></div>
   - Tu peux ajouter une légende en dessous avec une balise <p style='text-align:center; font-size:0.75rem; color:#94a3b8;'>Légende ou Source</p>

RÈGLES DE SÉCURITÉ TECHNIQUE (ZÉRO ERREUR JSON) :
- Format de sortie : UNIQUEMENT le bloc JSON dans un bloc de code. Aucun texte de bavardage avant ou après.
- GUILLEMETS : Puisque le JSON utilise des guillemets doubles (""), tu dois obligatoirement utiliser des guillemets simples ('') pour les attributs HTML à l'intérieur des chaînes (Ex: <img src='chemin.jpg'> et NON <img src=\"chemin.jpg\">).
- Si tu dois utiliser des guillemets doubles dans le texte, échappe-les obligatoirement (Ex: <em>Le Bel Appétit</em> ou \"Le Bel Appétit\").
- PAS de retours à la ligne physiques dans les valeurs textuelles. Pour aller à la ligne, utilise exclusivement les balises <br> ou <p>.

=== FORMAT JSON STRUCTURÉ ATTENDU ===
{
  "subject": "Nom de la matière",
  "title": "Titre accrocheur du sujet",
  "session": "Session Officielle 2026 ou autre mention",
  "description": "<h3>Document 1 : Titre</h3><p>Contenu textuel ici...</p><div style='text-align:center;'><img src='matiere/theme/illustration.svg' alt='Texte alternatif de l'image'></div><p style='text-align:right; font-size:0.75rem;'>Source de l'œuvre</p>",
  "exercises": [
    {
      "id": "exo1",
      "title": "Titre de l'exercice (ex: Compréhension et compétences d’interprétation)",
      "points": 10,
      "questions": [
        {
          "id": "exo1_q1",
          "text": "Énoncé clair et précis de la question ?",
          "points": 4,
          "guideline": "Critères précis de correction, barème détaillé et éléments de réponses attendus pour le correcteur."
        }
      ]
    }
  ]
}

Sujet demandé : Génère le sujet complet de [INSÉRER LE SUJET, LE TEXTE OU LE THÈME ICI].
```

---

### 🛠 Intégration du code

1. Copiez le JSON généré.
2. Ouvrez `revision-maths.html` ou le fichier correspondant.
3. Cherchez `const db = [ ...`.
4. Ajoutez votre bloc à la suite de la liste.

---

> Ce projet est maintenu avec passion par **rraattrruuee**. Bonne révision et plein de succès pour le Brevet ! 🍀
