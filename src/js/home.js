

( async function load(){
  
    async function getData(url){
      const response  = await fetch(url)
      if (response.ok == true){
        const data = response.json()
        return data;
      }
      throw new Error('No se encontro ningun resultado') 
    }

    $List1 = document.getElementById('action')
    $List2 = document.getElementById('drama')
    $List3 = document.getElementById('animation')
    $overlay = document.getElementById('overlay')
    $modal = document.getElementById('modal')
    $hidemodal = document.getElementById('hide-modal')
    $modalh1 =  $modal.querySelector('h1')
    $modalSrc = $modal.querySelector('img')
    $modalP = $modal.querySelector('p')
    $form  = document.getElementById('form')
    $home  = document.getElementById('home')
    $featuring = document.getElementById('featuring')
    $modalcontent = document.getElementById('modal-content')

    const URL_BASE = 'https://pokeapi.co/api/v2/'
    const URL_USER = 'https://randomuser.me/api/?results=6'
    const URL_MOVIES = 'http://www.omdbapi.com/?t=Game of Thrones&Season=1&apikey=76dce3c4'

    function showModal(message){

      $overlay.classList.add('active')
      
      $modalP.textContent = message
      $modalSrc.setAttribute('src', 'src/images/warning.png')
      $modalh1.classList.add('modalh1')
      $modal.classList.add('error')
      $modalcontent.classList.add('error')

      $modal.style.animation = 'modalIn .8s forwards'
    }

    function featuringTemplate(pokemon){
      return(
        `
        <div class="featuring">
        <div class="featuring-image">
          <img src="${pokemon.sprites.front_default}" width="70" height="100" alt="">
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pokemon encontrado</p>
          <p class="featuring-album">${pokemon.name}</p>
        </div>
      </div>
        `
      )
    }
    function setAttributes($element, Attributes){
      for(const attribute in Attributes){
        $element.setAttribute(attribute, Attributes[attribute])
      }
    }


    $form.addEventListener('submit',async (event) => {
      event.preventDefault()
      $home.classList.add('search-active')
      $featuring.innerHTML = ''
      const $loader = document.createElement('img')
      setAttributes($loader, {
        src : 'src/images/loader.gif' ,
        heigth: 50 , 
        width : 50 ,
      })
      $featuring.append($loader)
      
      try {
        const data = new FormData($form)
        const pokemon = await getData(`${URL_BASE}pokemon/${data.get('name')}`)
        const htmlString  =  featuringTemplate(pokemon)
        $featuring.innerHTML = htmlString
        
      } catch (error) {
        $loader.remove()
        $home.classList.remove('search-active')
        
        showModal(error.message)
      }
    })
    
    $hidemodal.addEventListener('click',() =>{
      $overlay.classList.remove('active')
      $modal.style.animation = 'modalOut .8s forwards'
          
      setTimeout(function(){
        $modal.classList.remove('error');   
        $modalcontent.classList.remove('error');
      },1000)
    })

    function addShowModal($element){
      $element.addEventListener('click' , () => {
        
        $overlay.classList.add('active')
        $modalh1.classList.remove('modalh1')
        $modalh1.textContent = $element.dataset.title
        $modalSrc.setAttribute('src' , $element.dataset.imgsrc)
        $modalP.textContent = $element.dataset.about
        $modal.style.animation = 'modalIn .8s forwards'

      })
    }

    function objItemTemplate(pokemon, category){

      return (
      `<div class="primaryPlaylistItem" data-id="${pokemon.order}" data-title=${pokemon.name} data-imgsrc = ${pokemon.sprites.front_default} data-about=${pokemon.abilities[0].ability.name}>
        <div class="primaryPlaylistItem-image">
          <img src="${pokemon.sprites.front_default}">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${pokemon.name}
        </h4>
      </div>`
      )  
    }

    function createTemplate(htmlString){
        const html  = document.implementation.createHTMLDocument()
        html.body.innerHTML = htmlString
        return html.body.children[0]
    }

    function AddtoHtml(pokemon , $container, category){

      const htmlString  = objItemTemplate(pokemon, category)
      const htmlElement = createTemplate(htmlString)
      $container.append(htmlElement)
      addShowModal(htmlElement)

      const image = htmlElement.querySelector('img')
      image.addEventListener('load', (event) => {
        event.srcElement.classList.add('fadeIn')
      })
    }
   
    async function cacheExist(pokemonUrl){
      const pokeinfo = window.localStorage.getItem(pokemonUrl.pokemon.name)
      if (pokeinfo){
        return JSON.parse(pokeinfo)
      }
      const data = await getData(pokemonUrl.pokemon.url)
      window.localStorage.setItem(data.name, JSON.stringify(data))
      return data
    }


    //async function for 'ActionList of pokemon type 1'
    
    getData(`${URL_BASE}type/1`).then(ListPokemon =>{
      let counter = 0
      $List1.children[0].remove()
        return ListPokemon.pokemon.reduce((sequence, pokemonUrl) =>{
          return sequence.then(() =>{
             if(counter<6){ return cacheExist(pokemonUrl) }
              }).then(pokemon =>{
                if(counter < 6){
                  AddtoHtml(pokemon, $List1, 'action')
                  counter++
                }
              })
            }, Promise.resolve());
    }).then(() =>{ 
      console.log('All done')
    }).catch(error => {console.log(error)})

    getData(`${URL_BASE}type/2`).then(ListPokemon => {
      let pokemonList  = [] 
      let counter = 0
      $List2.children[0].remove()
      return ListPokemon.pokemon.reduce((sequence, pokemonUrl) =>{
        return sequence.then(()=>{
          if(counter<6){return cacheExist(pokemonUrl)}
           }).then(pokemon =>{
              if(counter < 6){
                AddtoHtml(pokemon, $List2 , 'drama')
                counter++
              }
          })
       }, Promise.resolve())
    }).then(()=>{ 
     
    }).catch(err => {console.log(err)})

    getData(`${URL_BASE}type/3`).then(ListPokemon =>{
      let pokemonList  = [] 
      let counter = 0
      $List3.children[0].remove()
        return ListPokemon.pokemon.reduce((sequence, pokemonUrl) =>{
          return sequence.then(() =>{
               if(counter < 6){ return cacheExist(pokemonUrl) }
              }).then(pokemon =>{ 
                  if(counter < 6){
                    AddtoHtml(pokemon, $List3, 'animation')
                    counter++
                  }
                })
        }, Promise.resolve());
    }).then(() =>{ 
     
    }).catch(error => {console.log(error)})

    $userList =  document.getElementById('userList')
    $movieList =  document.getElementById('movieList')

    function movieTemplate(movie){
      return(
        `
        <li class="myPlaylist-item">
              <a href="#">
                <span>
                  ${movie.Title}
                </span>
              </a>
        </li>
        `
      )
    }

    function userTemplate(user){
      return(
        `
        <li class="playlistFriends-item">
        <a href="#">
          <img src="${user.picture.thumbnail}" alt="echame la culpa" />
          <span>
            ${user.name.title} ${user.name.first} ${user.name.last}
          </span>
        </a>
      </li>
        `
      )
    }

    function renderList(userList , $container,flag){
      
      userList.forEach( user => {
        let htmlString = ''
        if (flag){
           htmlString  =  userTemplate(user)
        }else{
           htmlString = movieTemplate(user)
        }
        const htmlElement = createTemplate(htmlString)
        $container.append(htmlElement)
      })
    }

    const { results : userList }= await getData(URL_USER)
    renderList(userList, $userList,true)


    const { Episodes : movieList } = await getData(URL_MOVIES)
    console.log(movieList)
    renderList(movieList, $movieList, false)

})()





// All code Async

/*  async function getData(url){
    
    const resul  = await fetch(url)
    const data = await resul.json()
    return data
  }

  getData('https://pokeapi.co/api/v2/type/3').then(function(story) {
    console.log(story);
  debugger
    return story.pokemon.reduce(function(sequence, chapterUrl) {
      // Once the last chapter's promise is done…
      return sequence.then(function() {
        // …fetch the next chapter
        return getData(chapterUrl.pokemon.url);
      }).then(function(chapter) {
        // and add it to the page
        console.log(chapter.name);
      });
    }, Promise.resolve());
  }).then(function() {
    // And we're all done!
    console.log("All done");
  }).catch(function(err) {
    // Catch any error that happened along the way
    console.log("Argh, broken: " + err.message);
  })
*/