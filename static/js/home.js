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
const cardTemplate = document.querySelector(".card--template");

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
        const template = cardTemplate.content.cloneNode(true);
        const templatePic = template.querySelector("picture");
        template.querySelector(".card").setAttribute("id", `card-${res.id}`);
        for (let i = 0; i < 2; i++) {
          templatePic.children[i].setAttribute(
            "srcset",
            `/static/images/${res.image}`
          );
        }
        templatePic.children[2].setAttribute(
          "scr",
          `/static/images/${res.image}`
        );
        template.querySelector("h5").textContent = "a few seconds ago";
        template.querySelector("h3").textContent = res.creator;
        template.querySelector(".card__tags").textContent = tagsString;
        template.querySelector(".card__title").textContent = res.title;
        template.querySelector(".card__message").textContent = res.message;

        memoriesCards.appendChild(template);
      })
      .catch(err => console.error(err));
  }
});

/* ================ Common Function to make Http request ================= */
const httpRequest = (url, memoryId) => {
  const promise = new Promise((resolve, reject) => {
    const id = JSON.stringify({ memoryId: +memoryId });

    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.send(id);

    xhr.onload = () => {
      if (xhr.status === 200) resolve(xhr.response);
      else reject(xhr.response);
    };
    xhr.onerror = err => reject(err);
  });
  return promise;
};

/* ================== FUNCTIONALITY FOR LIKING MEMORY =================== */
memoriesCards.addEventListener("click", e => {
  const targetGrandParent = e.target.parentElement.parentElement;

  if (e.target.classList.contains("card__like--btn")) {
    const id = targetGrandParent.id.split("-")[1];
    httpRequest("/memoryLike", id)
      .then(res => {
        e.target.textContent =
          res["total Likes"] > 1
            ? `${res["total Likes"]} Likes`
            : `${res["total Likes"]} Like`;
      })
      .catch(err => console.error(err));
  }
});

/* ================== Functionality to delete memory =================== */
memoriesCards.addEventListener("click", function (e) {
  const memoryCard = e.target.closest(".card");

  if (e.target.parentElement.matches(".card__delete--btn")) {
    const memoryId = memoryCard.id;
    const id = Number(memoryId.split("-")[1]);

    httpRequest("/deleteMemory", id)
      .then(res => {
        this.remove(memoryCard);
        console.log(res.message);
      })
      .catch(err => console.error(err.message));
  }
});

/* ================ Functionality to Edit Memory ================== */
memoriesCards.addEventListener("click", e => {
  const memoryCard = e.target.closest(".card");

  if (e.target.parentElement.matches(".card__edit--btn")) {
    const memoryId = memoryCard.id;
    const id = Number(memoryId.split("-")[1]);

    httpRequest("/editMemory", id)
      .then(res => {
        creatorField.value = res.creator;
        titleField.value = res.title;
        msgField.value = res.message;
        tagsField.value = res.tags;
      })
      .catch(err => console.error(err));
  }
});
