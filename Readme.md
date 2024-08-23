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
6. Creating all the required folders in src
controllers - To store main functionality
db - To host db connection logic
middlewares - To host function that act in between request and server fulfils.
models - To host all the models of db
routes - To store all the routes in between.
utils - To host utilities like file uploading, downloading etc.
```
cd src
mkdir controllers db middlewares models routes utils
```

7. Setting up Prettier so that there is no conflict about `;` , 2 space or 4 space etc.
```
npm i -D prettier
touch .prettierrc
touch .prettierignore
```

Update .prettierrc with preferences
```
{
    "singleQuote": false,
    "bracketSpacing": true,
    "tabWidth": 2,
    "semi": true,
    "trailingComma": "es5"
}
```

Updating .prettierignore to exclude some files so that they are not affected like node_modules.
```
/.vscode
/node_modules
./dist

*.env
.env
.env.*
```

