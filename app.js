//Budget Controller 
var budgetController = (function(){
   
   var Expense = function(id, description, value){
   	this.id = id;
   	this.description = description;
   	this.value = value;
    this.percentage = -1;
   };
   
   Expense.prototype.calcPercentage = function(totalIncome)
   {  if(totalIncome > 0){
      this.percentage = Math.round((this.value/totalIncome)*100);} else{
        this.percentage = -1;
      }
   
   };
   Expense.prototype.getPercentage = function(){
    return this.percentage;
   };
   var Income =  function(id, description, value){
   	this.id = id;
   	this.description = description;
   	this.value = value;
   };

  var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(curr){
        sum += curr.value;
    });
    data.totals[type]=sum;

  };

   var data = {
   	allItems: {
   		exp: [],
   		inc: []
   	},
   	totals:{
   		exp: 0,
   		inc: 0
   	},
    budget: 0,
    percentage: -1
   };

   return {
    addItem: function(type, des, val){
         var newItem, ID;
         console.log(type);
         // Create new ID
         if(data.allItems[type].length > 0)
         {
          ID = data.allItems[type][data.allItems[type].length - 1].id +1;
         }else{
          ID =0;
         }
         //creating new item
         if(type ==='inc'){
             newItem = new Income(ID, des, val);
         }
         else if(type === 'exp'){
             newItem =  new Expense(ID, des, val);
         }
         //pushing it to the data structure
         data.allItems[type].push(newItem);
         //returning the new element
         return newItem;
    },
    deleteItem: function(type, id){
        var ids = data.allItems[type].map(function(current){
           return current.id;
        });
        console.log(ids);
        index = ids.indexOf(id);
         console.log(data);
         if(index !== -1){
          data.allItems[type].splice(index, 1);
         }
         console.log(data);        
    },

    calculatebudget: function(){

    //calculate total income and exprenses
    calculateTotal('exp');
    calculateTotal('inc');
    //calculate budget
    data.budget = data.totals.inc - data.totals.exp;
    //calculate percentage
    if(data.totals.inc > data.totals.exp)
    data.percentage = Math.round(data.totals.exp/data.totals.inc*100);

    },

    calculatePercentages: function(){
      data.allItems.exp.forEach(function(current){
        current.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function(){
       var allPerc = data.allItems.exp.map(function(curr){
            return curr.getPercentage;
       });
       return allPerc;
    },

    testing: function(){
      console.log(data);
    },

    getbudget: function(){
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    }
  };




})();

//UI Controller
var UIController = (function(){

    var DomStrings  = {

    	inputType: '.add__type',
    	inputDesc: '.add__description',
    	inputValue: '.add__value',
    	inputBtn: '.add__btn',
      incomeContainer: '.income__list',
      expenseContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expenseLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage',
      container: '.container',
      expensesPercLabel: '.item__percentage'
    };

   return {
   	  getInput: function(){

   	  	return{
         type: document.querySelector(DomStrings.inputType).value,
         desc: document.querySelector(DomStrings.inputDesc).value,
         value: parseFloat(document.querySelector(DomStrings.inputValue).value)

   	  	};
         
   	  },

      addListItem: function(obj, type)
      {
         var html, newHtml, element;
         console.log('obj is: ', obj);
         console.log(type);
         if(type === 'inc')
         {
            element = DomStrings.incomeContainer;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         }else if(type === 'exp')
         {
           element = DomStrings.expenseContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }
         
         newHtml = html.replace('%id%', obj.id);
         newHtml = newHtml.replace('%desc%', obj.description);
         newHtml = newHtml.replace('%value%', obj.value);
         // console.log(element);
         // console.log(newHtml);
         document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      },
      
      deleteListItem: function(selectorID){
          var ele = document.getElementById(selectorID);
          console.log(ele);
          ele.parentNode.removeChild(ele);
      },

      clearFields: function(){
          var fields = document.querySelectorAll(DomStrings.inputDesc + ',' + 
            DomStrings.inputValue
            );
          //console.log(fields);
          fieldsArr = Array.prototype.slice.call(fields);
          //console.log(fieldsArr);

          fieldsArr.forEach(function(current, index, array){
              current.value = "";
          });
          fieldsArr[0].focus();
      },
      displayPercentages: function(){
          var fields = document.querySelectorAll(DomStrings.expensesPercLabel);
          var nodeListforEach = function(list, callback){
            for (var i = 0; i < list.length; i++) {
              callback(list[i],i);
            }
          };
          nodeListforEach(fields, function(current, index){
             if(percentages[index] > 0)
              {
                current.textContent = percentages[index] + '%';
              } else {
                current.textContent = '---';
              }
          });
      },
   	  getDOMStrings: function(){
   	  	return DomStrings;
   	  },

      displayBudget: function(obj){
        document.querySelector(DomStrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DomStrings.incomeLabel).textContent = obj.totalInc;
        document.querySelector(DomStrings.expenseLabel).textContent = obj.totalExp;
        if(obj.percentage > 0)
        {
          document.querySelector(DomStrings.percentageLabel).textContent = obj.percentage + '%';

        }else{
          document.querySelector(DomStrings.percentageLabel).textContent = '---';
        }
      }
   };


})();

//Global App Controller
var Controller = (function(budgetCtrl, UICtrl){
    var setUpEventListeners = function(){
    	 var DOM = UICtrl.getDOMStrings();
    	  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);


   document.addEventListener('keypress', function(event){
    if(event.keyCode === 13){
       ctrlAddItem();
    }
   });
   

   document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

 };
   
 
  var updatebudget = function(){
    budgetCtrl.calculatebudget();
    var budget = budgetCtrl.getbudget();
    console.log(budget);
    UICtrl.displayBudget(budget);
  };
  
  var updatePercentages = function(){
      budgetCtrl.calculatePercentages();
      var percentages = budgetCtrl.getPercentages();
      UICtrl.displayPercentages(percentages);
  };

	var ctrlAddItem = function(){
        var input, newItem;
        input = UICtrl.getInput();
        //console.log(input.type);
        //console.log(input.desc);
        //console.log(input.value);
        if(input.desc!== "" && !isNaN(input.value) && input.value > 0){
          newItem = budgetCtrl.addItem(input.type, input.desc, input.value);
        console.log(newItem);
        UICtrl.addListItem(newItem, input.type);
        UICtrl.clearFields();
        //calculate and update budget
        updatebudget();
        updatePercentages();
        }
	};

  var ctrlDeleteItem = function(event){
      var itemID, splitID;
      itemID = event.target.parentNode.parentNode.parentNode.id;
      console.log(itemID);
      splitID = itemID.split('-');
      var type = splitID[0];
      var id = parseInt(splitID[1]);
      budgetCtrl.deleteItem(type,id);
      UICtrl.deleteListItem(itemID);
      updatebudget();
      updatePercentages();
  };
   
  return {
  	init: function(){
  		console.log('started');
  		setUpEventListeners();
      UICtrl.displayBudget({
        budget:0,
        totalInc: 0,
        totalExp:0,
        percentage:-1
      });
  	}
  };
   
})(budgetController, UIController); //passing the arguments here


Controller.init();