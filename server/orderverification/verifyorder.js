const orderutilsheet = require('./sheet'); 
const orderutilridge = require('./ridge'); 
const orderutilscrews = require('./screw'); 
const orderutilsitems = require('./items'); 
const { customerorder, metroliteorder } = require('./metroliteorders'); 
const { returnbrand, returnazvalue,returngfvalue,calculatefeetttommvalue,
    calculateinchttommvalue,calculateareainsqft } = require('./metrolitefunctions');

function processoneorder()
{
    // Step 1: Define the class
class Person {
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
  
    introduce() {
      console.log(`Hello, my name is ${this.name}, and I'm ${this.age} years old.`);
    }
  }
  
  let person;
  // Step 2: Create instances of the class
  person = new Person('Alice', 30);
  
  // Step 3: Add instances to an array
  const peopleArray = [];
  peopleArray.push(person)
  person = new Person('Alice2', 302);
  peopleArray.push(person)
  person = new Person('Alice3', 303);
  peopleArray.push(person)
  
  
  // Access and use the array of class instances
  peopleArray.forEach((person) => {
    person.introduce();
  });
  
        //return result
}            
processoneorder()