function productValidation(event) {
  let error = document.getElementById("error");
  let productName = document.getElementById("product_name");
  let brandName = document.getElementById("brand_name");
  let description = document.getElementById("description");
  let price = document.getElementsByName("price")[0];
  let offerPrice = document.getElementsByName("offerPrice")[0];
  let discount = document.getElementsByName("discount")[0];
  let smQuantity = document.getElementsByName("smallQuantity")[0];
  let mdQuantity = document.getElementsByName("mediumQuantity")[0];
  let lgQuantity = document.getElementsByName("largeQuantity")[0];

  let stock = document.getElementsByName("stock")[0];
  let images = document.getElementsByName("images")[0];
  let isValid = true;
  const priceRegex = /^[1-9]\d*$/;
  const alphaRegex = /^[A-Za-z]+$|^[^-]\d+$/;

  const stockRegex = /^([0-9]\d)$/;

  if (
    !productName.value ||
    !brandName.value ||
    !description.value ||
    !price.value ||
    !offerPrice.value ||
    !size.value ||
    !stock.value
  ) {
    error.innerHTML = "Every field is required!!";
    isValid = false;
  }

  if (!price.value.match(priceRegex)) {
    document.getElementById("error-price").innerHTML = "Price should be a positive number except 0";
    isValid = false;
  } 
  if (!discount.value.match(priceRegex)) {
    document.getElementById("error-discount").innerHTML = "Discount should be a positive number except 0";
    isValid = false;
  } 
   if (!productName.value.match(alphaRegex)) {
    document.getElementById("error-prod_name").innerHTML = "Product Name can only be alphabet and number";
    isValid = false;
  }
   if(!brandName.value.match(alphaRegex)){
    document.getElementById("error-brand_name").innerHTML = "Brand Name can only be alphabet and number";
    isValid = false;
  } 
    if (!smQuantity.value.match(stockRegex)) {
      document.getElementById("error-sm").innerHTML = "Enter the correct quantity";
    isValid = false;
  }
  if (!mdQuantity.value.match(stockRegex)) {
    document.getElementById("error-md").innerHTML = "Enter the correct quantity";
  isValid = false;
}
if (!lgQuantity.value.match(stockRegex)) {
  document.getElementById("error-lg").innerHTML = "Enter the correct quantity";
isValid = false;
}
  console.log("validation success");
  return isValid;
}

document
  .querySelector("#addProduct")
  .addEventListener("submit", function (event) {
    console.log("Form submitted");
  });

function categoryValidation(event) {
  let error = document.getElementById("error-category");
  let categoryName = document.getElementById("category_name");

  let nameRegex = /^[a-zA-Z]+$/;
  if (!categoryName.value) {
    error.innerHTML = "Category Name can't be empty";
    return false;
  } else if (!categoryName.value.match(nameRegex)) {
    error.innerHTML = "Enter valid category";
    return false;
  }
  return true;
}
