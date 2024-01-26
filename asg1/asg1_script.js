/* I declare that the lab work here submitted is original except for source material explicitly acknowledged, 
    and that the same or closely related material has not been previously submitted for another course. 
    I also acknowledge that I am aware of University policy and regulations on honesty in academic work, 
    and of the disciplinary guidelines and procedures applicable to breaches of such policy and regulations, 
    as contained in the website. University Guideline on Academic Honesty: https://www.cuhk.edu.hk/policy/academichonesty/ 
    Student Name : YUAN Lin Student ID : 1155141399 Class/Section : CSCI2720 Date : Oct 14, 2023 -->
*/


//hide show 
function hideshow() {
    var x = document.getElementById("extrabar");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    var y = document.getElementById("hideshowbutton");
    if(y.innerHTML == "Hide"){
        y.innerHTML = "Show";
    } else{
        y.innerHTML = "Hide";
    }


  }



//task 1
function task1(){
let y = document.getElementById("task1column");
if (y.classList.contains("text-start")) {
    y.classList.remove("text-start");
    y.classList.add("text-center");
} else if (y.classList.contains("text-center")) {
    y.classList.remove("text-center");
    y.classList.add("text-end");
} else if (y.classList.contains("text-end")) {
    y.classList.remove("text-end");
    y.classList.add("text-start");
}
}


//task2
function task2() {
    const newtext = prompt("Please enter a spotlight of Paabo:");

    if (newtext !== null && newtext.trim() !== "") {
        const newItem = document.createElement("li");
        newItem.textContent = newtext;

        const group = document.getElementById("spotlight");
        group.appendChild(newItem);
    }
}


//task3
function task3() {
    const progress = document.getElementById("task3progressbar");
    if (progress.style.display === "block") {
        progress.style.display = "none";
    } else if (progress.style.display === "none") {
        progress.style.display = "block";
    }
    const progress2 = document.getElementById("progresscontainer");
    if (progress2.style.display === "block") {
        progress2.style.display = "none";
    } else if (progress2.style.display === "none") {
        progress2.style.display = "block";
    }
}

window.onscroll = function() {scrollupdate()};

function scrollupdate() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  var roundup = Math.round(scrolled);
  document.getElementById("task3progressbar").style.width = scrolled + "%";
  document.getElementById("task3progressbar").innerText = roundup + "%";
}




//Problem 4
function processform() {
    // set up a new element
    let newComment = document.createElement("div");
    let element = '<div><svg height="100" width="100"><circle cx="50" cy="50" r="40"></svg></div><div><h5></h5><p></p></div>';
    newComment.innerHTML = element;

    // set the classes of the div and its children div's
    newComment.className = "d-flex";
    newComment.querySelectorAll("div")[0].className = "flex-shrink-0"; // 1st div
    newComment.querySelectorAll("div")[1].className = "flex-grow-1"; // 2nd div


    // change contents <h5> and <p> according to form input with id
    newComment.querySelector("h5").innerHTML = document.querySelector("#new-email").value;
    newComment.querySelector("p").innerHTML = document.querySelector("#new-comment").value;

    // get the color choice from the radio buttons
    let color = document.querySelectorAll("input[name=new-color]:checked")[0].value;

    // change the fill color of the SVG circle
    newComment.querySelector("circle").setAttribute("fill", color);

    // append it to the div #comments
    document.querySelector("#comments").appendChild(newComment);

    // reset the form to clear the contents
    document.querySelector("form").reset();
}



function processtheform(){
    // check input valid or not
    let checkemail = document.querySelector("#new-email").value;
    let checkcomm = document.querySelector("#new-comment").value;
    if(validate(checkemail, checkcomm)==true){
        savetojson();
        processform();
        //save into json here
    }
    else{
        window.alert("Invalid/empty input for email address or comment! Please revise your input and submit again!");
    }

}


document.addEventListener("DOMContentLoaded", function() {

    const localJsonFile = "./local.json";


    fetch(localJsonFile)
    .then((response) => response.json()) 
    .then((data) => {
      //console.log(data); 
      data.forEach((eachobj) => {
        loadelement(eachobj); 
      })
    })
    .catch(error => {console.error('Error loading data:', error);})
//    })
})




  function validate(emailinput, commentinput) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ; 
    if(regex.test(emailinput) && (commentinput !== null && commentinput.trim() !== "")){
        return true;
    };
    return false;
  }

  function loadelement(obj){
    let newComment = document.createElement("div");
    let element = '<div><svg height="100" width="100"><circle cx="50" cy="50" r="40"></svg></div><div><h5></h5><p></p></div>';
    newComment.innerHTML = element;

    // set the classes of the div and its children div's
    newComment.className = "d-flex";
    newComment.querySelectorAll("div")[0].className = "flex-shrink-0"; // 1st div
    newComment.querySelectorAll("div")[1].className = "flex-grow-1"; // 2nd div


    // change contents <h5> and <p> according to form input with id
    newComment.querySelector("h5").innerHTML = obj.email;
    newComment.querySelector("p").innerHTML = obj.comment;

    // get the color choice from the radio buttons
    let color = obj.color;

    // change the fill color of the SVG circle
    newComment.querySelector("circle").setAttribute("fill", color);

    // append it to the div #comments
    document.querySelector("#comments").appendChild(newComment);

    // reset the form to clear the contents


  }


  function savetojson(){
    const newCommentObj = {
        email: document.querySelector("#new-email").value,
        color: document.querySelectorAll("input[name=new-color]:checked")[0].value,
        comment: document.querySelector("#new-comment").value};

    const localJsonFile = "./local.json";


    fetch(localJsonFile)
    .then((response) => response.json()) 
    .then((data) => {
        data.push(newCommentObj);
        const updatedDataJSON = JSON.stringify(data, null, 2); // The second argument is for formatting (2 spaces)
    //    console.log(updatedDataJSON);
        fetch("./local.json", {
            method:"PUT",
            body: updatedDataJSON
          });
    })
    .catch(error => {console.error('Error: ', error);});

    
  }


