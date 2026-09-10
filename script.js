const urlInput = document.getElementById("urlInput");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const againButton = document.getElementById("againButton");

const hero = document.getElementById("hero");
const simulation = document.getElementById("simulation");
const finalScreen = document.getElementById("final");

const simulationTitle = document.getElementById("simulationTitle");
const serverName = document.getElementById("serverName");

const stepNumber = document.getElementById("stepNumber");
const stepLabel = document.getElementById("stepLabel");
const stepTitle = document.getElementById("stepTitle");
const stepDescription = document.getElementById("stepDescription");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const terminal = document.getElementById("terminal");
const activityStatus = document.getElementById("activityStatus");

const nextButton = document.getElementById("nextButton");

const statDns = document.getElementById("statDns");
const statConnection = document.getElementById("statConnection");
const statServer = document.getElementById("statServer");
const statTotal = document.getElementById("statTotal");

const nodes = document.querySelectorAll(".node");
const packets = document.querySelectorAll(".packet");

let currentStep = 0;
let website = "example.com";

const steps = [
    {
        label: "DNS LOOKUP",
        title: "Finding the website",
        description:
            "Your browser asks a DNS server which IP address belongs to the website you entered.",
        log: [
            "Browser → DNS: What is the IP of {site}?",
            "DNS: Searching for {site}...",
            "DNS: Found 93.184.216.34"
        ],
        node: 1
    },
    {
        label: "CONNECTION",
        title: "Connecting to the server",
        description:
            "Now that your computer knows the server's IP address, it can establish a connection.",
        log: [
            "Browser → 93.184.216.34",
            "Establishing secure connection...",
            "Connection established."
        ],
        node: 2
    },
    {
        label: "HTTPS",
        title: "Securing the connection",
        description:
            "HTTPS encrypts the communication between your browser and the server so others cannot easily read it.",
        log: [
            "TLS handshake started...",
            "Certificate verified.",
            "Encrypted connection established."
        ],
        node: 2
    },
    {
        label: "HTTP REQUEST",
        title: "Asking for the page",
        description:
            "Your browser sends an HTTP request asking the web server to send the website.",
        log: [
            "GET / HTTP/2",
            "Host: {site}",
            "Request sent to server."
        ],
        node: 3
    },
    {
        label: "HTTP RESPONSE",
        title: "The server sends it back",
        description:
            "The server processes the request and sends HTML, CSS, JavaScript, images and other files back to your browser.",
        log: [
            "Server: Processing request...",
            "HTTP 200 OK",
            "Response received: 148 KB"
        ],
        node: 3
    }
];

function cleanWebsite(value) {
    value = value.trim();

    value = value
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .split("/")[0];

    return value || "example.com";
}

function startSimulation() {
    website = cleanWebsite(urlInput.value);

    currentStep = 0;

    hero.classList.add("hidden");
    finalScreen.classList.add("hidden");
    simulation.classList.remove("hidden");

    simulationTitle.textContent = `Visiting ${website}`;
    serverName.textContent = website;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    showStep();
}

function showStep() {
    const step = steps[currentStep];

    stepNumber.textContent = String(currentStep + 1).padStart(2, "0");
    stepLabel.textContent = step.label;
    stepTitle.textContent = step.title;
    stepDescription.textContent = step.description;

    progressText.textContent = `${currentStep + 1} / ${steps.length}`;
    progressFill.style.width =
        `${((currentStep + 1) / steps.length) * 100}%`;

    activityStatus.textContent = "TRANSMITTING";

    nodes.forEach(node => node.classList.remove("active"));

    if (nodes[step.node]) {
        nodes[step.node].classList.add("active");
    }

    packets.forEach(packet => {
        packet.classList.remove("fly");

        void packet.offsetWidth;

        packet.classList.add("fly");
    });

    terminal.innerHTML = "";

    step.log.forEach((line, index) => {
        setTimeout(() => {
            addTerminalLine(
                line.replaceAll("{site}", website)
            );
        }, index * 450);
    });

    if (currentStep === steps.length - 1) {
        nextButton.innerHTML = `FINISH <span>✓</span>`;
    } else {
        nextButton.innerHTML = `NEXT STEP <span>→</span>`;
    }
}

function addTerminalLine(text) {
    const line = document.createElement("div");

    line.innerHTML =
        `<span class="terminal-green">›</span> ${text}`;

    terminal.appendChild(line);

    terminal.scrollTop = terminal.scrollHeight;
}

function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep();
    } else {
        finishSimulation();
    }
}

function finishSimulation() {
    simulation.classList.add("hidden");
    finalScreen.classList.remove("hidden");

    const dns = Math.floor(Math.random() * 20) + 15;
    const connection = Math.floor(Math.random() * 35) + 35;
    const server = Math.floor(Math.random() * 60) + 55;
    const total = dns + connection + server;

    animateNumber(statDns, dns);
    animateNumber(statConnection, connection);
    animateNumber(statServer, server);
    animateNumber(statTotal, total);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function animateNumber(element, target) {
    const duration = 700;
    const start = performance.now();

    function update(now) {
        const progress = Math.min(
            (now - start) / duration,
            1
        );

        const value = Math.floor(
            progress * target
        );

        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function restart() {
    finalScreen.classList.add("hidden");
    simulation.classList.remove("hidden");

    currentStep = 0;
    showStep();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

startButton.addEventListener("click", startSimulation);

nextButton.addEventListener("click", nextStep);

restartButton.addEventListener("click", restart);

againButton.addEventListener("click", () => {
    simulation.classList.remove("hidden");
    finalScreen.classList.add("hidden");

    currentStep = 0;
    showStep();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

urlInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        startSimulation();
    }
});

urlInput.addEventListener("focus", () => {
    urlInput.select();
});