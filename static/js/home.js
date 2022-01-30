"use strict";

/* ============ FUNCTIONALITY FOR ADDING NEW MEMORY IN UI =========== */
const memoriesCards = document.querySelector(".memories__cards");
const form = document.querySelector(".form");
const inputFields = document.querySelectorAll(".form input");
const errors = document.querySelectorAll(".form__field--error");

const creatorField = document.querySelector(".creator__name--field");
const titleField = document.querySelector(".memory__title--field");
const msgField = document.querySelector(".memory__message--field");
const tagsField = document.querySelector(".memory__tags--field");
const imgField = document.querySelector(".memory__image--field");

/* FUNCTION TO SEND DATA TO SERVER */
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

/* EVENT HANDLER FOR FORM SUBMISSION */
form.addEventListener("submit", e => {
  e.preventDefault();

  const pic = imgField.files[0];
  const imgFormats = ["image/png", "image/jpg", "image/jpeg", "image/git"];
  const creator = creatorField.value.trim();
  const title = titleField.value.trim();
  const msg = msgField.value.trim();
  const tags = tagsField.value.split(",").map(tag => tag.trim());

  let tagsString = "";
  for (let i = 0; i < tags.length; i++) {
    if (tags[i]) tagsString += `#${tags[i]} `;
  }

  if (creator.length > 30 || creator.length < 5) {
    errors[0].textContent = "creator name should be 5 to 30 characters long";
  } else if (title.length > 50 || title.length < 10) {
    errors[1].textContent = "title should be 10 to 50 characters long";
  } else if (msg.length > 300 || msg.length < 10) {
    errors[2].textContent = "message should be 10 to 300 characters long";
  } else if (tags.join("").length > 50) {
    errors[3].textContent = "tags should be upto 50 characters long";
  } else if (tags.length > 5) {
    errors[3].textContent = "only 5 tags are allowed";
  } else if (!imgFormats.includes(pic.type)) {
    errors[4].textContent = "image should be in jpg/png/git format";
  } else if (pic.size > 8 * 1024 * 1024) {
    errors[4].textContent = "image should be of size upto 8MB";
  } else {
    createMemory([creator, title, msg, tags, pic])
      .then(res => {
        const cardStr = `<div class="card" id="card-${res.id}">
        
          <div class="card__header"><picture><source srcset="/static/images/${
            res.image.split(".")[0]
          }.webp" type="image/webp"/>
          <source srcset="/static/images/${
            res.image
          }"/><img src="/static/images/${res.image}" alt="Card Image"
          class="card__image"/></picture><div class="card__info"><div class="card__author"><h3>${
            res.creator
          }
          </h3><h5>a few seconds ago</h5></div><div class="card__header--btns"><button class="card__edit--btn 
          card__btn" title="Edit Memory"><i class="ri-edit-box-line"></i></button><button class="card__delete--btn
          card__btn" title="Delete Memory"><ion-icon name="trash-outline"></ion-icon></button></div></div></div>

          <div class="card__body"><p class="card__tags">${tagsString}</p><h2 class="card__title">${
          res.title
        }</h2>
          <p class="card__message">${res.message}</p></div>

          <div class="card__footer"><button class="card__like--btn"><i class="ri-heart-line"></i><span>Like</span>
          </button></div>
        </div>`;

        memoriesCards.insertAdjacentHTML("beforeend", cardStr);
      })
      .catch(err => console.error(err));
  }
});
