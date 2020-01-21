//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const date = require('./date')

const app = express();

const items = ['Buy food', 'Cook food', 'Eat food']
const workItems = []

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get("/", (req, res) => {

  const day = date()

  res.render('list', { 
    listTitle: day,
    newListItems: items
  })
});

app.post('/', (req, res) => {

  item = req.body.newItem

  if (req.body.list === 'Work') {
    workItems.push(item)
    res.redirect('work')
  } else {
    items.push(item)
    res.redirect('/')
  }
  
  
})

app.get('/work', (req, res) => {
  res.render('list', {listTitle: 'Work List', newListItems: workItems})
})

app.post('/work', (req, res) => {
  let item = req.body.newItem
  workItems.push(item)
  res.redirect('/work')
})

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
