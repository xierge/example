const axios = require("axios")


const request = axios.create({
    headers:{
        cookie:"wordpress_sec_7a3afe25d4915108ac3f328da201be3e=lpx1%7C1687948059%7Cj4wEgHwq5VwFABlM7cPxeHLshICzvtSIEfLj1RpgTtI%7Cf165796614285327eaceaa4be2ab9e1d9a03b5780066fc81567739bad13451bb; PHPSESSID=4c1q7slu3pm94ucn7soegpha81; wordpress_logged_in_7a3afe25d4915108ac3f328da201be3e=lpx1%7C1687948059%7Cj4wEgHwq5VwFABlM7cPxeHLshICzvtSIEfLj1RpgTtI%7C6f34a54664cca7e753e958607341337694de0ba3ae15f612a621afa1cafed83b"
    }
})


module.exports = request