**Shortnr** is a web service used to shorten urls.
The shortened url can also be decoded back into the original url.

**Author**: Ikemefuna Nwankwo

**Technologies Used**: NodeJS + TypeScript

**Framework Used**: Express JS

**Testing/Assertion Library**: Mocha + Chai


### Project Setup

#### Platform Support
The project can be installed on any of these platforms.
- Mac OS X
- Ubuntu
- Windows

#### Prerequisites
The machines where this project will be installed must have the following installed:
1. Node v14.x
2. NPM

#### Preliminary Assumptions
- The web address of the URL shortening service is `https://short.nr`.
- Shortened URLs will look like this `https://short.nr/{urlPath}`, where `urlPath` is a unique identifier for the original URL.
- Visiting the short URL will redirect the user to the original URL.

#### Environment Setup
1. Copy the contents of `.env.example` file in the root directory.
2. Create a new file with the name `.env` in the root directory to store your environment variables. Paste the contents of `.env.example` copied in step 1 above into the `.env` file and modify accordingly (if you have to).

#### Installing Dependencies
Navigate to the root of the project and run `npm install` to install the project's dependencies.

#### Tests
Navigate to the root of the project and run `npm test` and wait for the tests to complete.

#### Running Project
Navigate to the root of the project and run `npm run dev` for development server or `npm start` for production server.

#### Usage
- Use the `POST /encode` API to shorten a valid url.
- Use the `POST /decode` API to decode the shortened URL back to its original URL. 
- Use the `GET /statistics/{urlPath}` API to get statistics about a shortened URL.

#### Documentations
- [Postman Documentation](https://documenter.getpostman.com/view/9558164/Tzsfm5XN)

#### Repository
- [Shortnr Github Repo](https://github.com/nwankwo-ikemefuna/shortnr)

#### Team
- [Ikemefuna Nwankwo](https://www.linkedin.com/in/ikemefunanwankwo) _(Software Engineer)_