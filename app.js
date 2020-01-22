const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const _ = require('lodash')

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

const Item1 = new Item ({
  name: 'Welcome to your ToDo list'
})

const Item2 = new Item ({
  name: 'Hit the + button to add a new item'
})

const Item3 = new Item ({
  name: '<-- Hit this to delete a button'
})

const defaultItems = [Item1, Item2, Item3]

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model('List', listSchema)

app.get("/", (req, res) => {

  Item.find({}, (err, foundItems) => {

  if (foundItems.length === 0) {
    Item.insertMany(defaultItems, (err) => {
      if(err) {
        console.log(err)
      } else {
        console.log('Items added to DB')
      }
    })
    res.redirect('/')
  } else {
    res.render('list', { 
      listTitle: 'Today',
      newListItems: foundItems
    })
  }
})
      

app.get('/:customListName', (req, res) => {
  const customListName = _.capitalize(req.params.customListName)

  List.findOne({name: customListName}, (err, foundList) => {
    if(!err) {
      if (!foundList) {
        //Creates a new list
        List.create({
          name: customListName,
          items: defaultItems
        })
        res.redirect(`/${customListName}`)
      } else {
        //Shows an existing list
        res.render('list', { 
          listTitle: foundList.name,
          newListItems: foundList.items
        })
      }
    }
  })
})

app.post('/', (req, res) => {

  const itemName = req.body.newItem
  const listName = req.body.list

  const item = new Item({
    name: itemName
  })

  if (listName === 'Today') {
    item.save()
    res.redirect('/')
  } else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(item)
      foundList.save()
      res.redirect(`/${listName}`)
    })
  }
})


app.post('/delete', async (req, res) => {
  const checkedItemId = req.body.checkbox
  const listName = req.body.listName

  if (listName === 'Today') {
    await Item.findByIdAndDelete(checkedItemId)
  } else {
    await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
      if(!err) {
        res.redirect(`/${listName}`)
      }
    })
  }
  res.redirect('/')
})

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
