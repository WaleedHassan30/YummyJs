class LoadingIndicator {
  constructor() {
    this.$element = $('#loading');
  }

  show() {
    this.$element.fadeIn();
    $('body').css('overflow', 'hidden');
  }

  hide() {
    this.$element.fadeOut();
    $('body').css('overflow', 'visible');
    $('body').css('overflow-x', 'hidden');
  }
}

class Navigation {
  constructor() {
    this.$element = $('#navigation');
  }

  initialize() {
    const w = this.$element.innerWidth();
    this.$element.animate({ left: `-${w}` });

    $('#navCtrl .navCtrlIcon').click((e) => {
      e.preventDefault();
      this.toggleNavigation();
    });
  }

  toggleNavigation() {
    if (this.$element.css('left') === '0px') {
      this.$element.animate({ left: `-${this.$element.innerWidth()}` }, 'slow');
      $('#navCtrl .navCtrlIcon').removeClass('fa-x').addClass('fa-bars');
      $('#navLinks ul').removeClass('show').addClass('hide');
    } else {
      this.$element.animate({ left: 0 }, 'slow');
      $('#navCtrl .navCtrlIcon').removeClass('fa-bars').addClass('fa-x');
      $('#navLinks ul').removeClass('hide').addClass('show');
    }
  }

  closeNav(element){


    $(element).click(()=>{

      if (this.$element.css('left') === '0px') {
        this.$element.animate({ left: `-${this.$element.innerWidth()}` }, 'slow');
        $('#navCtrl .navCtrlIcon').removeClass('fa-x').addClass('fa-bars');
        $('#navLinks ul').removeClass('show').addClass('hide');
      } else {
        return
      }

    })
  }
}

class MealAPI {
            async  getHome() {

                  // Create a new instance of the LoadingIndicator class
                  const showLoading = new LoadingIndicator();
                  const navigation = new Navigation()
                  navigation.closeNav("body")

                  // Show the loading indicator
                  showLoading.show();

                  // Make an HTTP GET request to the specified URL using the fetch API
                  const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s', { method: 'GET' });

                  // Parse the response as JSON
                  let data = await response.json();

                  // Hide the loading indicator
                  showLoading.hide();

                  // Call the displayMeals function and pass the retrieved data as an argument
                  displayMeals(data);

                  // -----------------------------------------------------------------

                  // Define the displayMeals function that takes the retrieved data as input
                  function displayMeals(data) {
                    // Remove the 'vh-100' class from the #contactForm element
                    $("#contactForm").removeClass('vh-100');

                    // Get the meals array from the data object
                    let meals = data.meals;

                    // Initialize an empty string to store the HTML content
                    let box = '';

                    // Iterate over each meal in the meals array
                    for (let i = 0; i < meals.length; i++) {
                      // Create a new HTML element with the meal details
                      box += `
                        <div id="${meals[i].idMeal}" class="itemStyle btn col-md-3 mb-4 position-relative">
                          <img id="${meals[i].idMeal}" class="w-100 rounded-3" src="${meals[i].strMealThumb}" alt="${meals[i].strMeal}">
                          <div id="${meals[i].idMeal}" class="infoStyle position-absolute h-100 d-flex align-items-center rounded-3 ps-2">
                            <h3 id="${meals[i].idMeal}">${meals[i].strMeal}</h3>
                          </div>
                        </div>
                      `;
                    }

                    // Update the HTML content of the #meals element with the generated box string
                    $('#meals').html(box);

                    // Clear the HTML content of the #mealInfo element
                    $('#mealInfo').html('');

                    // Clear the HTML content of the #Cat element
                    $('#Cat').html('');

                    // Clear the HTML content of the #areas element
                    $('#areas').html('');

                    // Clear the HTML content of the #Ing element
                    $('#Ing').html('');

                    // Clear the HTML content of the #contactForm element
                    $('#contactForm').html('');
                  }
  
              $(function () {
                    // Function to fetch and display a meal by its ID
                    async function getMeal(id) {
                      // Show loading indicator
                      showLoading.show();
                      
                      try {
                        // Fetch meal details using the provided ID
                        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
                        const data = await response.json();

                        // Hide loading indicator
                        showLoading.hide();
                        
                        // Display the meal details
                        showMeal(data.meals[0]);
                      } catch (error) {
                        console.error('Error fetching meal data:', error);
                      }
                    }

                    // Function to display meal details in the UI
                    function showMeal(data) {
                      // Hide loading element with ID 'loading'
                      $('#loading').fadeOut(600);
                      
                      // Set CSS styles for the body
                      $('body').css('overflow', 'visible');
                      $('body').css('overflow-x', 'hidden');
                      
                      // Remove a CSS class from an element with the ID 'contactForm'
                      $("#contactForm").removeClass('vh-100');

                      // Generate HTML content for displaying meal details
                      let box = `
                        <section id="mealInfo" class="d-flex ms-5 text-white pb-5">
                          <div id="mealImg" class="d-flex flex-column col-md-4">
                            <img src=${data.strMealThumb} alt="" class=" rounded-3">
                            <h2>${data.strMeal}</h2>
                          </div>
                          <div id="mealIns" class="col-md-7 h-50">
                            <h2>Instructions</h2>
                            <p>${data.strInstructions}</p>
                            <h3><span class="fw-bolder">Area : </span>${data.strArea}</h3>
                            <h3><span class="fw-bolder">Category : </span>${data.strCategory}</h3>
                            <h3>Recipes : </h3>
                            <ul id="receipes" class="d-flex flex-wrap">
                            </ul>
                            <h3>Tags :</h3> 
                            <a id="source" class="btn" href="${data.strSource}" target="_blank">Source</a>
                            <a id="youtube" class="btn" href="${data.strYoutube}" target="_blank">Youtube</a>
                          </div>
                        </section>`;

                      // Clear content of various HTML elements and update with new content
                      $('#meals').html('');
                      $('#mealInfo').html(box);
                      $('#searchBars').html('');
                      $('#Cat').html('');
                      $('#areas').html('');
                      $('#Ing').html('');
                      $('#contactForm').html('');

                      // Generate a list of recipes and add them to the UI
                      var ul = '';
                      for (var i = 1; i <= 20; i++) {
                        if (data[`strMeasure${i}`] && data[`strMeasure${i}`].trim() !== "") {
                          ul += `<li>${data[`strMeasure${i}`]}</li>`;
                        }
                      }

                      $('#receipes').html(ul);
                    }

                    // Event handler for clicking on meal elements
                    $('#meals').click(function (e) {
                      getMeal(e.target.id);
                    });

                    // Functions for fetching meals by full search and first letter search
                    async function getMealsByFullSearch(searched) {
                      showLoading.show();

                      try {
                        // Fetch meals based on a full search term
                        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searched}`);
                        const data = await response.json();

                        // Hide loading indicator
                        showLoading.hide();

                        // Display the fetched meals
                        displayMeals(data);
                      } catch (error) {
                        console.error('Error fetching meals by full search:', error);
                      }
                    }

                    async function getMealsByFirstLetter(searched) {
                      showLoading.show();

                      try {
                        // Fetch meals based on the first letter of the meal name
                        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searched}`);
                        const data = await response.json();

                        // Hide loading indicator
                        showLoading.hide();

                        // Display the fetched meals
                        displayMeals(data);
                      } catch (error) {
                        console.error('Error fetching meals by first letter:', error);
                      }
                    }

                    // ---------------------------------------------------------------
    
                        // Function to show search input fields
                        function showSearch() {
                          // Remove a CSS class from an element with the ID 'contactForm'
                          $("#contactForm").removeClass('vh-100');

                          // Create HTML content for search input fields
                          let box = `
                            <div class="d-flex justify-content-center">
                              <input id="searchByName" type="text" class="form-control m-4" placeholder="Search By Name">
                              <input id="searchByFL" type="text" class="form-control m-4" placeholder="Search By First Letter">
                            </div>`;

                          // Update the content of various HTML elements
                          $('#searchBars').html(box);
                          $('#meals').html('');
                          $('#Cat').html('');
                          $('#mealInfo').html('');
                          $('#areas').html('');
                          $('#Ing').html('');
                          $('#contactForm').html('');

                          // Attach input event handlers for search fields
                          $('#searchByName').on('input', () => {
                            const searchTerm = $('#searchByName').val();
                            getMealsByFullSearch(searchTerm);
                          });

                          $('#searchByFL').on('input', () => {
                            const searchTerm = $('#searchByFL').val();
                            getMealsByFirstLetter(searchTerm);
                          });
                        }

                        // Event handler for clicking the search button
                        $('#search').click(function (e) {
                          e.preventDefault();
                          showSearch();
                        });

                        // Function to fetch meal categories
                        async function getMealCategories() {
                          // Show loading indicator
                          showLoading.show();

                          try {
                            // Fetch meal categories
                            const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
                            const data = await response.json();

                            // Hide loading indicator
                            showLoading.hide();

                            // Display meal categories
                            displayCategories(data);
                          } catch (error) {
                            console.error('Error fetching meal categories:', error);
                          }
                        }

                        // Function to filter meals by category
                        async function filterMealsByCategory(category) {
                          // Show loading indicator
                          showLoading.show();

                          try {
                            // Fetch meals based on the selected category
                            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
                            const data = await response.json();

                            // Hide loading indicator
                            showLoading.hide();

                            // Display filtered meals
                            displayMeals(data);
                          } catch (error) {
                            console.error('Error fetching filtered meals:', error);
                          }
                        }

                        // Function to display meal categories in the UI
                        function displayCategories(data) {
                          // Remove a CSS class from an element with the ID 'contactForm'
                          $("#contactForm").removeClass('vh-100');

                          // Extract category data
                          let cat = data.categories;
                          let box = '';

                          // Generate HTML for displaying categories
                          for (let i = 0; i < cat.length; i++) {
                            box += `
                              <div id="${cat[i].strCategory}" class="itemStyle btn col-md-3 mb-4 position-relative">
                                <img id="${cat[i].strCategory}" class="w-100 rounded-3" src="${cat[i].strCategoryThumb}" alt="${cat[i].strCategory}">
                                <div id="${cat[i].strCategory}" class="infoStyle position-absolute h-100 d-flex flex-column align-items-center rounded-3 ps-2">
                                  <h3 id="${cat[i].strCategory}">${cat[i].strCategory}</h3>
                                  <p id="${cat[i].strCategory}">${cat[i].strCategoryDescription}</p>
                                </div>
                              </div>`;
                          }

                          // Clear content of various HTML elements and update with new content
                          $('#meals').html('');
                          $('#mealInfo').html('');
                          $('#searchBars').html('');
                          $('#Cat').html(box);
                          $('#areas').html('');
                          $('#Ing').html('');
                          $('#contactForm').html('');
                        }

                        // Event handler for clicking on meal category elements
                        $('#Cat').click(function (e) {
                          filterMealsByCategory(e.target.id);
                        });

                        // Event handler for clicking on 'categories' button
                        $('#categories').click(function (e) {
                          e.preventDefault();
                          getMealCategories();
                        });




                // -----------------------------------------------
    
                        // Function to fetch areas
                        async function getAreas() {
                          // Show loading indicator
                          showLoading.show();

                          try {
                            // Fetch list of areas
                            const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
                            const data = await response.json();

                            // Hide loading indicator
                            showLoading.hide();

                            // Display areas
                            displayAreas(data);
                          } catch (error) {
                            console.error('Error fetching areas:', error);
                          }
                        }

                        // Function to display areas in the UI
                        function displayAreas(data) {
                          // Remove a CSS class from an element with the ID 'contactForm'
                          $("#contactForm").removeClass('vh-100');

                          // Extract area data
                          let areas = data.meals;
                          let box = '';

                          // Generate HTML for displaying areas
                          for (let i = 0; i < areas.length; i++) {
                            box += `
                              <div id="${areas[i].strArea}" class="text-white btn col-md-3 mb-4">
                                <i id="${areas[i].strArea}" class="fa-solid fa-house-laptop fa-4x w-100"></i>
                                <h3 id="${areas[i].strArea}">${areas[i].strArea}</h3>
                              </div>`;
                          }

                          // Clear content of various HTML elements and update with new content
                          $('#meals').html('');
                          $('#mealInfo').html('');
                          $('#searchBars').html('');
                          $('#Cat').html('');
                          $('#areas').html(box);
                          $('#Ing').html('');
                          $('#contactForm').html('');
                        }

                        // Event handler for clicking on 'area' button
                        $('#area').click(function (e) {
                          e.preventDefault();
                          getAreas();
                        });

                        // Function to fetch meals by area
                        async function getMealsByArea(area) {
                          // Show loading indicator
                          showLoading.show();

                          try {
                            // Construct the URL for fetching meals by area
                            const url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
                            const response = await fetch(url);
                            const data = await response.json();

                            // Hide loading indicator
                            showLoading.hide();

                            // Display filtered meals
                            displayMeals(data);
                          } catch (error) {
                            console.error('Error fetching meals by area:', error);
                          }
                        }

                        // Event handler for clicking on area elements
                        $('#areas').click(function (e) {
                          getMealsByArea(e.target.id);
                        });

                        // Function to fetch ingredients
                        async function getIngredients() {
                          // Show loading indicator
                          showLoading.show();

                          try {
                            // Fetch list of ingredients
                            const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
                            const data = await response.json();

                            // Hide loading indicator
                            showLoading.hide();

                            // Display ingredients
                            displayIngredients(data);
                          } catch (error) {
                            console.error('Error fetching ingredients:', error);
                          }
                        }

                        // Function to display ingredients in the UI
                        function displayIngredients(data) {
                          // Remove a CSS class from an element with the ID 'contactForm'
                          $("#contactForm").removeClass('vh-100');

                          // Extract ingredient data
                          let ingredients = data.meals;
                          let box = '';

                          // Generate HTML for displaying ingredients
                          for (let i = 0; i < 20; i++) {
                            box += `
                              <div id="${ingredients[i].strIngredient}" class="text-white btn col-md-3 mb-4 overflow-hidden">
                                <i id="${ingredients[i].strIngredient}" class="fa-solid fa-drumstick-bite fa-4x w-100"></i>
                                <h3 id="${ingredients[i].strIngredient}">${ingredients[i].strIngredient}</h3>
                                <p id="${ingredients[i].strIngredient}">${ingredients[i].strDescription.split(' ').slice(0, 20).join(' ')}</p>
                              </div>`;
                          }

                          // Clear content of various HTML elements and update with new content
                          $('#meals').html('');
                          $('#mealInfo').html('');
                          $('#searchBars').html('');
                          $('#Cat').html('');
                          $('#areas').html('');
                          $('#Ing').html(box);
                          $('#contactForm').html('');
                        }

                        // Event handler for clicking on 'ingredients' button
                        $('#ingredients').click(function (e) {
                          e.preventDefault();
                          getIngredients();
                        });




                // -------------------------------------------------------
    
                async function getMealsByIngrediant(mainIngrediant) {
                  showLoading.show()
                  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngrediant}`;
                  const response = await fetch(url);
                  const data = await response.json();
                  showLoading.hide()
                  displayMeals(data)
                }
    
                $('#Ing').click(function (e) {
                  getMealsByIngrediant(e.target.id)
                })
    
                function showForm() {
                  $("#contactForm").addClass('vh-100')
                  let box = '';
                  box += `<div class="col-md-6 d-flex justify-content-around p-lg-3 w-75">
    
                  <div class="mx-lg-3 w-50">
                    <input id="name" type="text" class="form-control " placeholder="Enter Your Name">
                    <div id="nameWarning" class="d-none warningBG warningColor justify-content-center p-3 mt-2 rounded-3">
                      Special characters and numbers not allowed
                    </div>
                  </div>
    
                  <div class="mx-lg-3 w-50">
                    <input id="email" type="text" class="form-control" placeholder="Enter Your Email">
                    <div id="emailWarning" class="d-none warningBG warningColor justify-content-center p-3 mt-2 rounded-3">
                      Email not valid *exemple@yyy.zzz
                    </div>
                  </div>
    
                </div>
    
    
    
                <div class="col-md-6 d-flex justify-content-around p-lg-3 w-75">
    
                  <div class="mx-lg-3 w-50">
                    <input id="phone" type="text" class="form-control " placeholder="Enter Your Phone">
                    <div id="phoneWarning" class="d-none warningBG warningColor justify-content-center p-3 mt-2 rounded-3">
                      Enter valid Phone Number
                    </div>
                  </div>
    
                  <div class="mx-lg-3 w-50">
                    <input id="age" type="number" class="form-control" placeholder="Enter Your Age">
                    <div id="ageWarning" class="d-none warningBG warningColor justify-content-center p-3 mt-2 rounded-3">
                      Enter valid age
                    </div>
                  </div>
    
                </div>
    
    
    
                <div class="col-md-6 d-flex justify-content-around p-lg-3 w-75">
    
                  <div class="mx-lg-3 w-50">
                    <input id="pass" type="password" class="form-control " placeholder="Enter Your Password">
                    <div id="passWarning" class="d-none warningBG warningColor justify-content-center p-3 mt-2 rounded-3">
                      Enter valid password *Minimum eight characters, at least one letter and one number:*
                    </div>
                  </div>
    
                  <div class="mx-lg-3 w-50">
                    <input id="repass" type="password" class="form-control" placeholder="Repassword">
                    <div id="repassWarning" class="d-none warningBG warningColor justify-content-center p-3 mt-2 rounded-3">
                      Enter valid repassword
                    </div>
                  </div>
    
                </div>
    
    
                <button id="formSubmitBtn" class="btn" disabled>Submit</button> 
                `
    
    
                  $('#meals').html('');
                  $('#mealInfo').html('')
                  $('#searchBars').html('');
                  $('#Cat').html('')
                  $('#areas').html('')
                  $('#Ing').html('')
                  $('#contactForm').html(box)
    
                  let nameRegFlag = false, emailRegFlag = false, ageRegFlag = false, phoneRegFlag = false, passRegFlag = false, repassRegFlag = false;
    
                  $('#name').on('input', () => {
                    const searchTerm = $('#name').val();
                    if (nameRegex(searchTerm)) {
                      nameRegFlag = true
                      $('#nameWarning').removeClass('d-flex')
                      $('#nameWarning').addClass('d-none')
                    }
                    else {
                      nameRegFlag = false
                      $('#nameWarning').removeClass('d-none')
                      $('#nameWarning').addClass('d-flex')
                    }
    
                    if (nameRegFlag && emailRegFlag && ageRegFlag && phoneRegFlag && passRegFlag && repassRegFlag) {
                      $('#formSubmitBtn').prop('disabled', false);
    
                    }
                    else {
                      $('#formSubmitBtn').prop('disabled', true);
                    }
                  });
    
                  $('#email').on('input', () => {
                    const searchTerm = $('#email').val();
                    if (emailRegex(searchTerm)) {
                      emailRegFlag = true
                      $('#emailWarning').removeClass('d-flex')
                      $('#emailWarning').addClass('d-none')
                    }
                    else {
                      emailRegFlag = false
                      $('#emailWarning').removeClass('d-none')
                      $('#emailWarning').addClass('d-flex')
                    }
    
                    if (nameRegFlag && emailRegFlag && ageRegFlag && phoneRegFlag && passRegFlag && repassRegFlag) {
                      $('#formSubmitBtn').prop('disabled', false);
    
                    }
                    else {
                      $('#formSubmitBtn').prop('disabled', true);
                    }
                  });
    
                  $('#phone').on('input', () => {
                    const searchTerm = $('#phone').val();
                    if (phoneRegex(searchTerm)) {
                      phoneRegFlag = true
                      $('#phoneWarning').removeClass('d-flex')
                      $('#phoneWarning').addClass('d-none')
                    }
                    else {
                      phoneRegFlag = false
                      $('#phoneWarning').removeClass('d-none')
                      $('#phoneWarning').addClass('d-flex')
                    }
    
                    if (nameRegFlag && emailRegFlag && ageRegFlag && phoneRegFlag && passRegFlag && repassRegFlag) {
                      $('#formSubmitBtn').prop('disabled', false);
    
                    }
                    else {
                      $('#formSubmitBtn').prop('disabled', true);
                    }
                  });
    
                  $('#age').on('input', () => {
                    const searchTerm = $('#age').val();
                    if (ageRegex(searchTerm)) {
                      ageRegFlag = true;
                      $('#ageWarning').removeClass('d-flex')
                      $('#ageWarning').addClass('d-none')
                    }
                    else {
                      ageRegFlag = false
                      $('#ageWarning').removeClass('d-none')
                      $('#ageWarning').addClass('d-flex')
                    }
    
                    if (nameRegFlag && emailRegFlag && ageRegFlag && phoneRegFlag && passRegFlag && repassRegFlag) {
                      $('#formSubmitBtn').prop('disabled', false);
    
                    }
                    else {
                      $('#formSubmitBtn').prop('disabled', true);
                    }
                  });
    
                  $('#pass').on('input', () => {
                    const searchTerm = $('#pass').val();
                    if (passRegex(searchTerm)) {
                      passRegFlag = true;
                      $('#passWarning').removeClass('d-flex')
                      $('#passWarning').addClass('d-none')
                    }
                    else {
                      passRegFlag = false;
                      $('#passWarning').removeClass('d-none')
                      $('#passWarning').addClass('d-flex')
                    }
    
                    if (nameRegFlag && emailRegFlag && ageRegFlag && phoneRegFlag && passRegFlag && repassRegFlag) {
                      $('#formSubmitBtn').prop('disabled', false);
    
                    }
                    else {
                      $('#formSubmitBtn').prop('disabled', true);
                    }
                  });
    
    
                  $('#repass').on('input', () => {
                    const searchTerm = $('#repass').val();
                    if (searchTerm == $('#pass').val()) {
                      repassRegFlag = true;
                      $('#repassWarning').removeClass('d-flex')
                      $('#repassWarning').addClass('d-none')
                    }
                    else {
                      repassRegFlag = false;
                      $('#repassWarning').removeClass('d-none')
                      $('#repassWarning').addClass('d-flex')
                    }
    
                    if (nameRegFlag && emailRegFlag && ageRegFlag && phoneRegFlag && passRegFlag && repassRegFlag) {
                      $('#formSubmitBtn').prop('disabled', false);
    
                    }
                    else {
                      $('#formSubmitBtn').prop('disabled', true);
                    }
                  });
    
                  $('#formSubmitBtn').click(function (e) {
                    e.preventDefault();
                  })
    
                }
    
                function nameRegex(input) {
                  let regex = /^[a-zA-Z\s]+$/;
                  if (regex.test(input))
                    return true
                  else
                    return false
                }
    
                function emailRegex(input) {
                  let regex = /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                  if (regex.test(input))
                    return true
                  else
                    return false
                }
    
                function phoneRegex(input) {
                  let regex = /^01[0125][0-9]{8}$/;
                  if (regex.test(input))
                    return true
                  else
                    return false
                }
    
                function ageRegex(input) {
                  let regex = /^(?:[1-9]|[1-9][0-9])$/;
                  if (regex.test(input))
                    return true
                  else
                    return false
                }
    
                function passRegex(input) {
                  let regex = /^(?=.*[a-zA-Z])(?=.*\d)[\w]{8,}$/;
                  if (regex.test(input))
                    return true
                  else
                    return false
                }
    
                $('#contactUs').click(function (e) {
                  e.preventDefault();
    
                  showForm()
    
                })


                // -----------------------------------------------------------
    
  
              }).ready();

            }
            
    
  
}



// Instantiate classes and initialize them
// Initialize instances
const loadingIndicator = new LoadingIndicator();
const navigation = new Navigation();
const mealAPI = new MealAPI();
// Initialize navigation
navigation.initialize();
// Call getHome method on mealAPI
mealAPI.getHome();

$("#logo").click(()=>{
  mealAPI.getHome();



})








