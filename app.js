const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require("mongoose");
const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Creating database
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

// Creating schema = 
const itemsSchema = {
    name: String
};

// Creating model
const Item = new mongoose.model("Item", itemsSchema);

//Creating document
const item1 = new Item({
    name: "Welcome to your To-Do List"
})

const item2 = new Item({
    name: "Hit the + button to off a new item"
})

const item3 = new Item({
    name: "<-- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema ({
    name : String,
    items : [itemsSchema]
})

const List = mongoose.model("List", listSchema);


app.set("view engine", "ejs");


app.get("/", (req, res) => {
    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Successfully saved defaults Items to DB");
                }
                res.redirect("/");
            })
        }
        else {
            res.render("list", {listTitle:"Today", newListItems : foundItems})
        }
    })
    
});

app.get("/:customListName", (req,res)=>{
    const customListName = req.params.customListName;

    const listedName = List.findOne({name:customListName},function(err,foundList) {
        if(!err) {
            if(!foundList) {
                const list = new List({
                    name : customListName,
                    items : defaultItems
                })
                
                list.save();
            } 
            
            else {
                res.render("list", {listTitle : foundList.name, newListItems : foundList.item});
            }
        }
    });
})

app.post("/", (req, res) => {
    const itemName = req.body.newItems;
    const item = new Item({
        name : itemName
    })
    
    item.save();
    res.redirect("/");
    
    
});

app.get("/work", (req, res) => {
    res.render("list", { listTitle: "My To-Do List", newListItems: workItems });
});

app.post("/work", (req, res) => {
    let item = req.body.newItems;
    workItems.push(item);
    res.redirect("/work");
});

app.post("/delete", (req,res)=>{
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove({_id:checkedItemId}, (err)=>{
        if(!err) {
            console.log("Element removed")
        } else {
            throw err;
        }
    });
    
    res.redirect("/");
})

app.get("/about", (req, res) => {
    console.log(req.body);
})
app.listen(3000, () => {
    console.log("Server started on port 3000");
});


// if (foundItems.length === 0) {
//         res.render("list", { listTitle: "Today", newListItems: foundItems });
//     }
//     else {
//             res.render("list", {listTitle}, )
//         }
        
        
        
        
//         Item.insertMany(defaultItems, function (err) {
//             if(err) {
//                 console.log(err)
//             } else {
//                 console.log("Successfully saved defaults Items to DB");
//             }
//         })