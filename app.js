const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')

const app = express();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect('mongodb://localhost/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log(error))

const itemsSchema = {
      name: String
    };
    
const Item = mongoose.model('Item', itemsSchema)

app.get("/", (req, res) => {

  Item.find({}, (err, foundItems) => {

      res.render('list', { 
        listTitle: 'Today',
        newListItems: foundItems
      }) 
  })
  
});

app.post('/', (req, res) => {

  const itemName = req.body.newItem

  Item.create({name: itemName})
  
  res.redirect('/')
})

app.post('/delete', async (req, res) => {
  const checkedItemId = req.body.checkbox

  await Item.findByIdAndDelete(checkedItemId)

  res.redirect('/')
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
