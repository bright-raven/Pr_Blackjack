# Pr_Blackjack

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Attribution] (#attribution)

## General info
! As of right now, the game should be playable in the console !
! My sincerest apologies, I did my best to get this functional, but it appears I bit off more than I could chew in a week. !

This is a simple single player web-based version of Blackjack, with a 3d twist.
	
## Technologies
Project is created with:
* three.js  version: r142

Only select components of three.js are used, so for convenience, their r142 versions are just stashed in /libs
	
## Setup
To serve this project, we will run an http daemon locally to bypass browser CORS.
This will serve files in the server directory only.
If you don't have the npm http-server installed, follow the directions here:

https://www.npmjs.com/package/http-server

Then, do the following:

```
$ cd /path/to/Pr_Blackjack
$ http-server -c-1 --cors
```
The -c-1 part disables caching if you need to run multiple times.

Then, open Pr_Blackjack/index.html in your browser to play. Enjoy!

If the gui doesn't appear to load, try clearing your browser cache.

##Attribution
Three.js is used under the MIT License

Thanks to Flyclipart.com and Wikipedia for images.
