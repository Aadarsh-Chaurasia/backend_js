# Backend with JS and Mongoose

## 1. Setting up 
1. Setting up npm and git with: 
```
npm init
git init
```

2. Creating .gitignore with [git ignore generator](https://mrkandreev.name/snippets/gitignore-generator/#Node).

3. Creating .env, /src, adding required files to src
```
touch .env
mkdir src
cd src
touch app.js constants.js index.js
```
4. Setting import type in package.json with
```
"type": "module",
```

5. Setting up `nodemon` to restart app automatically. (Since nodemon is dev dependency, we'll use `-D`)

```
npm i -D nodemon
```

Then add script to run nodemon in package.json
```
"scripts": {
    "dev": "nodemon src/index.js"
  },
```
