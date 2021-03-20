export default (req, res) => {
    res.setHeader(
        'Set-Cookie',
        'connect.sid=deleted; Max-Age=0; SameSite=Strict;HttpOnly;Path=/'
    )
    res.send(200);
}