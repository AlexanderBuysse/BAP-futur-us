# BAP-futur-us

## Setup algemene site
Git clone het project naar je systeem. 
Blijf of op de main branch en run dit command:

``` bash
# Installeer dependencies (alleen de eerste keer)
npm install / yarn

# Run lokale server op localhost:8080
npm run dev / yarn dev

# Bouw een project die online kan geplaatst worden
npm run build / yarn build
```

### Als je wilt je project online plaatsen:
Activeer het build script.
Eens je dit gedaan hebt ga je naar de dist map. Hiermee ga je naar je favoriete server connector (filezilla). Je sleept elke bestand op je server en surft naar dit adress `domeinnaam.be/mapwaarjeindexstaat`.

## Setup particles systeem
Git clone het project naar je systeem. Ga naar de particles branch en run deze commands:

``` bash
# Installeer dependencies (alleen de eerste keer)
npm install / yarn

# Run lokale server op localhost:3000
node index.js
```
### Project online plaatsen
Het makkelijkst om dit deel van het project online te plaatsen is als je heroku gebruikt. 
Ga naar heroku maak een account aan en maak een nieuw project aan. Kies voor een europese server en verbind je github account. Op je github maak je een nieuwe repo aan waar je de particles branch als main branch zet. Ga hierna terug naar heroku en link die repo met het project. Hierna zou het vanzelf alle scripts moeten runnen en ga je na een tijdje een link krijgen. 

#### Online Setup voor projectie
Als deze gebruiker surf je naar de site en vul je de code 8888 in. Nadat je op verzenden hebt geduwd zou je normaal naar onder moeten kunnen scrollen. Hier zal je een zwart vlak zien. Op dit vlak zal de animatie geanimeerd worden als er een gebruiker een code invoert. Op deze pagina kan je dus de madmapper software gerbuiken om dit op de boom te projecteren.

Hierna volgt de madmapper setup:
1. Download madmapper
2. Open syphon
3. Open google chrome met de setup voor de projectie
4. Kies in syphon dit venster
5. Ga terug naar madmapper en kies syphon als live input
6. Sleep dat in je output 
7. Hierna adjust je de juiste grotes op madmapper zelf

#### Online Setup voor user
Normaal moet je als gebruiker niets doen behalve naar de site surfen en de code invoeren.
