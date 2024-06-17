# How to run:
## Requirements:
* nodejs (tested on version v22.2.0, should work on other versions as well)
* pnpm (To install pnpm type as root / administrator: `npm i -g pnpm`)
* git

## Steps:
* clone repository: `git clone https://github.com/BaderBC/tukano-dijkstra-website/`
* open two terminals
* on first terminal
    * enter fronend folder: `cd tukano-dijkstra-website/frontend`
    * install dependencies: `pnpm i`
    * run app: `pnpm dev -- --open`
* on second terminal:
    * enter backend folder: `cd tukano-dijkstra-website/backend`
    * install dependencies: `pnpm i`
    * run app: `pnpm start:dev`
