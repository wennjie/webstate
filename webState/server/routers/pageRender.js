const express = require('express');
const router = express.Router();



router.get('/',(req,res)=>{

console.log(123)
// res.send('123')
res.render('index',{title:"天麒科技"})

})



module.exports = router;