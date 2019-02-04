const connection = require("../../dbConnexion");
const axios = require("axios");
const { getUserById } = require("../actions/users");
  

async function updateWallet(id, newWallet) {
    const queryString = "UPDATE users SET user_wallet = ? WHERE user_id = ?"
    return new Promise((resolve, reject) => {
        connection.query(queryString, [newWallet, id], (err, result, fields) => {
            if (err) {
                console.log("error wallet", err)
                reject( {code: 507, message: `bad request: ${err}`} )
            }
            console.log("fields = ", result.affectedRows)
            if (result.affectedRows === 1) {
                resolve( getUserById(id)) 
            } else {
                resolve( {code: 207, message: "user not found"} )
            }
        })
    })
}

async function getWallet(id) {
    const queryString = "SELECT user_wallet from users WHERE user_id = ?"
    return new Promise((resolve, reject) => {
        connection.query(queryString, [id], (err, result, fields) => {
            if (err) {
                console.log("error: ", err)
                reject( {code: 508, message: `badrequest ${err}` } )
            }
            console.log("result get wallet: ", result)
            if (result.length > 0) {
                resolve( { code: 200, message: "success", wallet: result[0].user_wallet} )
            } else {
                resolve( {code:207, message: "user not found"} )
            }
        })
    })
}

module.exports = { updateWallet, getWallet }