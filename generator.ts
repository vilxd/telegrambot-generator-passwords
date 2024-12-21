
async function generator(password_length: number){
    const url = `https://api.genratr.com/?length=${password_length}&uppercase&lowercase&special&numbers`
    const req = await fetch(url)
    const data = await req.json()
    
    return data.password
}

export {
    generator
}