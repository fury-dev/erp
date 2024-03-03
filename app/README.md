# cms

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list


### Starters
- Install dependencies
``sh
  npm i
``
- Start up the project
``sh
npm run dev
``


### Api configuration
- Add in the .env file
```
VITE_API_ENDPOINT="backend_ip"

VITE_LOCATION_API_KEY="location_api_key" from [link](https://countrystatecity.in/)

VITE_GOOGLE_OAUTH_API="your_oauth_google_api" 
```


### Structure
- src
  - api
  - components // generic components
  - context
  - routes
  - hooks 
  - views
    - pages // all screens
      - item folder
        - components // item specific components
        - hooks // item specific components
        - item.tsx
  - types 
  - store // redux
  - services // api hooks 