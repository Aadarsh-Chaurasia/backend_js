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
            return await requestHandler(req, res, next)
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
        return (req, res, next) => {
            Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err))
        }
    }
    ```
    `asyncHandler` is a `higher order function` that is accepting a callback and returning it's resolution.

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

5. We'll use `bcrypt` to hash password and `JWT` (jsonwebtoken) for tokens.
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

## Uploading Files
1. We'll use [cloudinary](cloudinary.com) and [multer](https://github.com/expressjs/multer#readme).
    ```
    npm i cloudinary multer
    ```
2. Setting up `Cloudinary`
    Create a `cloundinary.js` file in `utils`, then import v2 from cloudinary as cloudinary and configure it accordingly.
    ```
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    ```
    Creating Function in `cloudinary.js` to upload file :
    ```
    const uploadOnCloudinary = async (localFilePath) => {
        try{
            if (!localFilePath) return null
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
            console.log("File uploaded successfully", response.url)
            return response

        } catch(error) {
            fs.unlinkSync(localFilePath)  // To remove file even if it hasn't been uploaded.
        }
    }
    ```

3. Setting Up `multer`
    Create `multer.middleware.js` in `middlewares`, We'll be storing file temporarily in `public/temp`.
    ```
    import multer from "multer"

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '/tmp/my-uploads')
        },
        filename: function (req, file, cb) {

            cb(null, file.originalname) // Storing file temporary with original name but this can lead to overriding file if user upload multiple files with same name.
        }
    })

    export const upload = multer({ storage: storage })
    ```

## Creating Controllers and routers

1. Create `user.controller.js` in `src/controllers`.
    We will create a `registerUser` function to register user but for now it'll just return `json` response and wrap it in `asyncHandler`.
    ```
    import {asyncHandler} from '../utils/asyncHandler.js'

    const registerUser = asyncHandler(async (req, res) => {
        res.status(200).json({
            message: 'ok'
        })
    })
    export {registerUser}
    ```

2. Now We'll define all the routes for the user in `user.routes.js` in `src/routes`.
    ```
    import {Router} from "express";

    const router = Router();

    export default router
    ```

3. Now we'll be adding /users route to our app in app.js using app.use()
    ```
    // Routes import
    import userRouter from './rotes/user.routes.js'

    // Routes declaration
    app.use("/api/v1/users", userRouter) // for http://localhost:8080/api/v1/users 
    ```

4. Now whenever `api/v1/users` is visited, userRouter will be called so we will update our `user.router.js` to handle that to route to registerUser.
    ```
    // Routing to http:localhost/api/v1/users/register
    router.route("/register").post(registerUser)
    ```

5. User controller is all set checking if everything works fine !
```
npm run dev
// Output: MongoDB connected !! DB HOST: cluster0-shard-00-00.xxxxx.mongodb.net
// Server running at port: 8080
```

## Registering User

1. Updating `registerUser` function in `user.controller.js` Getting user details from api call
    ```
    const {fullName, email, username, password } = req.body
    ```

2. `Validating` user details and checking if user already exists.
    ```
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exists: username, email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    ```

3. `Upload` `avatar` and `cover image` to `cloudinary`.
    ```
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // uploading to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    let coverImage;
    if(coverImageLocalPath !== ""){
        coverImage = await uploadOnCloudinary(coverImageLocalPath)
    }
    else{
        coverImage = ""
    }

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
    ```

4. `create user object` - create entry in db AND remove `password` and `refresh token` field from `response`.
    ```
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    ```

6. check for `user` creation and return `response`.
    ```
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // Returning response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
    ```
    