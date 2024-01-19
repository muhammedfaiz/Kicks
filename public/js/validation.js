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

  if (name === "" || email === "" || mobile === "" || password === "") {
    error.style.display = "block";
    error.innerHTML = "All fields are required.";
    return false;
  }
  if (!nameRegex.test(name)) {
    error.style.display = "block";
    error.innerHTML = "Invalid Name";
    return false;
  } else if (!emailRegex.test(email)) {
    error.style.display = "block";
    error.innerHTML = "Invalid email";
    return false;
  } else if (!mobileRegex.test(mobile)) {
    error.style.display = "block";
    error.innerHTML = "Invalid mobile";
    return false;
  } else if (!passwordRegex.test(password)) {
    error.style.display = "block";
    error.innerHTML =
      "Password must contain upper,lower and character with atleast 8";
    return false;
  }
  return true;
}

