const urlInput = document.getElementById("urlInput");
const scanBtn = document.getElementById("scanBtn");

const loading = document.getElementById("loading");
const result = document.getElementById("result");

const loadingText = document.getElementById("loadingText");

const resultTitle = document.getElementById("resultTitle");
const resultIcon = document.getElementById("resultIcon");

const resultUrl = document.getElementById("resultUrl");

const riskScore = document.getElementById("riskScore");

const phishingProbability =
    document.getElementById("phishingProbability");

const legitimateProbability =
    document.getElementById("legitimateProbability");

const phishingBar =
    document.getElementById("phishingBar");

const legitimateBar =
    document.getElementById("legitimateBar");

const recommendationText =
    document.getElementById("recommendationText");


scanBtn.addEventListener("click", scanURL);


urlInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        scanURL();
    }

});


async function scanURL() {

    const url = urlInput.value.trim();

    if (!url) {

        alert("Please enter a URL first.");

        return;
    }


    result.classList.add("hidden");

    loading.classList.remove("hidden");

    scanBtn.disabled = true;


    loadingText.textContent =
        "Extracting URL features...";


    await delay(600);


    loadingText.textContent =
        "Running XGBoost analysis...";


    try {

        const response = await fetch(
            "http://127.0.0.1:8000/predict",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    url: url
                })
            }
        );


        if (!response.ok) {

            throw new Error(
                "API request failed"
            );

        }


        const data = await response.json();


        await delay(500);


        displayResult(data);


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the PhishGuard API.\n\n" +
            "Make sure FastAPI is running."
        );

    }


    loading.classList.add("hidden");

    scanBtn.disabled = false;
}


function displayResult(data) {

    result.classList.remove("hidden");


    resultUrl.textContent = data.url;


    const phishing =
        data.phishing_probability * 100;

    const legitimate =
        data.legitimate_probability * 100;


    phishingProbability.textContent =
        phishing.toFixed(2) + "%";


    legitimateProbability.textContent =
        legitimate.toFixed(2) + "%";


    phishingBar.style.width =
        phishing + "%";


    legitimateBar.style.width =
        legitimate + "%";


    if (data.prediction === "Phishing") {

        resultTitle.textContent =
            "⚠️ Phishing Detected";

        resultIcon.textContent = "✕";

        resultIcon.style.color = "#ff4d6d";

        resultIcon.style.background =
            "rgba(255, 77, 109, 0.1)";


        riskScore.textContent =
            phishing.toFixed(1);


        recommendationText.textContent =
            "This URL shows characteristics associated " +
            "with phishing. Avoid entering passwords, " +
            "banking information, or personal data.";


    } else {

        resultTitle.textContent =
            "✓ URL Appears Legitimate";

        resultIcon.textContent = "✓";

        resultIcon.style.color = "#00ffc3";

        resultIcon.style.background =
            "rgba(0, 255, 195, 0.1)";


        riskScore.textContent =
            legitimate.toFixed(1);


        recommendationText.textContent =
            "Our model did not detect strong phishing " +
            "indicators in this URL. Always verify the " +
            "website before entering sensitive information.";

    }


    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


function delay(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );

}   