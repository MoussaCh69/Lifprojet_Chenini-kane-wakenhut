const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({
        posts: {
            title: 'my first post ',
            desc: 'random data u shouldnt access !'
        }
    });
});


module.exports = router;