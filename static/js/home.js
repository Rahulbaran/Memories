"use strict";

// Functionality for adding new memory in the UI
const form = document.querySelector(".form");
const inputFields = document.querySelectorAll(".form input");
const errors = document.querySelectorAll(".form__field--error");

const creatorField = document.querySelector(".creator__name--field");
const titleField = document.querySelector(".memory__title--field");
const msgField = document.querySelector(".memory__message--field");
const tagsField = document.querySelector(".memory__tags--field");
const imgField = document.querySelector(".memory__image--field");

// Function to send form data to server
const createMemory = data => {
  const promise = new Promise((resolve, reject) => {
    // Creating FormData object
    const formData = new FormData();
    formData.append("creator", data[0]);
    formData.append("title", data[1]);
    formData.append("message", data[2]);
    formData.append("tags", data[3]);
    formData.append("card-image", data[4]);

    // Making http request
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", "/home", true);
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.send(formData);

    xhr.onload = () => {
      if (xhr.status === 200) {
        !xhr.response.code ? resolve(xhr.response) : reject(xhr.response);
      } else {
        reject(xhr.response);
      }
    };
    xhr.onerror = err => reject(err);

    // Emptying input Fields and error
    inputFields.forEach(field => (field.value = ""));
    errors.forEach(err => (err.textContent = ""));
  });
  return promise;
};

// Event handler for form submission
form.addEventListener("submit", e => {
  e.preventDefault();

  const pic = imgField.files[0];
  const imgFormats = ["image/png", "image/jpg", "image/jpeg", "image/git"];
  const creator = creatorField.value.trim();
  const title = titleField.value.trim();
  const msg = msgField.value.trim();
  const tags = tagsField.value.split(",").map(tag => tag.trim());

  if (creator.length > 30 || creator.length < 5) {
    errors[0].textContent = "creator name should be 5 to 30 characters long";
    return;
  } else if (title.length > 50 || title.length < 10) {
    errors[1].textContent = "title should be 10 to 50 characters long";
    return;
  } else if (msg.length > 300 || msg.length < 10) {
    errors[2].textContent = "message should be 10 to 300 characters long";
    return;
  } else if (tags.join("").length > 50) {
    errors[3].textContent = "tags should be upto 50 characters long";
    return;
  } else if (tags.length > 5) {
    errors[3].textContent = "only 5 tags are allowed";
    return;
  } else if (!imgFormats.includes(pic.type)) {
    errors[4].textContent = "image should be in jpg/png/git format";
    return;
  } else if (pic.size > 8 * 1024 * 1024) {
    errors[4].textContent = "image should be of size upto 8MB";
    return;
  } else {
    createMemory([creator, title, msg, tags, pic])
      .then(res => console.log(res))
      .catch(err => console.error(err));
  }
});
