# OlympicGamesStarter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.6.

Don't forget to install your node_modules before starting (`npm install`).

## Clone and install

1. Clone the GitLab repo via HTTPS or SSH: `git clone https://github.com/brice-morgat/p2-angular-code-maintenable.git` then `cd olympic-games-starter`.
2. Install a compatible Node.js LTS version (>= 18.19.x or 20.11.x recommended). You can:
   - Download the installer from https://nodejs.org/ (choose LTS).
   - Or use nvm: `nvm install 20 && nvm use 20` (nvm-windows: https://github.com/coreybutler/nvm-windows).
   Then check with `node -v` that the version is >= 18.19.
3. Install project dependencies: `npm install`.
4. Start the dev server: `npm start` or `ng serve`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Where to start

As you can see, an architecture has already been defined for the project. It is just a suggestion, you can choose to use your own. The predefined architecture includes (in addition to the default angular architecture) the following:

- `components` folder: contains every reusable components
- `pages` folder: contains components used for routing
- `services` folder: contains the business logic
- `models`folder : contains data's models

I suggest you to start by understanding this starter code. Pay an extra attention to the `app-routing.module.ts` and the `olympic.service.ts`.

Once mastered, you should continue by creating the typescript interfaces inside the `models` folder. As you can see I already created two files corresponding to the data included inside the `olympic.json`. With your interfaces, improve the code by replacing every `any` by the corresponding interface.

You're now ready to implement the requested features.

Good luck!
