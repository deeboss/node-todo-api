const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


const data = {
	id: 10
}

const token = jwt.sign(data, '123abc');
const decodeToken = jwt.verify(token, '123abc');

console.log(`token: ${token}`);
console.log('---');
console.log('decodeToken: ', decodeToken);

// const message = "I am number four";
// const hash = SHA256(message).toString();


// console.log(`Message: ${message}`);
// console.log('---');
// console.log(`Hash: ${hash}`);


// // User ID = 4
// const data = {
// 	id: 4
// };

// // For User ID 4, we hash the data through SHA256.
// // Then we salt it by adding a uniquely randomised id
// // This is because hashing will always provide the exact
// // same result for the same values passed in through the hash.
// // Salting it will add an additional layer of protection by
// // randomising the hash at the very end.
// const token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'sumsecret').toString()
// }


// // Example of Man in the Middle attack
// // They would change the id of it and try to get the hashed value of
// // the new id
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
// // End example

// const resultHash = SHA256(JSON.stringify(token.data) + 'sumsecret').toString();


// if (resultHash === token.hash) {
// 	console.log("Data was not changed. Seems trustworthy");
// } else {
// 	console.log("Data was changed. Do not trust");
// }