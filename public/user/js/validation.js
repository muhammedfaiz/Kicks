function validationSignup(event) {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let mobile = document.getElementById("mobile").value;
  let password = document.getElementById("password").value;
  let error = document.getElementById("error");

  const nameRegex = /^[a-zA-Z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^\d{10}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  let status;
  if (name === "" || email === "" || mobile === "" || password === "") {
    error.style.display = "block";
    error.innerHTML = "All fields are required.";
    status = true;
  }
  if (!nameRegex.test(name)) {
    document.getElementById("error-name").innerHTML = "Invalid Name";
    status = false;
  }
  if (!emailRegex.test(email)) {
    document.getElementById("error-email").innerHTML = "Invalid email";
    status = false;
  }
  if (!mobileRegex.test(mobile)) {
    document.getElementById("error-mobile").innerHTML = "Invalid mobile";
    status = false;
  }
  if (!passwordRegex.test(password)) {
    document.getElementById("error-pass").innerHTML =
      "Password must contain upper,lower and character with atleast 8";
    status = false;
  }
  return status;
}

function validationAddress() {
  let name = document.getElementById("address-name").value;
  let house = document.getElementById("address-house").value;
  let city = document.getElementById("address-city").value;
  let state = document.getElementById("address-state").value;
  let country = document.getElementById("address-country").value;
  let pincode = document.getElementById("address-pincode").value;

  let nameRegex = /^[a-zA-Z\s]+$/;
  let houseRegex = /^[a-zA-Z0-9\s]+$/;
  let pincodeRegex = /^[0-9]+$/;
  let isvalid = true;
  if (!nameRegex.test(name)) {
    document.getElementById("error-name").innerHTML = "Invalid Name!!";
    isvalid = false;
  }
  if (!houseRegex.test(house)) {
    document.getElementById("error-house").innerHTML = "Invalid house!!";
    isvalid = false;
  }
  if (!nameRegex.test(city)) {
    document.getElementById("error-city").innerHTML = "Invalid city!!";
    isvalid = false;
  }
  if (!nameRegex.test(state)) {
    document.getElementById("error-state").innerHTML = "Invalid state!!";
    isvalid = false;
  }
  if (!nameRegex.test(country)) {
    document.getElementById("error-country").innerHTML = "Invalid country!!";
    isvalid = false;
  }
  if (!pincodeRegex.test(pincode)) {
    document.getElementById("error-pincode").innerHTML = "Invalid Name!!";
    isvalid = false;
  }
  return isvalid;
}
