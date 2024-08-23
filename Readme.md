# Backend with JS and Mongoose

## 1. Setting up prerequisites
1. Setting up `npm` and `git` with: 
```
npm init
git init
```

2. Creating .gitignore with [git ignore generator](https://mrkandreev.name/snippets/gitignore-generator/#Node).

3. Creating `.env`, `/src`, adding required files to src
```
touch .env
mkdir src
cd src
touch app.js constants.js index.js
```
4. Setting import type in `package.json` with
```
"type": "module",
```

5. Setting up `nodemon` to restart app automatically. (Since nodemon is dev dependency, we'll use `-D`)

```
npm i -D nodemon
```

Then add script to run `nodemon` in `package.json`.
```
"scripts": {
    "dev": "nodemon src/index.js"
  },
```
6. Creating all the required folders in src
`controllers` - To store main functionality
`db` - To host db connection logic
`middlewares` - To host function that act in between request and server fulfils.
`models` - To host all the models of db
`routes` - To store all the routes in between.
`utils` - To host utilities like file uploading, downloading etc.
```
cd src
mkdir controllers db middlewares models routes utils
```

7. Setting up `Prettier` so that there is no conflict about `;` , 2 space or 4 space etc.
```
npm i -D prettier
touch .prettierrc
touch .prettierignore
```

Update `.prettierrc` with preferences.
```
{
    "singleQuote": false,
    "bracketSpacing": true,
    "tabWidth": 2,
    "semi": true,
    "trailingComma": "es5"
}
```

Updating `.prettierignore` to exclude some files so that they are not affected like `node_modules`.
```
/.vscode
/node_modules
./dist

*.env
.env
.env.*
```



## Setting up DB

1. Login into `mongodb` and create `cluster`, set up network access.

2. Update `.env` with db url and port.
```
PORT = 8080
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.2diq1.mongodb.net
```
3. Importing `mongoose` `express` and `dotenv`
```
npm i mongoose express dotenv
```

4. Set `DB_NAME` in `constants.js`.

5. Create `db/index.js`, with `connectDB` function to handle connection with db, and exporting it.
```
const connectDB = async () => {
    try{
        // mongoose.connect(url) will return a connection instance promise
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error){
        // This console log will let us know engine reached here.
        console.log("MONGODB connection error ", error)
        process.exit(1)
    }
}
```
6. Importing `dotenv` in `index.js` that'll distribute variable of `.env` everywhere as soon as `index.js` runs.

```
import dotenv from "dotenv"

dotenv.config({
    path: './env'
})
```

7. Since we need to run `dotenv/config` when starting the app, we need to update this in `scripts` of `package.json`.
```
"scripts": {
    "dev": "nodemon -r dotenv/config  src/index.js"
  },
```
`-r dotenv/config`: This flag tells nodemon to require (or preload) the `dotenv` module before running your script. The dotenv module is used to load environment variables from a `.env` file into `process.env`.

8. Updating index.js to execute `connectDB` function that we created in `db/index.js` so that our app connects to db as soon as app runs.

9. Time to run the app and check if db connects.
```
npm run dev

// Output:  MongoDB connected !! DB HOST: cluster0-shard-00-00.xxxx.mongodb.net
```
