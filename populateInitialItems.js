const mongoose = require('mongoose')

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

Item.insertMany(defaultItems, (err) => {
  if(err) {
    console.log(err)
  } else {
    console.log('Items added to DB')
  }
})

