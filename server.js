const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')
const app = express()

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1, priceId: 1, genreId:1},
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1, priceId: 2, genreId:3 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1, priceId: 3 , genreId:7},
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2, priceId: 4 , genreId:8},
	{ id: 5, name: 'The Two Towers', authorId: 2 , priceId: 5, genreId:3},
	{ id: 6, name: 'The Return of the King', authorId: 2, priceId: 6 , genreId:6},
	{ id: 7, name: 'The Way of Shadows', authorId: 3 , priceId: 7, genreId:4},
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 , priceId: 2, genreId:2}
]

const prices = [
	{ id: 1, name: '50$'},
	{ id: 2, name: '520$'},
	{ id: 3, name: '503$'},
	{ id: 4, name: '5012$'},
	{ id: 5, name: '5045$'},
	{ id: 6, name: '505$'},
	{ id: 7, name: '506$'},
	{ id: 8, name: '506$'}
]

const genres = [
  { id: 1, name: 'Fiction'},
	{ id: 2, name: 'Novel'},
	{ id: 3, name: 'Narrative'},
	{ id: 4, name: 'Horro'},
	{ id: 5, name: 'Historical Fiction'},
	{ id: 6, name: 'Mystery'},
	{ id: 7, name: 'Fantasy'},
	{ id: 8, name: 'Science Fiction'}
]


// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: 'HelloWorld',
//         fields: ()=> ({
//             message: { 
//                 type : GraphQLString,
//                 resolve : ()=> 'Hello World hi'
//             },
//             name : {
//                 type : GraphQLInt,
//                 resolve : ()=> 5
//             }
//         })
//     })
// })

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
      authorId: { type: GraphQLNonNull(GraphQLInt) },
      author: {
        type: AuthorType,
        resolve: (book) => {
          return authors.find(author => author.id === book.authorId)
        }
      },
      priceId: { type: GraphQLNonNull(GraphQLInt)},
      price: {
        type: PriceType,
        resolve: (book) => {
          return prices.find(price => price.id === book.priceId)
        }   
      },
      genreId: { type: GraphQLNonNull(GraphQLInt) },
      genre: {
        type: GenreType,
        resolve: (book) => {
          return genres.find(genre => genre.id === book.genreId)
        }
      }
    })
  })

  const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents a author of a book',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
      books: {
        type: new GraphQLList(BookType),
        resolve: (author) => {
          return books.filter(book => book.authorId === author.id)
        }
      }
    })
  })

  const PriceType = new GraphQLObjectType({
    name: 'Price',
    description: 'This represents the Price of a Book',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) }
    })
  })

  const GenreType = new GraphQLObjectType({
    name: 'Genre',
    description: 'This represents the Genre of a Book',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) }
    })
  })


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description : 'Root Query',
    fields : ()=> ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of all Books',
            resolve: ()=> books
        },
        authors: {
          type: new GraphQLList(AuthorType),
          description: 'List of All Authors',
          resolve: () => authors
        },
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
    // mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
  }))
app.listen(5000, () => console.log('Server Running'))