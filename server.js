const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
// let users stay logged in - if you log in, refresh, and click login, you go straight to todos page. 
// cookie gets left on user computer and matches session stored on db
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
// pops up for errors?
const flash = require('express-flash')
// simple debugger/logger. see all the request coming through on terminal. Same as coding in console log but automatic
const logger = require('morgan')
// config/database.js - holds whats required from db
const connectDB = require('./config/database')
// two routes - one for login/sign up  other for todos list - get/put/delete
const mainRoutes = require('./routes/main')
const todoRoutes = require('./routes/todos')

// tell express to use environment variable. hide files. dont push to github
require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

// is a function to connect to db () is calling something
connectDB()

// ejs for views
app.set('view engine', 'ejs')
// public to host css/js
app.use(express.static('public'))
// look at requests coming through. Pull stuff from forms etc. Can look at different part of request coming through.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// requests get logged via morgan
app.use(logger('dev'))

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware - passport handles authentication 
app.use(passport.initialize())
app.use(passport.session())

// flash alerts when login error
app.use(flash())
  
// how to handle requests come in -> main or todo
app.use('/', mainRoutes)
app.use('/todos', todoRoutes)
 
// if push to heroku/etc dont use fix port
app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    