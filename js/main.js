// ACNH Seasonal Bug, Fish & Sea Creature Guide

const selectMonth = document.getElementById('month')
const selectCritterType = document.getElementById('critterType')
const titleType = document.querySelector('.availableTypeTitle')

let url
let filteredSearch

// Event Listeners
document.querySelector('.returnAllCreatures').addEventListener('click', getFetch)

// Fetch data from ACNH Api
async function getFetch(){
  try {
    // Remove initial background styling
    document.body.style.backgroundImage = "none"
    
    // Clear existing cards if previously queried
    const availCards = document.querySelector('.availableCards')
    if (availCards.children.length > 1) {
      const clear = await clearCards()
    }

    // Get Creature type to fetch url and return data
    url = getCreatureType()
    const res = await fetch(url)
    const data = await res.json()
    console.log(data)

    document.querySelector('.searchInput').addEventListener('input', autocompleteSearch)
          
        // Loop through data to return a card for each data entry available

        for (let i = 0; i < data.length; i++) {
          // Create list of months available for the entry
          const monthsArray = getListOfMonthsAvail()
          // Returns clone of card for each item in the array
          const node = document.querySelector('.availableCard')
          const cloneCard = node.cloneNode(true)
          const availableCards = document.querySelector('.availableCards')
          availableCards.appendChild(cloneCard)

          // General data pulled from the API to place in the card
          const name = nameCasing()
          const catchPhrase = document.querySelector('.catchPhrase')
                catchPhrase.innerText = data[i]["catch-phrase"]
          const image = document.querySelector('.image')
                image.src = data[i].image_uri
          const location = document.querySelector('.location')
                location.innerText = `Location: ${data[i].availability.location}`
          const timeAvailable = findTimeAvailable()
          const monthsAvailable = findMonthsAvailable()
          const rarity = document.querySelector('.rarity')
                rarity.innerText= `Rarity: ${data[i].availability.rarity}`
          const museumPhrase = document.querySelector('.museumPhrase')
                museumPhrase.innerText = data[i]["museum-phrase"]
          const price = document.querySelector('.price')
                price.innerText = `Price: ${data[i].price}`
          const NPCPrice =  document.querySelector('.priceNPC')
          const seaSpeed = document.querySelector('.seaSpeed')

          // Handles name casing 
          function nameCasing() {
            const name = data[i].name["name-USen"]
            const casedName = name.split(' ').map(el => `${el[0].toUpperCase()}${el.slice(1)}`).join(' ')
            document.querySelector('.name').innerText = casedName
          }

          // Check if available year round and return months available
          function findMonthsAvailable() {
            const monthsAvailable = document.querySelector('.monthsAvailable')
            if (data[i].availability.isAllYear === true) {
              monthsAvailable.innerText = "Months: All"
            } else {
              monthsAvailable.innerText = `Months: ${data[i].availability["month-northern"]}`
            }
          } 
          // Check if available all day and returns times available
          function findTimeAvailable() {
            const timeAvailable = document.querySelector('.timeAvailable')
            if (data[i].availability.isAllDay === true) {
              timeAvailable.innerText = "Time of Day: Anytime"
            } else {
              timeAvailable.innerText = `Time of Day: ${data[i].availability.time}`
            }
          }
          // Unique data per type to place in card
            // Bugs
            if (url.includes('bugs')) {
              rarity.style.display = "inline"
              NPCPrice.style.display = "inline"
              NPCPrice.innerText = `Flick's Price: ${data[i]["price-flick"]}`
              seaSpeed.style.display = "none"
            // Fish
            } else if (url.includes('fish')) {
              rarity.style.display = "inline"
              NPCPrice.style.display = "inline"
              NPCPrice.innerText = `CJ's Price: ${data[i]["price-cj"]}`
              seaSpeed.style.display = "none"
            // Sea Creatures
            } else if (url.includes('sea')) {
              NPCPrice.style.display = "none"
              location.innerText = "Location: Sea"
              seaSpeed.style.display = "inline"
              seaSpeed.innerText = `Speed: ${data[i].speed}`
              rarity.style.display = "none"
            }
            
            // Function to map months from ACNH format
            function getListOfMonthsAvail() {
              let rangeAvail = data[i].availability["month-northern"]
              const monthsAvail = []
              const months = {
                1 : "January",
                2 : "February",
                3 : "March",
                4 : "April",
                5 : "May",
                6 : "June",
                7 : "July",
                8 : "August",
                9 : "September",
                10 : "October",
                11 : "November",
                12 : "December"
              }

              if (data[i].availability.isAllYear === true) {
                for (let month in months) {
                  monthsAvail.push(months[month])
                }
              } else if (rangeAvail.includes('&')) {
                const ranges = rangeAvail.split(' & ')
                for (let i = 0; i < ranges.length; i++) {
                  splitMonthRange(ranges[i])
                }
              } else {
                splitMonthRange(rangeAvail)
              }

              function splitMonthRange(range) {
                const monthNums = range.split('-')
                if (parseInt(monthNums[0]) > parseInt(monthNums[1])) {
                  for (let i = parseInt(monthNums[0]); i <= 12; i++) {
                    monthsAvail.push(months[i])
                  }
                  for (let j = 1; j <= parseInt(monthNums[1]); j++) {
                    monthsAvail.push(months[j])
                  }
                } else {
                  for (let i = parseInt(monthNums[0]); i <= parseInt(monthNums[1]); i++) {
                    monthsAvail.push(months[i])
                  }
                }
              }
              console.log(monthsAvail)
            }
        }

        // Remove all cards if previously queried before showing new cards
        async function clearCards() {
          while (availCards.children.length > 1) {
            availCards.removeChild(availCards.firstChild);
          }
        }

        // More Info button expandable section
        let moreInfo = document.querySelectorAll(".moreInfo")
        for (let i = 0; i < moreInfo.length; i++) {
          moreInfo[i].addEventListener("click", function() {
            let content = this.nextElementSibling;
            if (content.style.display === "block") {
              content.style.display = "none";
              this.classList.remove("active");
            } else {
              content.style.display = "block";
              this.classList.add("active");
            }
          });
        } 

        ////////////// MODIFY THIS FUNCTION I BUILT TO FILTER CARDS INSTEAD ////////////////
          
        function autocompleteSearch() {
          const namesArray = data.map((el => el.name["name-USen"]))
          let input = document.querySelector(".searchInput").value
          console.log(input)
          const result = data.filter(el => el.name["name-USen"].includes(input))
          console.log(result)
        }

        

        //////// RETURN CARDS BASED ON MONTH AVAIL /////////

        function filterByMonth() {
          data.filter(el => el.availability)
        }

        //////// MAKE THIS CODE BUTTON FOR GET FETCH ALL -- ADD NEW DOM BUTTON FOR IT ////////

        /////// MAKE FRONT END PRETTY AND INTERACTIVE /////////

        
      } catch(error){
        console.log(error)
    }
}


// Choose which type of creature collection to render

function getCreatureType(){
  if (selectCritterType.value === 'bugs') {
    titleType.innerText = "Bugs"
    return url = 'https://acnhapi.com/v1a/bugs'
  } else if (selectCritterType.value === 'fish') {
    titleType.innerText = "Fish"
    return url = 'https://acnhapi.com/v1a/fish'
  } else if (selectCritterType.value === 'seaCreatures') {
    titleType.innerText = "Sea Creatures"
    return url = 'https://acnhapi.com/v1a/sea'
  }
}
