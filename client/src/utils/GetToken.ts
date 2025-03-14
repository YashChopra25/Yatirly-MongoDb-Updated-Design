import cookie from "js-cookie"
const GetToken = () => {
    const token = cookie.get("token")
    return token
}



export {
    GetToken
}