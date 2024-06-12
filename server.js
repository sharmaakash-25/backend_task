const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const app = express()
const port = 3000

app.use(bodyParser.json())

const mongoURI = "mongodb://localhost:27017/booksdb"

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch(error => {
    console.error("Error connecting to MongoDB", error)
  })

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  publishedDate: Date,
  pages: Number,
})

const Book = mongoose.model("Book", bookSchema)

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find()
    res.status(200).json(books)
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.post("/books", async (req, res) => {
  try {
    const book = new Book(req.body)
    await book.save()
    res.status(201).json(book)
  } catch (error) {
    res.status(400).json({ error: "Bad Request" })
  }
})

app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params
    const book = await Book.findByIdAndDelete(id)
    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }
    res.status(200).json({ message: "Book deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
