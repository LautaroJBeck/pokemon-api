import TemplatePokemon from "../components/TemplatePokemon"
import Image from "next/image"
import Head from "next/head"
import Loading from "../components/Loading"
import { useState,useEffect } from "react"
const index = () => {
    const [pokemones, setPokemones] = useState([])
    const [contador,setContador]=useState(0)
    const [busqueda,setBusqueda]=useState("")
    const [loading,setLoading]=useState(false)
    const [errorMessage,setErrorMessage]=useState(false)
    const [pokemonesFavoritos,setPokemonesFavoritos]=useState([])
    const [errorPokemonesFavoritos,setErrorPokemonesFavoritos]=useState(false)
    const handleFetch=async()=>{
        setLoading(true)
        setErrorMessage(false)
        setErrorPokemonesFavoritos(false)
        let res=await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${contador*25}&limit=25`)
        let json=await res.json()
        let pokemones=json.results.map(async el=>{
            let res=await fetch(el.url)
            let json=await res.json()
            return json
        })
        const resultados=await Promise.all(pokemones)
        setPokemones(resultados)
        setLoading(false)

    }
    const handlePokemonFavorito=(pokemon)=>{

        const updated=[...pokemonesFavoritos]
        const isFavorite=updated.indexOf(pokemon)
        if(isFavorite>=0){
            updated.splice(isFavorite,1);
        }else{
            updated.push(pokemon)
        }
        setPokemonesFavoritos(updated)
        localStorage.setItem("pokemonesFavoritos",JSON.stringify(updated))
    }
    const handleNuevaPagina=(tipo)=>{
        if(tipo=="sumar"){
            if(contador!==44){
                setContador(contador+1)
            }
        }else if(tipo=="restar"){
            if(contador!==0){
                setContador(contador-1)
            }
        }
    }
    const handleSearch=async(e)=>{
        e.preventDefault();
        setErrorPokemonesFavoritos(false)
        try{
            if(!busqueda){
                return
            }
            setLoading(true)
            setPokemones([])
            setErrorMessage(false)
            
            let res=await fetch(`https://pokeapi.co/api/v2/pokemon/${busqueda}`);
            let json=await res.json();
            let variable=[json]
            setPokemones(variable)
            setLoading(false)
        }catch(err){
            console.log(err)
            setLoading(false)
            setErrorMessage(true)
        }
    }
    const handleVerPokemonesFavoritos=async()=>{
        let nuevosPokemones=pokemonesFavoritos.map(async e=>{
            let res=await fetch(`https://pokeapi.co/api/v2/pokemon/${e}`);
            let json=await res.json();
            return json
        })
        let resultados=await Promise.all(nuevosPokemones);
        console.log(resultados)
        if(resultados.length>0){
            setPokemones(resultados)
        }else{
            setErrorPokemonesFavoritos(true)
            setPokemones([])
        }
    }
    const handleValue=(e)=>{
        setBusqueda(e.target.value)
        if(e.target.value==""){
            handleFetch()
        }
    }
    const handleEventoPrincipio=()=>{
        if(localStorage.getItem("pokemonesFavoritos")){
            setPokemonesFavoritos(JSON.parse(localStorage.getItem("pokemonesFavoritos")))
        }else{
            setPokemonesFavoritos([])
        }
    }
    useEffect(() => {
        handleFetch()
        handleEventoPrincipio()
    }, [contador])

    return (
        <>

        <header >
        <Head>
          <title>PokeAPI-Lautaro Beck</title>
          <meta charset="utf-8" />
          <link rel="icon" href="img/favicon-48x48.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="apple-touch-icon" href="img/apple-touch-icon-114x114.png" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Roboto:wght@400;700&display=swap" rel="stylesheet"/>
        </Head>
            <div>
                <Image src="/img/pokeapipng.png" 
                width={280}
                height={75}
                className="imagen-header"
                alt="Pokemon api" />
            </div>
        </header>
        <section className="search-container">
            <form>
                <input 
                placeholder="Busca un pokemon..." 
                value={busqueda}
                onChange={(e)=>handleValue(e)}
                type="text" />
            </form>
            <button onClick={handleSearch}>Buscar</button>
        </section>
        <main>
            {
            (errorMessage||errorPokemonesFavoritos)||            
            <div className="parte-arriba">
                <div className="page-container">
                    <button onClick={()=>handleNuevaPagina("restar")}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <span>{contador+1} de 45</span>
                    <button onClick={()=>handleNuevaPagina("sumar")}>
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
                <div className="favorite-container">
                    <div>
                    <i className="fa-solid fa-star estrella-arriba"></i>
                    <p>{pokemonesFavoritos?pokemonesFavoritos.length:0}</p>
                    </div>
                    
                    <button onClick={()=>handleVerPokemonesFavoritos()} className="button-favorite">Ver pokemones favoritos</button>
                </div>
            </div>
            }
            {errorPokemonesFavoritos&&(
                <>
                <h3 className="error-message">No tienes pokemones favoritos seleccionados</h3>
                <button className="button-aceptar" onClick={()=>handleFetch()}>Aceptar</button>
                </>
            )}
            {errorMessage&&(
            <>
            <h3 className="error-message">No se pudo hallar el pokemon que querías buscar</h3>
            <button className="button-aceptar" onClick={()=>handleFetch()}>Aceptar</button>
            </>
            )}
            {loading&&<Loading/>}
            <article className="grid-container">
                {pokemones&&!loading?pokemones.map(el=><TemplatePokemon key={el.id} handlePokemonFavorito={handlePokemonFavorito} pokemonesFavoritos={pokemonesFavoritos} pokemon={el}/>):<></>}
            </article>
        </main>
        </>
    )
}



export default index
