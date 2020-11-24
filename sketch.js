//Create variables here
var database;
var dog, happyDog, database, foodS, foodStock;
var feed, addFood;
var fedTime, lastFed;
var foodObj;
var canvas;

function preload()
{
  //load images here
  dogImg = loadImage("images/dog.png");
  happyDogImg = loadImage("images/happyDog.png");
}

function setup() {
   database = firebase.database();

   foodStock = database.ref('Food');
   foodStock.on("value",readStock);

 canvas = canvas = createCanvas(1000,400);

  foodObj = new Food();

  dog = createSprite(250,330);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  feed=createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() { 
  background(46, 139, 87); 
  
  foodObj.display();

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12)
  {
    text("Last Fed: "+lastFed%12 + "PM", 350,30);
  }else if(lastFed==0){
    text("Last Fed : 12 AM", 350,30)
  }

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){

  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })
}

function feedDog()
{
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime: hour()
  });
}

function addFoods()
{
  foodS++;
  database.ref('/').update({
    Food: foodS
  });

}