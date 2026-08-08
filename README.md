# 🔐 Password Strength Analyzer

A browser-based Password Strength Analyzer and Secure Password Generator built using HTML, CSS, and JavaScript.

This project is designed as an educational Cyber Security / BTech CSE project.

## 🚀 Features

### Password Analyzer

The application checks:

- Password length
- Uppercase letters
- Lowercase letters
- Numbers
- Special characters
- Repeated characters
- Sequential patterns
- Common passwords
- Character pool size
- Estimated password entropy

### Strength Score

The password receives a score between 0 and 100.

| Score | Strength |
|------:|----------|
| 0–20 | Very Weak |
| 21–40 | Weak |
| 41–60 | Moderate |
| 61–80 | Strong |
| 81–100 | Very Strong |

### Password Generator

The application can generate strong random passwords.

Users can configure:

- Password length
- Uppercase letters
- Lowercase letters
- Numbers
- Special characters

The generator uses the browser's `crypto.getRandomValues()` API instead of `Math.random()`.

## 🔒 Privacy

This application is designed to analyze passwords locally.

Passwords are:

- Not uploaded to a server
- Not stored in a database
- Not saved in localStorage
- Not transmitted over the network

However, users should still avoid entering real passwords into websites or tools they do not trust.

## 🛠️ Technologies

- HTML5
- CSS3
- JavaScript
- Web Crypto API

## 📁 Project Structure

```text
password-strength-analyzer/
│
├── index.html
├── style.css
├── script.js
└── README.md
