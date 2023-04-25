const router = require('express').Router();
const User = require('../model/User');
const {registerValidation , loginValidation} = require('../routes/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//register
router.post('/register', async (req, res) => {
    // Validation
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).send('User already exists');
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (error) {
        res.status(400).send(error);
    }
});
//Login
router.post('/login', async (req, res) => {
    // validation
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    // check if user exists in the database
    const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Utilisateur n\'nexsiste pas');
  
    // compare the password with the hashed password in the database
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Email ou password est incorrect');
    // create and send a JSON web token (JWT) to the client
    //export TOKEN_SECRET='jkjhlhljjjijoi'process.env.TOKEN_SECRET
    const token = jwt.sign({ _id: user._id, username: user.username }, 'jkjhlhljjjijoi');
res.header('auth-token', token).send({ token, username: user.username });
  });


module.exports = router ;
