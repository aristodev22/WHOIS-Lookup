let resultDiv = document.getElementById("result-div");
let resultCont = document.getElementById("result-cont");
let loaderSpin = document.getElementById("loader");
const inputForm = document.getElementById("input-form");

inputForm.addEventListener('submit', function(event){
    event.preventDefault(); 
    loaderSpin.classList.replace("hidden", "flex");
    const formData = new FormData(this);
    let domainName = formData.get('domaininput');
    var dotCom = domainName.slice(-3);
    console.log(domainName);
    fetch("https://whois-seeker.onrender.com/getwhois", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(Object.fromEntries(formData)) 
        })
        .then(function(resp){
            return resp.text()
             })
             .then(function(data){
                    var divElements = "";
                    var responseArr = data.split("\n");

                    if (dotCom === "com"){
                        var newArr1 = responseArr.slice(-34, -28);
                        var newArr2 = responseArr.slice(-27, -3);
                        var newArr3 = responseArr.slice(-3);
                        var newArr4 = responseArr.slice(0, -35)
                        
                        // .split("\n");
                        
                        var termsFn = `
                        <div class="text-gray-900 px-1 py-2 xs:px-2 text-lg break-words">${newArr1.join("\n")}</div>
                        <div class="text-gray-900 px-1 py-2 xs:px-2 text-lg break-words">${newArr2.join("\n")}</div>
                        <div class="text-gray-900 px-1 py-2 xs:px-2 text-lg break-words">${newArr3.join("\n")}</div>
                        `

                        for (var w = 0; w < newArr4.length; w++) {
                            divElements += `<div class="text-gray-900 px-1 py-2 xs:px-2 text-lg break-words">${newArr4[w]}</div>`;
                        }

                        divElements += termsFn;

                                       
                    } else {
                        for (var i = 0; i < responseArr.length; i++) {
                            divElements += `<div class="text-gray-900 px-1 py-2 xs:px-2 text-lg break-words">${responseArr[i]}</div>`;
                        }
                    }


                    // console.log(divElements);
                    resultDiv.innerHTML = divElements;
                    resultCont.style.display = "block";
                    loaderSpin.classList.replace("flex", "hidden");                    
                })
                .catch(function(error) {
                            console.log(error);
                            resultDiv.innerHTML = "There was a connection error. Please check your internet settings."
                            loaderSpin.classList.replace("flex", "hidden")
                             })     
})