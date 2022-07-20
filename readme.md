# Pr_Blackjack

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
This is a simple single player web-based version of Blackjack, with a 3d twist.
	
## Technologies
Project is created with:
* three.js  version: r142
	
## Setup
To run this project, we will run an http daemon to serve files locally and bypass browser CORS.
this will serve files in the server directory only.
if you don't have the npm http-server installed, follow the directions here:

https://www.npmjs.com/package/http-server

Then, do the following:

```
$ cd /path/to/Pr_Blackjack
$ http-server --cors
```

Then, open Pr_Blackjack/index.html in your browser to play. Enjoy!