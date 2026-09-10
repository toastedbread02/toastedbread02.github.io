const steps = document.querySelectorAll(".step-card");
const startButton = document.getElementById("startButton");
const againButton = document.getElementById("againButton");

let currentStep = 0;
let timer = null;


function showStep(number) {
    steps.forEach((step, index) => {
        step.classList.toggle("active", index === number);
    });

    currentStep = number;
}


function startAnimation() {

    clearInterval(timer);

    document.getElementById("explainer").scrollIntoView({
        behavior: "smooth"
    });

    showStep(0);

    timer = setInterval(() => {

        currentStep++;

        if (currentStep >= steps.length) {
            clearInterval(timer);
            currentStep = steps.length - 1;
            showStep(currentStep);
            return;
        }

        showStep(currentStep);

    }, 4000);
}


startButton.addEventListener("click", startAnimation);


againButton.addEventListener("click", () => {

    window.scrollTo({
        top: document.querySelector(".explainer").offsetTop - 80,
        behavior: "smooth"
    });

    setTimeout(() => {
        startAnimation();
    }, 700);

});


const slider = document.getElementById("positionSlider");
const mapPhone = document.getElementById("mapPhone");


slider.addEventListener("input", () => {

    const value = slider.value;

    mapPhone.style.left = `${value}%`;

});


showStep(0);