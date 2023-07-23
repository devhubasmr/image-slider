console.clear();

const { gsap, imagesLoaded } = window;

const buttons = {
  prev: document.querySelector(".btn-left"),
  next: document.querySelector(".btn-right"),
};
const cardsContainer = document.querySelector(".cards-wrapper");
const appContainer = document.querySelector(".app-bg");

const cardInfos = document.querySelector(".info-wrapper");

buttons.next.addEventListener("click", () => ChangeImg("right"));

buttons.prev.addEventListener("click", () => ChangeImg("left"));

function ChangeImg(direction) {
  const currentCard = cardsContainer.querySelector(".current-card");
  const previousCard = cardsContainer.querySelector(".previous-card");
  const nextCard = cardsContainer.querySelector(".next-card");

  const currentBg = appContainer.querySelector(".current");
  const previousBg = appContainer.querySelector(".previous-image");
  const nextBg = appContainer.querySelector(".next-image");

  changeInfo(direction);
  swapCards();

  removeCard(currentCard);

  function swapCards() {
    currentCard.classList.remove("current-card");
    previousCard.classList.remove("previous-card");
    nextCard.classList.remove("next-card");

    currentBg.classList.remove("current");
    previousBg.classList.remove("previous-image");
    nextBg.classList.remove("next-image");

    currentCard.style.zIndex = "50";
    currentBg.style.zIndex = "-2";

    if (direction === "right") {
      previousCard.style.zIndex = "20";
      nextCard.style.zIndex = "30";

      nextBg.style.zIndex = "-1";

      currentCard.classList.add("previous-card");
      previousCard.classList.add("next-card");
      nextCard.classList.add("current-card");

      currentBg.classList.add("previous-image");
      previousBg.classList.add("next-image");
      nextBg.classList.add("current");
    } else if (direction === "left") {
      previousCard.style.zIndex = "30";
      nextCard.style.zIndex = "20";

      previousBg.style.zIndex = "-1";

      currentCard.classList.add("next-card");
      previousCard.classList.add("current-card");
      nextCard.classList.add("previous-card");

      currentBg.classList.add("next-image");
      previousBg.classList.add("current");
      nextBg.classList.add("previous-image");
    }
  }
}

function changeInfo(direction) {
  let currentInfo = cardInfos.querySelector(".current-info");
  let previousInfo = cardInfos.querySelector(".previous");
  let nextInfo = cardInfos.querySelector(".next-info");

  gsap.timeline()
    .to([buttons.prev, buttons.next], {
    duration: 0.2,
    opacity: 0.5,
    pointerEvents: "none",
  })
    .to(
    currentInfo.querySelectorAll(".info-text"),
    {
      duration: 0.4,
      stagger: 0.1,
      translateY: "-120px",
      opacity: 0,
    },
    "-="
  )
    .call(() => {
    swapInfos(direction);
  })
    .call(() => initCard())
    .fromTo(
    direction === "right"
    ? nextInfo.querySelectorAll(".info-text")
    : previousInfo.querySelectorAll(".info-text"),
    {
      opacity: 0,
      translateY: "40px",
    },
    {
      duration: 0.4,
      stagger: 0.1,
      translateY: "0px",
      opacity: 1,
    }
  )
    .to([buttons.prev, buttons.next], {
    duration: 0.2,
    opacity: 1,
    pointerEvents: "all",
  });

  function swapInfos() {
    currentInfo.classList.remove("current-info");
    previousInfo.classList.remove("previous");
    nextInfo.classList.remove("next-info");

    if (direction === "right") {
      currentInfo.classList.add("previous");
      nextInfo.classList.add("current-info");
      previousInfo.classList.add("next-info");
    } else if (direction === "left") {
      currentInfo.classList.add("next-info");
      nextInfo.classList.add("previous");
      previousInfo.classList.add("current-info");
    }
  }
}

function updateCard(e) {
  const card = e.currentTarget;
  const box = card.getBoundingClientRect();
  const centerPosition = {
    x: box.left + box.width / 2,
    y: box.top + box.height / 2,
  };
  let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
  gsap.set(card, {
    "--current-card-rotation-offset": `${angle}deg`,
  });
  const currentInfo = cardInfos.querySelector(".current-info");
  gsap.set(currentInfo, {
    rotateY: `${angle}deg`,
  });
}

function resetCard(e) {
  const card = e.currentTarget;
  const currentInfo = cardInfos.querySelector(".current-info");
  gsap.set(card, {
    "--current-card-rotation-offset": 0,
  });
  gsap.set(currentInfo, {
    rotateY: 0,
  });
}

function initCard() {
  const currentCard = cardsContainer.querySelector(".current-card");
  currentCard.addEventListener("pointermove", updateCard);
  currentCard.addEventListener("pointerout", (e) => {
    resetCard(e);
  });
}

initCard();

function removeCard(card) {
  card.removeEventListener("pointermove", updateCard);
}

function init() {

  let tl = gsap.timeline();

  tl.to(cardsContainer.children, {
    delay: 0.15,
    duration: 0.5,
    stagger: {
      ease: "power4.inOut",
      from: "right",
      amount: 0.1,
    },
    "--card-translateY-offset": "0%",
  })
    .to(cardInfos.querySelector(".current-info").querySelectorAll(".info-text"), {
    delay: 0.5,
    duration: 0.4,
    stagger: 0.1,
    opacity: 1,
    translateY: 0,
  })
    .to(
    [buttons.prev, buttons.next],
    {
      duration: 0.4,
      opacity: 1,
      pointerEvents: "all",
    },
    "-=0.4"
  );
}

const waitForImages = () => {
  const images = [...document.querySelectorAll("img")];
  const totalImages = images.length;
  let loadedImages = 0;
  const loaderEl = document.querySelector(".img-loader span");

  gsap.set(cardsContainer.children, {
    "--card-translateY-offset": "100vh",
  });
  gsap.set(cardInfos.querySelector(".current-info").querySelectorAll(".info-text"), {
    translateY: "40px",
    opacity: 0,
  });
  gsap.set([buttons.prev, buttons.next], {
    pointerEvents: "none",
    opacity: "0",
  });

  images.forEach((image) => {
    imagesLoaded(image, (instance) => {
      if (instance.isComplete) {
        loadedImages++;
        let loadProgress = loadedImages / totalImages;

        gsap.to(loaderEl, {
          duration: 1,
          scaleX: loadProgress,
          backgroundColor: `hsl(${loadProgress * 120}, 100%, 50%`,
        });

        if (totalImages == loadedImages) {
          gsap.timeline()
            .to(".loading-wrapper", {
            duration: 0.8,
            opacity: 0,
            pointerEvents: "none",
          })
            .call(() => init());
        }
      }
    });
  });
};

waitForImages();