import app from "./app";

const server = app.listen(app.get("port"), () => {
    console.log(`Server is running on http://localhost:${app.get("port")}`);
});
