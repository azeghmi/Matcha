const faker = require('faker/locale/en');
const passwordHash = require("password-hash");
const randomLocation = require('random-location');
const pool = require('../config/connection');
var dateformat = require('dateformat');

function calcAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
}


async function matchAppFaker(req, res) {
    try {
        // GENERATE 500 USERS -----------------------------------------
        // RESET SEQUENCE
        text = 'ALTER TABLE users AUTO_INCREMENT = 1';

        await pool.query(text);
        // for (let i = 2; i < 501; i++) {
            for (let i = 5; i < 27; i++) {
            const P = {
                latitude: 48.9060765, 
                longitude: 2.3149116999999997
            };
            
            const R = 501000;
            console.log("Add " + i + " users");
            let gender = ["Man", "Woman"];
            let interested = ["Homosexual", "Homosexual", "Pansexual", "Heterosexual", "Bisexual"];
           
            const randomPoint = randomLocation.randomCirclePoint(P, R)
            const text = 'INSERT INTO users SET userId = ?, firstName = ?, lastName = ?, age = ?, username = ?, email = ?,password = ?, gender = ?, bio = ?, sexpref = ?, geoloc = ?, position = ?, lastConnection = ?, tokenmail = ?, mail_active = ?';
            const values = [
                i,
                faker.name.firstName(),
                faker.name.lastName(),
                calcAge(faker.date.between('1970-01-01T11:25:19.644Z', '2000-01-01T11:25:19.644Z')),
                faker.internet.userName(),
                faker.internet.email(),
                passwordHash.generate(faker.internet.password()),
                gender[Math.round(Math.random())],
                "J'aime la vie",
                interested[Math.floor(Math.random() * 4) + 1],
                randomPoint.latitude + ', ' + randomPoint.longitude,
                "1",
                dateformat("mediumDate"),
                "cc45bb3397be8523261c196652d7604c",
                "1",
            ];
            await pool.query(text, [values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9], values[10], values[11], values[12], values[13], values[14]], function (err) {
                if (err) console.log(err, "SOMETHING WENT WRONG");
            })
        }

        // GENERATE USERS PICTURES -----------------------------------
        text = 'ALTER TABLE images AUTO_INCREMENT = 1';


        function genderSelect() {
            let randomIdx = Math.floor(Math.random() * 2);
            if (randomIdx !== 1) {
                return "male"
            } else {
                return "female";
            }
        }
        await pool.query(text);
        // for (let i = 2; i < 501; i++) {
            for (let i = 5; i < 27; i++) {
            let randomGender = genderSelect();
            let photoGender = '';
            let photoNo = Math.floor(Math.random() * 99);
            if (randomGender === "male") photoGender = "men";
            if (randomGender === "female") photoGender = "women"

            console.log("Add Picture for user " + i);
            const text = 'INSERT INTO images SET id = ?, name =?, userId = ? ,profil = ?';
            const values = [i, `https://randomuser.me/api/portraits/${photoGender}/${photoNo}.jpg`, i, 1];
            await pool.query(text, values, function (err) {
                if (err) console.log(err, "SOMETHING WENT WRONG");
            })
        }

        // GENERATE USERS_tags -----------------------------------
        text = 'ALTER TABLE user_tags AUTO_INCREMENT = 1';
        await pool.query(text);
        // for (let i = 2; i < 501; i++) {
            for (let i = 5; i < 27; i++) {
            console.log("Add tags for user " + i);
            for (let j = 0; j < 3; j++) {
                const text = 'INSERT INTO user_tags SET userId =?, tagId = ?';
                const values = [i, faker.random.number({ min: 1, max: 10 })]
                await pool.query(text, values, function (err) {
                    if (err) console.log(err, "SOMETHING WENT WRONG");
                })
            }
        }
    } 
    catch (error) {
        console.log(error);
        return res.status(400).json({
            warnings: ["Error during create profiles.."]
        })
    }
}

exports.matchAppFaker = matchAppFaker;