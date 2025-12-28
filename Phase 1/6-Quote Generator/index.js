const btn = document.querySelector('#btn')
const author= document.querySelector('#author')
const quote= document.querySelector('#quote')



btn.addEventListener('click',()=>{
    fetch('https://dummyjson.com/quotes/random')
    .then(res => res.json())
    .then(data =>{
        quote.textContent=`${data.quote}`
        author.textContent=`${data.author}`
    })
    .catch(err => console.error('Error fetching Quote:',err))
})

btn()