"use strict";

/*
    Password Strength Analyzer
    ---------------------------
    All password analysis happens locally in the browser.

    The application does NOT:
    - Send passwords to a server
    - Store passwords
    - Save passwords in localStorage
*/


/* =========================================================
   DOM ELEMENTS
========================================================= */

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const scoreElement = document.getElementById("score");

const entropyElement = document.getElementById("entropy");
const charsetSizeElement = document.getElementById("charsetSize");

const suggestionList = document.getElementById("suggestionList");

const lengthCheck = document.getElementById("lengthCheck");
const upperCheck = document.getElementById("upperCheck");
const lowerCheck = document.getElementById("lowerCheck");
const numberCheck = document.getElementById("numberCheck");
const specialCheck = document.getElementById("specialCheck");
const repeatCheck = document.getElementById("repeatCheck");
const sequenceCheck = document.getElementById("sequenceCheck");
const commonCheck = document.getElementById("commonCheck");

const passwordLength = document.getElementById("passwordLength");
const lengthValue = document.getElementById("lengthValue");

const genUpper = document.getElementById("genUpper");
const genLower = document.getElementById("genLower");
const genNumbers = document.getElementById("genNumbers");
const genSymbols = document.getElementById("genSymbols");

const generatedPassword = document.getElementById("generatedPassword");
const generateButton = document.getElementById("generateButton");
const copyButton = document.getElementById("copyButton");
const copyMessage = document.getElementById("copyMessage");


/* =========================================================
   COMMON PASSWORDS
========================================================= */

const commonPasswords = new Set([
    "123456",
    "123456789",
    "12345678",
    "password",
    "password1",
    "password123",
    "1234567890",
    "qwerty",
    "qwerty123",
    "abc123",
    "111111",
    "123123",
    "admin",
    "admin123",
    "letmein",
    "welcome",
    "monkey",
    "dragon",
    "football",
    "iloveyou",
    "login",
    "princess",
    "sunshine",
    "master",
    "hello",
    "welcome123",
    "passw0rd",
    "test123",
    "user123",
    "india123"
]);


/* =========================================================
   CHARACTER SETS
========================================================= */

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const NUMBERS = "0123456789";

const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";


/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

togglePassword.addEventListener("click", () => {

    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword
        ? "text"
        : "password";

    togglePassword.textContent = isPassword
        ? "🙈"
        : "👁";

    togglePassword.setAttribute(
        "aria-label",
        isPassword
            ? "Hide password"
            : "Show password"
    );
});


/* =========================================================
   PASSWORD ANALYSIS
========================================================= */

passwordInput.addEventListener("input", analyzePassword);


function analyzePassword() {

    const password = passwordInput.value;

    if (!password) {
        resetAnalyzer();
        return;
    }

    const result = calculateStrength(password);

    updateChecks(result);

    updateStrength(result.score);

    updateEntropy(password, result.characterPool);

    updateSuggestions(password, result);
}


/* =========================================================
   CALCULATE PASSWORD STRENGTH
========================================================= */

function calculateStrength(password) {

    let score = 0;

    const length = password.length;

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const hasRepeated = /(.)\1{2,}/.test(password);

    const hasSequence = containsSequence(password);

    const isCommon = commonPasswords.has(
        password.toLowerCase()
    );


    /* -------------------------------
       Length score
    -------------------------------- */

    if (length >= 8) {
        score += 10;
    }

    if (length >= 12) {
        score += 15;
    }

    if (length >= 16) {
        score += 10;
    }

    if (length >= 20) {
        score += 10;
    }


    /* -------------------------------
       Character diversity
    -------------------------------- */

    if (hasLower) {
        score += 10;
    }

    if (hasUpper) {
        score += 10;
    }

    if (hasNumber) {
        score += 10;
    }

    if (hasSpecial) {
        score += 15;
    }


    /* -------------------------------
       Penalties
    -------------------------------- */

    if (hasRepeated) {
        score -= 10;
    }

    if (hasSequence) {
        score -= 10;
    }

    if (isCommon) {
        score -= 40;
    }


    /* Prevent invalid range */

    score = Math.max(0, Math.min(100, score));


    /* -------------------------------
       Character pool
    -------------------------------- */

    let characterPool = 0;

    if (hasLower) {
        characterPool += LOWERCASE.length;
    }

    if (hasUpper) {
        characterPool += UPPERCASE.length;
    }

    if (hasNumber) {
        characterPool += NUMBERS.length;
    }

    if (hasSpecial) {
        characterPool += SYMBOLS.length;
    }


    return {
        score,
        length,
        hasLower,
        hasUpper,
        hasNumber,
        hasSpecial,
        hasRepeated,
        hasSequence,
        isCommon,
        characterPool
    };
}


/* =========================================================
   SEQUENCE DETECTION
========================================================= */

function containsSequence(password) {

    const value = password.toLowerCase();

    const sequences = [
        "abcdefghijklmnopqrstuvwxyz",
        "zyxwvutsrqponmlkjihgfedcba",
        "0123456789",
        "9876543210",
        "qwertyuiop",
        "asdfghjkl",
        "zxcvbnm"
    ];


    for (const sequence of sequences) {

        for (let i = 0; i <= sequence.length - 4; i++) {

            const part = sequence.substring(i, i + 4);

            if (value.includes(part)) {
                return true;
            }
        }
    }


    return false;
}


/* =========================================================
   UPDATE CHECKS
========================================================= */

function updateChecks(result) {

    setCheck(
        lengthCheck,
        result.length >= 12
    );

    setCheck(
        upperCheck,
        result.hasUpper
    );

    setCheck(
        lowerCheck,
        result.hasLower
    );

    setCheck(
        numberCheck,
        result.hasNumber
    );

    setCheck(
        specialCheck,
        result.hasSpecial
    );

    setCheck(
        repeatCheck,
        !result.hasRepeated
    );

    setCheck(
        sequenceCheck,
        !result.hasSequence
    );

    setCheck(
        commonCheck,
        !result.isCommon
    );
}


function setCheck(element, valid) {

    const icon = element.querySelector(".check-icon");

    element.classList.remove(
        "valid",
        "invalid"
    );


    if (valid) {

        element.classList.add("valid");

        icon.textContent = "✓";

    } else {

        element.classList.add("invalid");

        icon.textContent = "✗";
    }
}


/* =========================================================
   STRENGTH DISPLAY
========================================================= */

function updateStrength(score) {

    let label;

    if (score <= 20) {

        label = "Very Weak";

    } else if (score <= 40) {

        label = "Weak";

    } else if (score <= 60) {

        label = "Moderate";

    } else if (score <= 80) {

        label = "Strong";

    } else {

        label = "Very Strong";
    }


    strengthText.textContent = label;

    scoreElement.textContent = score;

    strengthBar.style.width = `${score}%`;


    if (score <= 20) {

        strengthBar.style.background = "#dc2626";

    } else if (score <= 40) {

        strengthBar.style.background = "#ea580c";

    } else if (score <= 60) {

        strengthBar.style.background = "#d97706";

    } else if (score <= 80) {

        strengthBar.style.background = "#16a34a";

    } else {

        strengthBar.style.background = "#059669";
    }
}


/* =========================================================
   ENTROPY
========================================================= */

function updateEntropy(password, characterPool) {

    if (characterPool <= 0) {

        entropyElement.textContent = "0 bits";

        charsetSizeElement.textContent = "0";

        return;
    }


    /*
        Estimated entropy:

        E = L × log2(N)

        L = password length
        N = character pool size
    */

    const entropy =
        password.length *
        Math.log2(characterPool);


    entropyElement.textContent =
        `${entropy.toFixed(1)} bits`;

    charsetSizeElement.textContent =
        characterPool;
}


/* =========================================================
   SUGGESTIONS
========================================================= */

function updateSuggestions(password, result) {

    const suggestions = [];


    if (result.length < 12) {

        suggestions.push(
            "Use at least 12 characters. Longer passwords are generally stronger."
        );
    }


    if (!result.hasUpper) {

        suggestions.push(
            "Add uppercase letters such as A, B, or C."
        );
    }


    if (!result.hasLower) {

        suggestions.push(
            "Add lowercase letters such as a, b, or c."
        );
    }


    if (!result.hasNumber) {

        suggestions.push(
            "Add numbers, but avoid predictable patterns such as 123456."
        );
    }


    if (!result.hasSpecial) {

        suggestions.push(
            "Add special characters such as !, @, #, or $."
        );
    }


    if (result.hasRepeated) {

        suggestions.push(
            "Avoid repeating the same character multiple times."
        );
    }


    if (result.hasSequence) {

        suggestions.push(
            "Avoid predictable sequences such as 1234, abcd, or qwerty."
        );
    }


    if (result.isCommon) {

        suggestions.push(
            "This password appears in a list of common passwords. Choose something completely different."
        );
    }


    if (password.length >= 16 && suggestions.length === 0) {

        suggestions.push(
            "Excellent! This password has good length and character diversity."
        );
    }


    suggestionList.innerHTML = "";


    suggestions.forEach(suggestion => {

        const li = document.createElement("li");

        li.textContent = suggestion;

        suggestionList.appendChild(li);
    });
}


/* =========================================================
   RESET ANALYZER
========================================================= */

function resetAnalyzer() {

    strengthBar.style.width = "0%";

    strengthText.textContent = "Very Weak";

    scoreElement.textContent = "0";

    entropyElement.textContent = "0 bits";

    charsetSizeElement.textContent = "0";


    const checks = [
        lengthCheck,
        upperCheck,
        lowerCheck,
        numberCheck,
        specialCheck,
        repeatCheck,
        sequenceCheck,
        commonCheck
    ];


    checks.forEach(check => {

        check.classList.remove(
            "valid",
            "invalid"
        );

        check.querySelector(
            ".check-icon"
        ).textContent = "✗";
    });


    suggestionList.innerHTML =
        "<li>Enter a password to receive security recommendations.</li>";
}


/* =========================================================
   PASSWORD GENERATOR
========================================================= */

passwordLength.addEventListener("input", () => {

    lengthValue.textContent =
        passwordLength.value;
});


generateButton.addEventListener(
    "click",
    generateStrongPassword
);


function generateStrongPassword() {

    let characterPool = "";

    const selectedSets = [];


    if (genUpper.checked) {

        characterPool += UPPERCASE;

        selectedSets.push(UPPERCASE);
    }


    if (genLower.checked) {

        characterPool += LOWERCASE;

        selectedSets.push(LOWERCASE);
    }


    if (genNumbers.checked) {

        characterPool += NUMBERS;

        selectedSets.push(NUMBERS);
    }


    if (genSymbols.checked) {

        characterPool += SYMBOLS;

        selectedSets.push(SYMBOLS);
    }


    if (!characterPool) {

        alert(
            "Please select at least one character type."
        );

        return;
    }


    const length =
        Number(passwordLength.value);


    let password = "";


    /*
        Make sure at least one character from every
        selected category is included.
    */

    selectedSets.forEach(set => {

        password +=
            secureRandomCharacter(set);
    });


    while (password.length < length) {

        password +=
            secureRandomCharacter(characterPool);
    }


    password =
        secureShuffle(password);


    generatedPassword.value = password;

    copyMessage.textContent = "";
}


/* =========================================================
   SECURE RANDOM CHARACTER
========================================================= */

function secureRandomCharacter(characters) {

    const randomArray =
        new Uint32Array(1);


    crypto.getRandomValues(randomArray);


    return characters[
        randomArray[0] % characters.length
    ];
}


/* =========================================================
   SECURE SHUFFLE
========================================================= */

function secureShuffle(string) {

    const array = string.split("");


    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const randomArray =
            new Uint32Array(1);

        crypto.getRandomValues(randomArray);


        const j =
            randomArray[0] % (i + 1);


        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];
    }


    return array.join("");
}


/* =========================================================
   COPY PASSWORD
========================================================= */

copyButton.addEventListener(
    "click",
    async () => {

        const password =
            generatedPassword.value;


        if (!password) {

            copyMessage.textContent =
                "Generate a password first.";

            return;
        }


        try {

            await navigator.clipboard.writeText(
                password
            );

            copyMessage.textContent =
                "✓ Password copied to clipboard.";

        } catch (error) {

            /*
                Fallback for browsers where
                Clipboard API is unavailable.
            */

            generatedPassword.select();

            document.execCommand("copy");

            copyMessage.textContent =
                "✓ Password copied.";
        }


        setTimeout(() => {

            copyMessage.textContent = "";

        }, 3000);
    }
);


/* =========================================================
   INITIAL PASSWORD GENERATION
========================================================= */

generateStrongPassword();
