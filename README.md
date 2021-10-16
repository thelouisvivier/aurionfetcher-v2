# aurionfetcher-v2

Programme en javascript permettant de télécharger le planning d'Aurion, et mettre le calendrier à disposition via une souscription iCal, puis notifier l'utilisateur sur telegram en cas de changements et de problèmes.  

**thelouisvivier - 2020**  

---

Ce programme est basé sur le travail de Bdeliers disponible à l'adresse suivante : https://github.com/BDeliers/Python-Planning-Aurion

---

Pour utiliser ce programme, il vous faudra installer nodejs et npm.

Sous linux :

```shell
    sudo apt install nodejs
```

```shell
    sudo apt install npm
```

Telechargez aurionfetcherjs dans le répertoire de votre choix

```shell
    wget https://github.com/thelouisvivier/aurionfetcherjs.git
```

Ajoutez ensuite vos infos dans le config/config.json

Installez les dépendances nécessaires depuis la racine du programme :

```shell
    npm install
```

Enfin, pour lancer le programme :

```shell
    npm run start
```

---

Pour installer via docker, l'image est disponible ici https://hub.docker.com/r/thelouisvivier/aurionfetcherjs/
Montez le dossier /config vers l'emplacement local de votre fichier config.json
Bien exposer le port choisi dans config.json.
Voilà !

---

Vous pouvez maintenant souscrire au calendrier depuis votre application préférée.
