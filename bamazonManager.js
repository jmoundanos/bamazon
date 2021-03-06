var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table3");

//create a connection and store it in a variable
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "daphnemax12",
    database: "bamazon"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected on " + connection.threadId);
    
    showOptions();
});

function showOptions(){
    inquirer
    .prompt([
            {   
            name: "action",
            type: "list",
            message: "What do you need to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        },
        ])
    .then(function(answer){
        switch(answer.action){
        case "View Products for Sale":
            viewProducts();
            break;
        case "View Low Inventory":
            viewLowInventory();
            break;
        case "Add to Inventory":
            addInventory();
            break;
        case "Add New Product":
            addNewProduct();
            break;
        case "Exit":
            connection.end();
            }
        });
}
function viewProducts(){
    
    var query = "SELECT * FROM products";
    var table = new Table({
        head: ["Item ID", "Product Name", "Department","Price", "Quantity"],
        colWidths: [10, 25, 25, 10, 10]
    });
    connection.query(query, function(err, res){
        if(err) throw err;
       
        for(var i = 0; i < res.length; i++){
            var itemId = res[i].item_id,
            productName = res[i].product_name,
            department = res[i].department_name,
            price = res[i].price,
            stockQuantity = res[i].stock_quantity;

      table.push(
          [itemId, productName, department, price, stockQuantity]);
        }
        console.log("");
        console.log(table.toString());
        showOptions();
    });
    
}
function viewLowInventory(){
   
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        if(err) throw err;
        for(var i = 0; i < res.length; i++){
            if(res[i].stock_quantity < 5){
                console.log(res[i].product_name +" are almost out of stock!");
            }
        }
    showOptions();
    });
}
function addInventory(){
    inquirer
    .prompt([
        {   
        name: "item",
        type: "input",
        message: "What is the item id for the product would you like to add more of?"
    },
    {
        name: "quantity",
        type: "input",
        message: "How many would you like to add?",
        validate: function(value){
            if(isNaN(value) === false){
                return true;
            }
            return false;
        }
    }
    ]).then(function(answer){
        connection.query("SELECT * FROM products WHERE item_id =" +answer.item, function(err, res){
            if(err) throw err;
            connection.query('UPDATE products SET stock_quantity = stock_quantity +' +answer.quantity +' WHERE item_id = ' + answer.item + '', function(err, res){
                if(err) throw err;
                console.log(answer.item + " has been updated")
                showOptions();
    })
})
    })
}  
function addNewProduct(){
    console.log("add product");
    inquirer
    .prompt([
        {   
        name: "name",
        type: "input",
        message: "What is the name of the product you would like to add?"
    },
    {
        name: "department",
        type: "input",
        message: "Which department should the product go in?"
    },
    {
        name: "price",
        type: "input",
        message: "What is the price of the product?",
        validate: function(value){
            if(isNaN(value) === false){
                return true;
            }
            return false;
        }
    },
    {
        name: "quantity",
        type: "input",
        message: "How many would you like to add?",
        validate: function(value){
            if(isNaN(value) === false){
                return true;
            }
            return false;
        }
    }
    ]).then(function(answer){
        var name = answer.name;
        var query = ("INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES("+"'" +name+ "'"+","+"'" +answer.department+ "'"+","+ +answer.price+ "," +answer.quantity+")");
        connection.query(query, function(err, res){
            if(err) throw err;
            console.log(answer.name + " has been added");
            showOptions();
        }) 
    })
   
}