import Express from "express";

const app = Express();

app.get("/", (req, res) => {
    res.send("Hello, World!. This server is up");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});