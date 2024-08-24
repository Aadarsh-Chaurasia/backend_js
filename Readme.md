# Backend with JS and Mongoose

## 1. Setting up prerequisites
1. Setting up `npm` and `git` with: 
```
npm init
git init
```

2. Creating .gitignore with [git ignore generator](https://mrkandreev.name/snippets/gitignore-generator/#Node).

3. Creating `.env`, `/src`, adding required files to `src`.
```
touch .env
mkdir src
cd src
touch app.js constants.js index.js
```
4. Setting import type in `package.json` with:
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

## 2. Setting up DB

1. Login into `mongodb` and create `cluster`, set up network access.

2. Update `.env` with db url and port.
```
PORT = 8080
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.2diq1.mongodb.net
```
3. Importing `mongoose` [Express JS](https://expressjs.com/en/5x/api.html) and [dotenv](https://www.npmjs.com/package/dotenv).
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

## Connecting to Server
1. After DB is connected we need to start the server, We'll use `express` to handle HTTP `requests` and `responses`.

2. Creating a `express` app in `app.js`.
```
import express from 'express';
const app = express();
export { app }
```

3. When connectDB function is called in `index.js`, it'll return a `promise`, we'll listen to `server` after that `promise` else catch the error.
```
// Connecting to DB
connectDB()
.then(() => {
    const port = process.env.PORT || 8000
    // Checking for error before listening for server.
    app.on("error", (err) =>{
        console.log('Error: ', err);
    })
    // Listening to Server
    app.listen(port, () => {
        console.log(`Server running at port: ${port}`);
    })
})
.catch((err) => {
    console.log('MONGO DB connection failed !!', err)
})
```

4. We'll need [CORS](https://npmjs.com/package/cors) (Cross Origin Resource Sharing) and [cookie-parser](https://www.npmjs.com/package/cookie-parser).

    `CORS` is a security feature that controls how resources on a web server can be requested from another domain.
Imagine you have a website hosted at `https://mywebsite.com` and an `API` hosted at `https://api.mywebsite.com`. If you want your website to interact with your API, you need to configure CORS to allow requests from `https://mywebsite.com` to `https://api.mywebsite.com`.

    `cookie-parser` is a middleware for Express that helps parse cookies sent with HTTP requests.
```
npm i cookie-parser cors
```

5. Configuring `app` to help ensure your server is secure, efficient, and capable of handling requests from various sources while managing data effectively.
```
const app = express();

// app.use() is used for middlewares configurations.
app.use(cors({
    origin: process.env.CORS_ORIGIN,  // CORS to control which domains can access your API.
    Credentials: true    // Allows cookies and other credentials to be sent in cross-origin requests.
}))

app.use(express.json({limit: "16kb"}))   // Body size limits to prevent excessively large requests.
app.use(express.urlencoded({extended: true, limit: '16kb'})) // To handle the incoming url that are encoded, eg. %20% instead of space.

app.use(express.static("public")) //  for serving files from the public directory to url.

app.use(cookieParser()) // Cookie parsing for handling cookies in requests
```

6. Since whenever we need to request or get response from DB, we'll have to wrap it in a async function and then in try and catch so why not build a util that handles this in `asyncHandler.js` in `Utils`.

    There are 2 ways to do this.
    1. By using async - await : 
    ```
    const asyncHandler = (requestHandler) => (req, res, next) =>{
        try{
            await requestHandler(req, res, next)
        } catch (err) {
            res.status(err.code || 500).json({
                success: false,
                message: err.message
            })
        }
    }
    ``` 
    2. By using Promises resolve: 
    ```
    const asyncHandler = (requestHandler) => {
        (req, res, next) => {
            Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err))
        }
    }
    ```

## Custom Error and API Handling 

Creating ApiResponse.js, ApiError.js

## Creating DB models

1. Creating `user.model.js`.

    Defining a user schema and creating and exporting model according to that schema.
    ```
    import mongoose, {Schema} from "mongoose"

    const userSchema =new Schema({})

    export const User = mongoose.model("User", userSchema)
    ```
2. Updating schema with input fields like `username`, `password`, `email`, `fullname`, `avatar`, `coverImage` and `watch history`.
    `Watch history` will contain reference to `video` model.
    ```
    watchHistory: {
            type: Schema.Types.ObjectId,
            ref: "video" 
        }
    ```

3. Creating `video.model.js`.
    videoSchema contains timestamps: true to log all the change events.
    ```
    import mongoose, {Schema} from "mongoose"

    const videoSchema = new Schema(
        {

        },{ timestamps: true }
    )

    export const Video = mongoose.model("Video", videoSchema)
    ```
    
    Updating Schema to include input fields : videoFile,thumbnail,title,description,duration,views,isPublished, owner.

4. We'll need to write `aggregate queries` to get watch history, So we'll need to use some mongoose plugins and [mongoose-aggregate-paginate](https://www.npmjs.com/package/mongoose-aggregate-paginate-v2)
    ```
    npm i mongoose-aggregate-paginate-v2
    ```
    And then use it as plugin for video schema.
    ```
    videoSchema.plugin(mongooseAggregatePaginate)
    ```

5. We'll use `bcrypt` to hash password and `JWT` (jsonwebtoken) for tokens
    ```
    npm i bcrypt jsonwebtoken
    ```

6. Before user database is updated, we'll have check if password is modified, if so then we'll encrypt it. The said can be achieved using `pre()` hook offered by `mongoose`.
    ```
    userSchema.pre("save", async function (next) {
        if(!this.isModified("password")) return next();

        this.password = await bcrypt.hash(this.password, 10)
        next()
    })
    ```
    If we don't check if password is changed explicitly then password will be hashed again even if only just other property like avatar is changed.

7. Mongoose offers flexibility to inject methods directly into model using `.methods`. We will create custom method to check if password if correct.
    ```
    userSchema.methods.isPasswordCorrect = async function(password){
        return await bcrypt.compare(password, this.password)
    }
    ```

8. Token