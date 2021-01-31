# ProctoPro
Exam proctoring - TypingDNA Hackathon app




<!-- PROJECT LOGO -->
<br />
<p align="center">
  <img src="server/public/images/icon.png" alt="Logo" width="80" height="80">
  <p align="center">
    <br />
    <a href="https://proctopro.novem.dev/">View Demo</a>
    ·
    <a href="https://exam-proctorer.herokuapp.com/">Alternative link</a>
  </p>
</p>




<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Screenshots](#screenshots)
* [Installation](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Usage](#usage)
* [Team](#team)
* [Contact](#contact)
* [Credits](#credits)



<!-- ABOUT THE PROJECT -->
## About The Project

[![Proctopro Screenshot][product-screenshot-1]](https://novem.dev)

This project, realized for the [Devpost Hackathon](https://typingdna.devpost.com/) proposed by [TypingDNA](https://www.typingdna.com/) implements the api in a web app running on Node.js. The app is basically an exam proctoring system that includes the following features:
* Login/Signup system
    * Uses MongoDB database hosted on mLabs
    * Hashed passwords for security
    * Token generation and validation using [json web token](https://www.npmjs.com/package/jsonwebtoken)
    * Data validation
* Initialization system
    * Newly created users are marked as not initialized with TypingDNA
    * Users are requested to type three sentences (see screenshot above)
    * Gets three typing patterns of the user and saves them in the typingDNA database.
* Exam system
    * ID system to access to specific exams
    * Practice exam available to get to know the system
    * Mouse position monitoring to prevent cheating
    * Right click disabled
    * Timed exams feature
    * Change theme (dark/light) 
    * 3 types of questions (short, development, multiple choice)
    * TypingDNA match available at the end of the exam
* Backend System
    * Creation/Edition of exams using Postman

Here's what drove us to build this project:
* In difficult times like the situation of Covid-19, society shows how vulnerable it is. This project aims to lower cheating in online exams.
* We think that if each person has its own typing pattern, then the technology must be extended to more formal fields such as education.
* And of course, who doesn't like a good challenge !



### Built With

* [NodeJS](https://nodejs.org/en/)
* [ReactJS](https://reactjs.org/)


<!-- SCREENSHOTS -->
## Screenshots
[![Proctopro Screenshot][product-screenshot-2]](https://novem.dev)
[![Proctopro Screenshot][product-screenshot-3]](https://novem.dev)
[![Proctopro Screenshot][product-screenshot-4]](https://novem.dev)
[![Proctopro Screenshot][product-screenshot-5]](https://novem.dev)
[![Proctopro Screenshot][product-screenshot-6]](https://novem.dev)
[![Proctopro Screenshot][product-screenshot-7]](https://novem.dev)


<!-- GETTING STARTED -->
## Getting Started

You will find here the instructions on how to install/run the project on your machine.

### Prerequisites

A key prerequisite is Node.js so we suggest installing node v12.18.3 with npm 6.14.6.
* npm
```sh
npm install npm@latest -g
```

* Get your api key from [TypingDNA](https://www.typingdna.com/clients/)
* Create an [mlab](https://mlab.com/signup/) database and get your database url from https://mlab.com/databases/your_database_name


### Installation

1. Clone the repo
```sh
git clone https://github.com/anisdzdev/typing_dna.git
```
2. Install NPM packages
```sh
npm install
```
3. Install global packages
```sh
npm install -g nodemon@2.0.2
```
4. Enter your TypingDNA public and secret keys in the following file
    * config/default.json
5. Also enter your database url in the same file, it should looke like this:
```sh
mongodb://username:password@ds01316.mlab.com:1316/db
```
6. Run the project
```sh
npm run start
```
7. Go to localhost:3000 (default port) to access the running app


### Usage
1. Create an account using the signup link under the login form.
2. Write the 3 required sentences to initialize your account and save your typing pattern. (You can always reset if you feel the need to do so)
3. Once you initialize your account once, you will be redirected to a page prompting an exam ID. Enter 123456789 for an actual exam or click "Enter practice mode" under the "start" button to start an exam.
4. In the exam page, fill in the blanks as you would do in an actual exam, respecting instructions.
5. After submitting your exam, your matching percentage is displayed on the screen (This would disappear in future updates where the professor panel is implemented).


<!-- ROADMAP -->
## Team

* [Anis Brachemi](https://github.com/anisdzdev): Fullstack development of the application
* [Saoud Messaoudi](https://github.com/saoudmessaoudi): Backend and Database Developer
* [Kassem El-Zoghbi](https://github.com/NvmKassem): Frontend developer
* [Lucas Cimino](https://github.com/lucas-cimino): Security management
* [Holy Mouaya](https://github.com/Holy-Mouaya): Design and Visual


<!-- CONTACT -->
## Contact

Anis Brachemi - [@anis.brachemi](https://www.instagram.com/anis.brachemi/) - anis@novem.dev
Saoud Messaoudi - [@saoudsss](https://www.instagram.com/saoudsss/) - saoud@novem.dev


<!-- ACKNOWLEDGEMENTS -->
## Credits
* [Github Reddice Project](https://github.com/Remchi/reddice)
* [Colorlib login template](https://colorlib.com/wp/template/login-form-v2/)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[product-screenshot-1]: screenshots/1.png
[product-screenshot-2]: screenshots/2.png
[product-screenshot-3]: screenshots/3.png
[product-screenshot-4]: screenshots/4.png
[product-screenshot-5]: screenshots/5.png
[product-screenshot-6]: screenshots/6.png
[product-screenshot-7]: screenshots/7.png

