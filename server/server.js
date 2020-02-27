const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { Kind } = require('graphql/language');
let aboutMessage = "Issue Tracker API v1.0";
const issuesDB = [
	{id : 1, name : 'test',category :'Shirts', price: 15,image:'1',
	},
];
const resolvers = {
Query: {
about: () => aboutMessage,
	issueList,
},
Mutation: {
setAboutMessage,
issueAdd,
},
};
function issueList() {
return issuesDB;
}

function issueAdd(_, { issue }) {
issue.id = issuesDB.length + 1;
issuesDB.push(issue);
return issue;
}
function setAboutMessage(_, { message }) {
return aboutMessage = message;
}
const server = new ApolloServer({
typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
resolvers,
});
const app = express();
app.use(express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });
app.listen(3000, function () {
console.log('App started on port 3000');
});
