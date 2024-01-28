let Meals= document.getElementById("Meals")
let SearchContainer= document.getElementById("SearchContainer")
let ContactUs = document.getElementById("contact-us")
let loadingContainer = document.getElementById("loadingContainer")
$(document).ready(()=>{
    searchByName(' ').then(()=>{
        $(".loading-screen").fadeOut(500)
        $("body").css("overflow","visible")
    })
})
function firstReload(){
    SearchContainer.innerHTML = "";
    searchByName(' ')
    ContactUs.classList.replace("d-flex", "d-none");
    Meals.classList.replace("d-none", "d-flex");
    loadingContainer.classList.replace("d-none", "d-block");
    $(".inner-loading-screen").fadeOut(300)
}

function showContactUs(){
  SearchContainer.innerHTML ='';
  Meals.classList.replace("d-flex", "d-none");
  loadingContainer.classList.replace("d-block", "d-none");
  ContactUs.classList.replace("d-none", "d-flex");
  closeSidebar();
}

function openSidebar(){
    $(".Sidebar").animate({left:"0px"},500)
    $(".Sidebar i.open-close-icon").addClass("fa-x")
    $(".Sidebar i.open-close-icon").removeClass("fa-align-justify")
    for(let i =0 ; i<5 ; i++){
        $(".Sidebar .Links li").eq(i).animate({top:0},(i+5)*200)
    }
}
function closeSidebar(){
    let boxWidth = $(".Main-header").outerWidth()
    $(".Sidebar").animate({left:-boxWidth},500)
    $(".Sidebar i.open-close-icon").removeClass("fa-x")
    $(".Sidebar i.open-close-icon").addClass("fa-align-justify")
    $(".Sidebar .Links li").animate({top:300},500)
}
closeSidebar();
$(".Sidebar i.open-close-icon").click(()=>{
    if($(".Sidebar").css("left") == "0px"){
        closeSidebar();
    }
    else{
        openSidebar();
    }
})

//Search
async function searchByName(value){
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`);
    response = await response.json();
    response.meals? displayMeals(response.meals): displayMeals([]);
    closeSidebar();
    $(".inner-loading-screen").fadeOut(300)
}
async function searchByFirstLetter(value){
    $(".inner-loading-screen").fadeIn(300)

    value == ""? value = 'a' : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${value}`);
    response = await response.json();
    response.meals? displayMeals(response.meals): displayMeals([]);
    closeSidebar();
    $(".inner-loading-screen").fadeOut(300)

}
function showSearchInputs(){
    ContactUs.classList.replace("d-flex", "d-none");
    Meals.classList.replace("d-none", "d-flex");
    loadingContainer.classList.replace("d-none", "d-block");
    SearchContainer.innerHTML = `
        <div class="row ps-5 py-5">
            <div class="col-md-6">
                <input onkeyup="searchByName(this.value)" class="form-control  border-top-0 border-start-0 border-end-0 " type="text" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input onkeyup="searchByFirstLetter(this.value)" maxlength="1" class="form-control  border-top-0 border-start-0 border-end-0 " type="text" placeholder="Search By First Litter...">
            </div>
        </div>
    `
    Meals.innerHTML = '';
    closeSidebar();
}
//

//Meals
function displayMeals(array){
    const mealsHTML = array.slice(0,20).map((item)=>(`
        <div class="col-xl-3 col-lg-6">
            <div onclick="getMealDetails('${item.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${item.strMealThumb}" alt="">
                <div class="meal-layer p-2 position-absolute d-flex align-items-center text-black">
                    <h3>${item.strMeal}</h3>
                </div>
            </div>
        </div> 
    `)).join("");
    Meals.innerHTML = mealsHTML;
    window.scrollTo(0, 0);
}
async function getMealDetails(mealID){
    $(".inner-loading-screen").fadeIn(300)
    ContactUs.classList.replace("d-flex", "d-none");
    Meals.classList.replace("d-none", "d-flex");
    loadingContainer.classList.replace("d-none", "d-block");
    SearchContainer.innerHTML = "";
    
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    response = await response.json();
    displayMealDetails(response.meals[0]);
    closeSidebar();
    $(".inner-loading-screen").fadeOut(300)
}
function displayMealDetails(meal){
    let ingredients = ``
    for(let i =0 ; i<=20 ; i++){
        if(meal[`strIngredient${i}`]){
            ingredients+= `<li class="my-3 mx-1 p-1 alert-success bg-white rounded text-black">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags?.split(",")
    if(!tags) tags=[]
    let tagsStr = ''
    console.log(tags);
    for(let i =0 ; i< tags.length ; i++){
        tagsStr+= `<li class="my-3 mx-1 p-1 alert-success bg-white text-black rounded">${tags[i]}</li>`
    }
    const mealsHTML = `
    <div class="col-md-4">
      <img class="w-100" src="${meal.strMealThumb}" alt="">
      <h2 class="text-center">${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
      <h2>Instructions</h2>
      <p class="lh-sm">${meal.strInstructions}</p>
      <h5>Areas : <span>${meal.strArea}</span></h5>
      <h5>Category : <span>${meal.strCategory}</span></h5>
      <h5>Recipes : <br>
        <div>
          <ul class="d-flex lh-1 flex-wrap list-unstyled">
            ${ingredients}
          </ul>
        </div>
      </h5>
      ${tagsStr?
        `<h5>Tags : <br>
        <ul class="d-flex lh-1 flex-wrap list-unstyled">
          ${tagsStr}
        </ul>
      </h5>`
        :''}

      <a class="btn btn-success text-white" target="_blank" href="${meal.strSource}">Source</a>
      <a class="btn btn-danger text-white" target="_blank" href="${meal.strYoutube}">Youtube</a>
    </div>
    `;
    Meals.innerHTML = mealsHTML;
    window.scrollTo(0, 0);
}
//

//Category
async function getCategories(){
    $(".inner-loading-screen").fadeIn(300)
    ContactUs.classList.replace("d-flex", "d-none");
    Meals.classList.replace("d-none", "d-flex");
    loadingContainer.classList.replace("d-none", "d-block");
    SearchContainer.innerHTML = "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    response = await response.json();
    displayCategories(response.categories);
    closeSidebar();
    $(".inner-loading-screen").fadeOut(300)
}
function displayCategories(array){
    const mealsHTML = array.map((item)=>(`
        <div class="col-xl-3 col-lg-6">
            <div onclick="getCategoryMeals('${item.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${item.strCategoryThumb}" alt="">
                <div class="meal-layer p-2 position-absolute text-center text-black">
                    <h3>${item.strCategory}</h3>
                    <p>${item.strCategoryDescription.split(' ').slice(0,21).join(" ")}<p/>
                </div>
            </div>
        </div> 
    `)).join("");
    Meals.innerHTML = mealsHTML;
}
async function getCategoryMeals(category){
  $(".inner-loading-screen").fadeIn(300)
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  response = await response.json();
  displayMeals(response.meals.slice(0,20));
  closeSidebar();
  $(".inner-loading-screen").fadeOut(300)
}
//

//Area
async function getArea(){
    $(".inner-loading-screen").fadeIn(300)
    ContactUs.classList.replace("d-flex", "d-none");
    Meals.classList.replace("d-none", "d-flex");
    loadingContainer.classList.replace("d-none", "d-block");
    SearchContainer.innerHTML = "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    response = await response.json();
    displayArea(response.meals);
    closeSidebar();
    $(".inner-loading-screen").fadeOut(300)
}
function displayArea(array){
    const mealsHTML = array.map((item)=>(`
        <div class="col-xl-3 col-lg-6">
            <div onclick="getAreaMeals('${item.strArea}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-city fa-3x text-danger"></i>
                <h3>${item.strArea}</h3>
            </div>
        </div> 
    `)).join("");
    Meals.innerHTML = mealsHTML;
}
async function getAreaMeals(area){
  $(".inner-loading-screen").fadeIn(300)

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  response = await response.json();
  displayMeals(response.meals.slice(0,20));
  closeSidebar();
  $(".inner-loading-screen").fadeOut(300)
}
//

//Ingredient
async function getIngredient(){
    $(".inner-loading-screen").fadeIn(300)
    ContactUs.classList.replace("d-flex", "d-none");
    Meals.classList.replace("d-none", "d-flex");
    loadingContainer.classList.replace("d-none", "d-block");
    SearchContainer.innerHTML = "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    response = await response.json();
    displayIngredient(response.meals.slice(0,25));
    closeSidebar();
    $(".inner-loading-screen").fadeOut(300)
}
function displayIngredient(array){
    const mealsHTML = array.map((item)=>(`
        <div class="col-xl-3 col-lg-6">
            <div onclick="getIngredientMeals('${item.strIngredient}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-bowl-food fa-3x green-color"></i>
                <h3>${item.strIngredient}</h3>
                <p>${item.strDescription.split(' ').slice(0,21).join(" ")}<p/>
            </div>
        </div> 
    `)).join("");
    Meals.innerHTML = mealsHTML;
}
async function getIngredientMeals(ingredient){
    $(".inner-loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    response = await response.json();
    displayMeals(response.meals.slice(0,20));
    closeSidebar();
    $(".inner-loading-screen").fadeOut(300)
}
//






(userName = document.getElementById("name")),
(userEmail = document.getElementById("email")),
(userPhone = document.getElementById("phone")),
(userAge = document.getElementById("age")),
(userPassword = document.getElementById("password")),
(userRePassword = document.getElementById("rePassword")),
(userNameAlert = document.getElementById("namealert")),
(userEmailAlert = document.getElementById("emailalert")),
(userPhoneAlert = document.getElementById("phonealert")),
(userAgeAlert = document.getElementById("agealert")),
(userpasswordAlert = document.getElementById("passwordalert")),
(userRepasswordAlert = document.getElementById("repasswordalert"));

userName.addEventListener("focus", () => {
  nameToached = true;
});
userEmail.addEventListener("focus", () => {
  emailToached = true;
});
userPhone.addEventListener("focus", () => {
  phoneToached = true;
});
userAge.addEventListener("focus", () => {
  ageToached = true;
});
userPassword.addEventListener("focus", () => {
  passwordToached = true;
});
userRePassword.addEventListener("focus", () => {
  repasswordToached = true;
});

let nameToached = false,
  emailToached = false,
  phoneToached = false,
  ageToached = false,
  passwordToached = false,
  repasswordToached = false;

function validation() {
  if (nameToached) {
    if (userNameValid()) {
      userName.classList.remove("is-invalid");
      userName.classList.add("is-valid");
      userNameAlert.classList.replace("d-block", "d-none");
      userNameAlert.classList.replace("d-block", "d-none");
    } else {
      userName.classList.replace("is-valid", "is-invalid");
      userNameAlert.classList.replace("d-none", "d-block");
    }
  }

  if (emailToached) {
    if (userEmailValid()) {
      userEmail.classList.remove("is-invalid");
      userEmail.classList.add("is-valid");
      userEmailAlert.classList.replace("d-block", "d-none");
      userEmailAlert.classList.replace("d-block", "d-none");
    } else {
      userEmail.classList.replace("is-valid", "is-invalid");
      userEmailAlert.classList.replace("d-none", "d-block");
    }
  }

  if (phoneToached) {
    if (userPhoneValid()) {
      userPhone.classList.remove("is-invalid");
      userPhone.classList.add("is-valid");
      userPhoneAlert.classList.replace("d-block", "d-none");
      userPhoneAlert.classList.replace("d-block", "d-none");
    } else {
      userPhone.classList.replace("is-valid", "is-invalid");
      userPhoneAlert.classList.replace("d-none", "d-block");
    }
  }

  if (ageToached) {
    if (userAgeValid()) {
      userAge.classList.remove("is-invalid");
      userAge.classList.add("is-valid");
      userAgeAlert.classList.replace("d-block", "d-none");
      userAgeAlert.classList.replace("d-block", "d-none");
    } else {
      userAge.classList.replace("is-valid", "is-invalid");
      userAgeAlert.classList.replace("d-none", "d-block");
    }
  }

  if (passwordToached) {
    if (userPasswordValid()) {
      userPassword.classList.remove("is-invalid");
      userPassword.classList.add("is-valid");
      userpasswordAlert.classList.replace("d-block", "d-none");
      userpasswordAlert.classList.replace("d-block", "d-none");
    } else {
      userPassword.classList.replace("is-valid", "is-invalid");
      userpasswordAlert.classList.replace("d-none", "d-block");
    }
  }

  if (repasswordToached) {
    if (userRePasswordValid()) {
      userRePassword.classList.remove("is-invalid");
      userRePassword.classList.add("is-valid");
      userRepasswordAlert.classList.replace("d-block", "d-none");
      userRepasswordAlert.classList.replace("d-block", "d-none");
    } else {
      userRePassword.classList.replace("is-valid", "is-invalid");
      userRepasswordAlert.classList.replace("d-none", "d-block");
    }
  }

  if (
    userNameValid() &&
    userEmailValid() &&
    userPhoneValid() &&
    userAgeValid() &&
    userPasswordValid() &&
    userRePasswordValid()
  ) {
    document.getElementById("submitBtn").removeAttribute("disabled");
  } else {
    document.getElementById("submitBtn").setAttribute("disabled", "true");
  }
}

function userNameValid() {
  return /^[a-zA-Z ]+$/.test(userName.value);
}

function userEmailValid() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    userEmail.value
  );
}

function userPhoneValid() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    userPhone.value
  );
}

function userAgeValid() {
  return /^[1-9][0-9]?$|^100$/.test(userAge.value);
}

function userPasswordValid() {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(userPassword.value);
}

function userRePasswordValid() {
  return userPassword.value == userRePassword.value;
}
