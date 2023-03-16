AFRAME.regiterComponent('create-markers',{
    init:async function(){
        var mainScene=document.querySelector("#main-scene");
        //get dishes collection from firestore database
        var dishes=await this.getDishes();
        dishes.map(dish=>{
            var marker=document.createElement("a-marker");
            marker.setAttribute("id",dish.id);
            marker.setAttribute("type","pattern") ;
            marker.setAttribute("url",dish.marker_patter_url ) ;
            marker.setAttribute("cursor",{rayOrigin : "mouse"})   ;   

        });
// set marker handler component
        marker.setAttribute("markerhandler",{});
        mainScene.appendChild(marker);
        ///today
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

        if(!dish.unavaiable_days.includes(days[todaysDay])){

        
        //today


        //add 3d model to scene
        var model=document.createElement('a-entity');
        model.setAttribute('id',`model-${dish.id}`);
        model.setAttribute("position",dish.model_geometry.position);
        model.setAttribute("rotation",dish.model_geometry.rotation);
        model.setAttribute("scale",dish.model_geometry.scale);
        model.setAttribute('gltf-model',`url(${dish.model_url})`);
        model.setAttribute("gesture-handler",{});
        marker.setAttribute("visible",false)
        marker.appendChild(model)
        //ingredient container
        var mainplane=document.createElement("a-plane");
        mainplane.setAttribute("id",`main-plane-${dish.id}`);
        mainplane.setAttribute("position",{x:0,y:0,z:0});
        mainplane.setAttribute("rotation",{x:-90,y:0,z:0});
        mainplane.setAttribute("width",1.7);
        mainplane.setAttribute("height",1.5);
        mainplane.setAttribute("visible",false)
        marker.appendChild(mainplane);

        //dish  title bg plane
        var titleplane=document.createElement('a-plane');
        titleplane.setAttribute("id",`title-plane-${dish.id}`);
        titleplane.setAttribute("position",{x:0,y:0.89,z:0.03});
        titleplane.setAttribute("rotation",{x:0,y:0,z:0});
        titleplane.setAttribute("width",1.69);
        titleplane.setAttribute("height",0.3);
        titleplane.setAttribute("material",{color:"green"});
        titleplane.setAttribute("visible",false)
        mainplane.appendChild(titleplane);
        //dish title
        var dishtitle=document.createElement('a-entity');

        dishtitle.setAttribute("id",`dish-title-${dish.id}`);
        dishtitle.setAttribute("position",{x:0,y:0,z:0.1});
        dishtitle.setAttribute("rotation",{x:0,y:0,z:0});
        dishtitle.setAttribute("text",{
            font:"monoid",
            color:"black",
            width:1.8,
            height:1,
            align:"center",
            value:dish.dish_name.toUpperCase()
        });
        dishtitle.setAttribute("visible",false)
        titleplane.appendChild(dishtitle);

        ///Ingredient list

        var ingredients=document.createElement('a-entity');
        ingredients.setAttribute("id",`ingredients-${dish.id}`);
        ingredients.setAttribute("position",{x:0.3,y:0,z:0.1});
        ingredients.setAttribute("rotation",{x:0,y:0,z:0});
        ingredients.setAttribute("text",{
            font:"monoid",
            color:"black",
            width:2,
            height:1,
            align:"right",
            value:`${dish.ingredients.join("\n\n ")}`
        });
        ingredients.setAttribute("visible",false)
        mainplane.appendChild(ingredients);
// plane to show price;
var price_p=document.createElement('a-image');
price_p.setAttribute("id",`price-plane-${dish.id}`);
price_p.setAttribute("src","https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png");
price_p.setAttribute("width",0.8);
price_p.setAttribute("height",0.8) ;
price_p.setAttribute("position",{x:-1.3,y:0,z:0.3});
price_p.setAttribute("rotation",{x:-90,y:0,z:0});
price_p.setAttribute("visible",false)
// price dish
var price=document.createElement('a-entity')
price.setAttribute("id",`price-${dish.id}`)
price.setAttribute("position",{x:0.03,y:0.05,z:0.1})
price.setAttribute("rotation",{x:0,y:0,z:0})
price.setAttribute("text",{
    font: "mozillavr",
    color: "white",
    width: 3,
    align: "center",
    value: `Only\n $${dish.price}`
});
price.setAttribute("visible",false)
price_p.appendChild(price)
marker.appendChild(price_p)
    }
    },

    
    getDishes:async function(){
        return await firebase
            .firestore()
            .collection("dishes")
            .get()
            .then(snap=>{
                return snap.docs.map(doc=>doc.data());
            })


    }


})