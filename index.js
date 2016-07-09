
const express = require('express')
const request = require('request')
const bodyParser = require('body-parser');
const chalk = require('chalk')
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');

let app = express()
app.use(bodyParser.urlencoded({ extended: true })); 
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.get('/', (req, res) => {
    res.render('empty' )
})
app.get('/getuser', (req, res) => {
    console.log(`Request user = ${req.query.name}`)
    let options = {
        url: `https://api.github.com/users/${req.query.name}/followers`,
        headers: {
            'User-Agent': 'request'
        }
    };
    if (req.query.name===''){
        res.render('empty' )
    }
    else {
        request(options, (error, response, html) => {
            console.log(response.body)
            if(JSON.parse(response.body).message==='Not Found') { 
                res.render('notfound', { name: req.query.name } )
            }
            else if( JSON.parse(response.body).length===0 ) {
                 res.render('nofollow', { name: req.query.name } )   
            }
            else {
                res.render('body', { item: JSON.parse(response.body) } )
            }    
        })
    }
    
})
app.listen(3000, () => {
    console.log(chalk.blue(`listening on port 3000!`));
})
