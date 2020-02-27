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
        .prompt({
            name: "action",
            type: "list",
            message: "What do you need to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function(answer){
            switch(answer.action){
                case "View Products For Sale":
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
            }
        });
}
function viewProducts(){
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        if(err) throw err;
        var table = new Table({
            head: ["Item ID", "Product Name", "Price", "Quantity"],
            colWidths: [10, 25, 6, 5]
        });
        for(var i = 0; i < res.length; i++){
            var itemId = res[i].item_id,
            productName = res[i].product_name,
            price = res[i].price,
            stockQuantity = res[i].stock_quantity;

      table.push(
          [itemId, productName, price, stockQuantity]);
        }
        console.log(table.toString());
    });
    //showOptions();
}
//connection.end();