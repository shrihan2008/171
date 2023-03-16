var table_no=null

AFRAME.registerComponent('marker-handler',{
     init:async function(){
      
        if(table_no==null){
            this.askTableno()
        }  
        var dishes=await this.getDishes()
        

        this.el.addEventListener("markerFound",()=>{
           var marker_id=this.el.id
           this.handleMarkerFound(dishes,marker_id);
        });

     this.el.addEventListener("markerLost",()=>{
     
        this.handleMarkerLost();
     })   ;
    },
askTableno:function(){
    var icon_url="https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png"

    swal({
        title:"WELCOME TO HUNGER",
        icon:icon_url,
        content:{
            element:"input",
            attributes:{
                placeholder:"Enter shop No",
                type:"number",
                min:1,
            
            }

        },
        closeOnClickOutside:false,

    })    .then(inputValue=>{
            table_no=inputValue
            
    })
    
    
}
,
    handleMarkerFound:function(dishes,marker_id){
        var todaysDate = new Date();
        var todaysDay = todaysDate.getDay();
        // Sunday - Saturday : 0 - 6
        var days = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday"
        ];



        var dish=dishes.filter(dish=>dish.id===marker_id)[0]
        if(dish.unavailabe_days.includes(days)[todaysDay]){
            
            swal({
                title:dish.dish_name.toUpperCase(),
                icon:"warning",
                text:"this dish is not avaliable today",
                timer:2550,
                buttons:false
            });
    }
    else{
        var model=document.querySelector(`#model-${dish.id}`)
        model.setAttribute("position",dish.model_geometry.position)
        model.setAttribute("rotation",dish.model_geometry.rotation)
        model.setAttribute("scale",dish.model_geometry.scale)
        model.setAttribute("visible",true)

        var ingredient_container=document.querySelector(`#main-plane-${dish.id}`)
        ingredient_container.setAttribute("visible",true)

        var price_p=document.querySelector(`#price-plane-${dish.id}`)
        price_p.setAttribute("visible",true)

        
    
      

        var buttonDiv=document.getElementById('button-div')
        buttonDiv.style.display="flex"
        var ratingButton=document.getElementById("rating-button")
        var orderButton=document.getElementById("order-button")

        if(table_no!=null){

           
        ratingButton.addEventListener('click',function(){
            swal({
                title:"Rate dish",
                icon:"warning",
                text:"wip",


            });
        });

        orderButton.addEventListener('click',function(){
            swal({
                title:"order found",
                icon:"https://imgur.com/4NZ6uLY",
                text:"served soon"
            })
        })
    } 
    }
    },

    handleMarkerLost:function(){
        var buttonDiv=document.getElementById("button-div")
        buttonDiv.style.display="none"
    },

    handleOrder: function (tNumber, dish) {
        // Reading current table order details
        firebase
          .firestore()
          .collection("tables")
          .doc(tNumber)
          .get()
          .then(doc => {
            var details = doc.data();
    
            if (details["current_orders"][dish.id]) {
              // Increasing Current Quantity
              details["current_orders"][dish.id]["quantity"] += 1;
    
              //Calculating Subtotal of item
              var currentQuantity = details["current_orders"][dish.id]["quantity"];
    
              details["current_orders"][dish.id]["subtotal"] =
                currentQuantity * dish.price;
            } else {
              details["current_orders"][dish.id] = {
                item: dish.dish_name,
                price: dish.price,
                quantity: 1,
                subtotal: dish.price * 1
              };
            }
    
            details.total_bill += dish.price;
    
            //Updating db
            firebase
              .firestore()
              .collection("tables")
              .doc(doc.id)
              .update(details);
          });
      },

      getDishes: async function () {
        return await firebase
          .firestore()
          .collection("dishes")
          .get()
          .then(snap => {
            return snap.docs.map(doc => doc.data());
          });
      },
})