# S@PS Scoreboard
This is the TSH layout used for S@PS's Smash Ultimate stream. It uses HTML, CSS, and Javascript in order to be one Browser Source in OBS.

## How to use this layout
First, make sure you have [TSH](https://github.com/joaorb64/TournamentStreamHelper) downloaded, either by cloning it using git or by downloading it from the [Releases](https://github.com/joaorb64/TournamentStreamHelper/releases/latest) page. You can clone it using the following command, where `<DIRECTORY>` is the directory you want to place TSH into:
```
git clone --recursive https://github.com/joaorb64/TournamentStreamHelper <DIRECTORY>
```

Afterwards, you can either clone this repository or download it directly from github and place it in a subfolder the `layout` folder of TSH. You can use this command to clone it from github from the `layout` folder in a folder of TSH:
```
git clone --recursive https://github.com/aryan-sinhala340/saps_scoreboard
```

This will automatically place it into the correct folder. Afterwards, you can just add a Browser Source in OBS pointing to this repository's `index.html` file. Then just use TSH to modify all the necessary data (which can just be pulled from the tournament's start.gg page for easy use.
