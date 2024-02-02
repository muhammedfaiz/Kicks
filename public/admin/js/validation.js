function productValidation(event) {
  let error = document.getElementById("error");
  let productName = document.getElementById("product_name");
  let brandName = document.getElementById("brand_name");
  let description = document.getElementById("description");
  let price = document.getElementsByName("price")[0];
  let offerPrice = document.getElementsByName("offerPrice")[0];
  let size = document.getElementsByName("size")[0];

  let stock = document.getElementsByName("stock")[0];
  let images = document.getElementsByName("images")[0];

  const priceRegex = /^[1-9]\d*$/;
  const sizeRegex = /^(6|7|8|9|10|11|12)$/;
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
    return false;
  }

  if (!price.value.match(priceRegex) || !offerPrice.value.match(priceRegex)) {
    error.innerHTML = "Price should be a positive number except 0";
    return false;
  } else if (!productName.value.match(alphaRegex)) {
    error.innerHTML = "Product Name can only be alphabet and number";
    return false;
  }else if(!brandName.value.match(alphaRegex)){
    error.innerHTML = "Brand Name can only be alphabet and number";
    return false;
  } else if (!size.value.match(sizeRegex)) {
    error.innerHTML = "size should be between 6-12";
    return false;
  } else if (!stock.value.match(stockRegex)) {
    error.innerHTML = "Enter the correct stock";
    return false;
  }
  console.log("validation success");
  return true;
}

document
  .querySelector("#addProduct")
  .addEventListener("submit", function (event) {
    console.log("Form submitted");
  });

function categoryValidation(event) {
  let error = document.getElementById("error");
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
