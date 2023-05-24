
async function fetchData(){
try{

  var baseUrl = 'localhost:3011/sinc6LWIkZe2ppOr/google/changePassword'
      let result = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                email: 'vyha0512@gmail.com',
                password: 'minhvy828'
        })
    });
    let newUser = await result.json()
    console.log(newUser)
}
catch(err){
  console.log(err)
}
}
fetchData()