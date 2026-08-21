const urlInput =
    document.getElementById("urlInput");

const scanBtn =
    document.getElementById("scanBtn");

const loading =
    document.getElementById("loading");

const result =
    document.getElementById("result");

const loadingText =
    document.getElementById("loadingText");

const resultTitle =
    document.getElementById("resultTitle");

const resultIcon =
    document.getElementById("resultIcon");

const resultUrl =
    document.getElementById("resultUrl");

const riskScore =
    document.getElementById("riskScore");

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

const explanationList =
    document.getElementById("explanationList");

const scoreCircle =
    document.querySelector(".score-circle");


/* =========================================================
   EVENTS
========================================================= */

scanBtn.addEventListener(
    "click",
    scanURL
);


urlInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            scanURL();

        }

    }
);


/* =========================================================
   SCAN URL
========================================================= */

async function scanURL() {

    const url =
        urlInput.value.trim();


    if (!url) {

        alert(
            "Please enter a URL first."
        );

        return;

    }


    result.classList.add(
        "hidden"
    );

    loading.classList.remove(
        "hidden"
    );

    scanBtn.disabled = true;


    loadingText.textContent =
        "Extracting URL features...";


    await delay(500);


    loadingText.textContent =
        "Running XGBoost analysis...";


    await delay(500);


    loadingText.textContent =
        "Generating SHAP explanation...";


    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/predict",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
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


        const data =
            await response.json();


        await delay(400);


        displayResult(data);


    }

    catch (error) {

        console.error(
            "API Error:",
            error
        );


        alert(
            "Unable to connect to the PhishGuard API.\n\n" +
            "Make sure FastAPI is running on port 8000."
        );

    }


    loading.classList.add(
        "hidden"
    );

    scanBtn.disabled = false;

}


/* =========================================================
   DISPLAY RESULT
========================================================= */

function displayResult(data) {

    result.classList.remove(
        "hidden"
    );


    resultUrl.textContent =
        data.url;


    /* -----------------------------------------------------
       Probabilities
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       Prediction
    ----------------------------------------------------- */

    if (
        data.prediction ===
        "Phishing"
    ) {

        resultTitle.textContent =
            "⚠️ Phishing Detected";


        resultIcon.textContent =
            "✕";


        resultIcon.style.color =
            "#ff4d6d";


        resultIcon.style.background =
            "rgba(255, 77, 109, 0.1)";


        riskScore.textContent =
            phishing.toFixed(1);


        scoreCircle.style.borderColor =
            "#ff4d6d";


        scoreCircle.style.boxShadow =
            "0 0 30px rgba(255, 77, 109, 0.18)";


        recommendationText.textContent =
            "This URL shows characteristics associated " +
            "with phishing. Avoid entering passwords, " +
            "banking information, or personal data.";

    }

    else {

        resultTitle.textContent =
            "✓ URL Appears Legitimate";


        resultIcon.textContent =
            "✓";


        resultIcon.style.color =
            "#00ffc3";


        resultIcon.style.background =
            "rgba(0, 255, 195, 0.1)";


        riskScore.textContent =
            legitimate.toFixed(1);


        scoreCircle.style.borderColor =
            "#00ffc3";


        scoreCircle.style.boxShadow =
            "0 0 30px rgba(0, 255, 195, 0.15)";


        recommendationText.textContent =
            "Our model did not detect strong phishing " +
            "indicators in this URL. Always verify the " +
            "website before entering sensitive information.";

    }


    /* -----------------------------------------------------
       SHAP Explanation
    ----------------------------------------------------- */

    displayExplanations(
        data.explanation
    );


    /* -----------------------------------------------------
       Scroll to result
    ----------------------------------------------------- */

    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   SHAP EXPLANATIONS
========================================================= */

function displayExplanations(
    explanations
) {

    explanationList.innerHTML = "";


    if (
        !explanations ||
        explanations.length === 0
    ) {

        explanationList.innerHTML = `
            <p class="explanation-subtitle">
                No explanation data available.
            </p>
        `;

        return;

    }


    /* -----------------------------------------------------
       Find strongest SHAP value
    ----------------------------------------------------- */

    const maxImpact =
        Math.max(
            ...explanations.map(
                item =>
                    Math.abs(
                        Number(item.impact)
                    )
            )
        );


    /* -----------------------------------------------------
       Create each explanation
    ----------------------------------------------------- */

    explanations.forEach(
        function (item) {

            const impact =
                Number(item.impact);


            const value =
                item.value;


            const absoluteImpact =
                Math.abs(impact);


            let percentage = 0;


            if (maxImpact > 0) {

                percentage =
                    (
                        absoluteImpact /
                        maxImpact
                    ) * 100;

            }


            const positive =
                impact >= 0;


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "explanation-item";


            div.innerHTML = `

                <div class="explanation-info">

                    <span class="explanation-feature">
                        ${escapeHTML(item.feature)}
                    </span>

                    <span
                        class="
                            explanation-impact
                            ${positive
                                ? "impact-positive"
                                : "impact-negative"}
                        "
                    >

                        ${impact >= 0 ? "+" : ""}
                        ${impact.toFixed(3)}

                    </span>

                </div>


                <div class="explanation-bar">

                    <div
                        class="
                            explanation-fill
                            ${positive
                                ? "positive"
                                : "negative"}
                        "
                        style="width: ${percentage}%"
                    ></div>

                </div>


                <div class="feature-value">

                    Feature value:
                    ${escapeHTML(
                        String(value)
                    )}

                </div>

            `;


            explanationList.appendChild(
                div
            );

        }
    );

}


/* =========================================================
   SECURITY HELPER
========================================================= */

function escapeHTML(value) {

    return value
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   DELAY
========================================================= */

function delay(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}