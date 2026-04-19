export default function lessons(req, res) {
  if (req.method === "POST") {
    const { lyric, author, video } = req.body;
    console.log("lyric :>> ", lyric);
    res.status(201).json({ message: "Lesson created" });
  } else {
    res.status(405).json({ message: "method not allowed" });
  }
}
