const handler = async (req, res) => {
    return res.status(200).json({ headers: req.headers });
}

export default handler;