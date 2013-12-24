//Leslie Ducray C10327999 - 16/12/2013
Bands = new Meteor.Collection("bands");



if (Meteor.isClient) {
  //Populates bands list applying search filters and sorts in order of descending 'score' and 'name'.
  Template.bandList.bands = function () {
    return Bands.find({tags: {$regex: Session.get("search_query")}, name: {$regex: Session.get("search_band")}},{sort: {score: -1, name: 1}});//.sort({score:-1});
    
  };
  //set the page taline/header 
  Template.loginDetails.tagline = function () {
    return "Bands and Tags";
  };
  // for the selected band, return the band name to template 'BandList'
  Template.bandList.selected_name = function () {
    var band = Bands.findOne(Session.get("selected_band"));
    return band && band.name ;
  };
  

  // detects whethere the user has seen the select band. if so, they can not vote up the band again.
  Template.bandList.selected_seen = function () {
    var band = Bands.findOne(Session.get("selected_band"));
    var user= Meteor.user().profile.name;
    var selected_seen = band.users.match(user);
    return selected_seen ;
  };

  //sets the selected variable for use in the list of bands. this is used for changing values
  //of the selected record
  Template.band.selected = function () {
    return Session.equals("selected_band", this._id) ? "selected" : '';
  };

  //Updated the count on the band recorded, incrememnting by 1 each time the band is 'seen live'
  // the cuurent user is added to the list of users that have seen the band.
  Template.bandList.events(
  {
      'click input.inc': function () 
      {
        Bands.update(Session.get("selected_band"), {$inc: {score: 1}});// increment score by 1
        var old  = Bands.findOne(Session.get("selected_band"));
        // a list of the current users associated to the band 
        //(user's who have seen the band) are concatenated with the new username.
        if(Meteor.user())
        {
          var new_username = Meteor.user().profile.name;
          Bands.update(Session.get("selected_band"), {$set: {users:old.users+" . "+new_username}});//concatanate new username to the current list
        }
    
      }
    });

    //Add a tag to the selected band
    Template.bandList.events({
    'click input.add': function () {
      var new_tag_name = document.getElementById("new_tag_name").value; //get tag name
      var old  = Bands.findOne(Session.get("selected_band"));// get current list of asscoiated tags
      if(new_tag_name.length !== 0)
      {  
        Bands.update(Session.get("selected_band"), {$set: {tags: old.tags+" . "+new_tag_name}});//concatenate new tag to old tags
        document.getElementById("new_tag_name").value ="";
        alert(new_tag_name+" Added to "+ old.name);
      }
      else
      {
          alert("You must enter in something!");//validation
      }
    }
  });


    // for searching by tag, filters band list
   Template.bandList.events({
    'keyup .search': function () {
        Session.set("search_query",$(".search").val());
       
    }
    
  });
   // for searching by band, filters band list
   Template.bandList.events({
    'keyup .searchB': function () {
        Session.set("search_band",$(".searchB").val());
       
    }
    
  });

   // when a band is clicked, set as 'selected_band'
  Template.band.events({
    'click': function () {
      Session.set("selected_band", this._id);
    }

  });

// function to hide/show associated users for select band
  Template.band.events({
    'click input.show' : function(){
        var elements = document.getElementsByClassName('usersdiv');
        for ( var i =0; i<elements.length; i++)
        {
          if(elements[i].style.display == 'block')
          {
            elements[i].style.display ='none';
          }
          else
          {
            elements[i].style.display ='block';
          }

        }

        

      }

  });

//add a new band 
  Template.new_band.events ={
    'click input.add': function(){
      var new_band_name = document.getElementById("new_band_name").value;//get band name
      
      if(new_band_name.length != 0) //validation
      { 
          //insert new band and clear dom element
          Bands.insert({name: new_band_name, tags:"" ,score:0,  users:""});
          document.getElementById("new_band_name").value = "";
          alert(new_band_name+" added");

      }
      else
      {
          alert("You must enter in something!");
      }
    }
  };

 
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

    
  });
}
// 3rd party javascript - Google login callback
function signinCallback(authResult) {
  if (authResult['status']['signed_in']) {
    // Update the app to reflect a signed in user
    
    // Hide the sign-in button now that the user is authorized, for example:
    document.getElementById('signinButton').setAttribute('style', 'display: none');
  } else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    console.log('Sign-in state: ' + authResult['error']);
  }
}
