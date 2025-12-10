# 🎓 Questionnaire Scolaire Interactif (Niveaux 3ème)

Bienvenue sur le portail des questionnaires interactifs conçus pour le niveau **3ème**.
Boostez vos révisions et testez vos connaissances en **EMC, Physique, et SVT** avec des QCM rapides et efficaces !

## 🚀 Démarrage Rapide

C'est simple ! Cliquez sur le lien ci-dessous pour accéder au portail de redirection et choisir la matière que vous souhaitez réviser.

➡️ **[ACCÉDER AU PORTAIL DES QUESTIONNAIRES](https://rraattrruuee.github.io/questionnaire-fr--niveaux-3-me/)** ⬅️

---

## 🎯 Objectifs du Projet

Ce dépôt a été créé pour offrir un support de révision léger, rapide et accessible, couvrant les fondamentaux des matières scientifiques et civiques clés au collège.

* ✅ **Révision Efficace :** Concentrez-vous sur les notions essentielles.
* 🧠 **Format QCM :** Idéal pour mémoriser et vérifier rapidement ses acquis.
* 💻 **Accessible Partout :** Un simple navigateur suffit.

---

## Vous avez trouvé une erreur ? Une question manque à l'appel ? Votre aide est la bienvenue !

### 📝 Comment ouvrir une Issue (Recommandé)

1.  Rendez-vous sur l'onglet **[Issues](https://github.com/rraattrruuee/questionnaire-fr--niveaux-3-me/issues)** de ce dépôt.
2.  Cliquez sur le bouton vert **"New issue"** (Nouvelle Issue).
3.  **Choisissez un Titre clair :** Par exemple, `[BUG] Erreur dans la réponse de la question 3 de SVT`.
4.  **Décrivez le problème avec précision** en incluant les informations suivantes (le plus possible) :
    * **Où se trouve l'erreur ?** (Exemple : Questionnaire de SVT, Question n°3)
    * **Quel est le comportement actuel ?** (Exemple : La bonne réponse est C, mais la réponse A est cochée.)
    * **Quel devrait être le comportement correct ?** (Exemple : La bonne réponse devrait être A.)
    * **Si c'est un bug d'affichage :** Quel est votre navigateur (Chrome, Firefox, etc.) ?

---

# ⚙️ fonctionnement du format JSON
## le format JSON fonctionne comme cela :

```json
{
  q: "titre:",
  answers: ["réponse 1", "réponse 2", "réponse 3", "etc"],
  correct: "réponse correcte",
},
```

---

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

### 🛠 Intégration dans le code
Une fois que l'IA vous a donné le code JSON :
1. Copiez le contenu (tout ce qui est entre `[` et `]`).
2. Ouvrez le fichier `revision-maths.html`.
3. Cherchez la variable `const db = [ ...`.
4. Ajoutez une virgule `,` après le dernier objet existant et collez votre nouveau bloc.

---

> Ce projet est maintenu par rraattrruuee. Bonne révision et bon succès ! 🍀
