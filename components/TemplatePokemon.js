const TemplatePokemon = ({pokemon,handlePokemonFavorito,pokemonesFavoritos}) => {
    let array=[]
    for(let i=0;3>i;i++){
        let objeto={
            name:pokemon.stats[i].stat.name,
            cantidad:pokemon.stats[i].base_stat,
        }
        array.push(objeto)
    }
return (
    <>
    <div className="template-pokemon">
                <div className="img-pokemon-container">
                    <div className="img-pokemon">
                   {pokemon.sprites?(
                        <img src={pokemon.sprites.front_default} alt=""/>
                   ):<></>}
                    </div>
                   <div className="div-oculto">
                    {array.map(el=>(
                        <>
                       <div>
                       <span className="span-oculto-title">{el.name}: </span>
                       <span className="span-oculto-stats">{el.cantidad}</span>
                       </div>
                       </>
                       ))}
                   </div>
                </div>
                <div className="text-pokemon-container">
                    <div className="pokemon-text">
                        <p>{pokemon.name}</p>
                        <p>#{pokemon.id}</p>
                    </div>
                    <div className="pokemon-type">
                        <div>
                        {pokemon.types?pokemon.types.map(el=>(
                            <span>{el.type.name} </span>
                        )):<></>}
                        </div>

                        {pokemonesFavoritos?
                        <i
                        onClick={()=>handlePokemonFavorito(pokemon.name)}
                        className={`fa-solid fa-star i-hover ${pokemonesFavoritos.includes(pokemon.name)?"i-amarillo":""}`}></i>
                        :
                        <i 
                        onClick={()=>handlePokemonFavorito(pokemon.name)}
                        className={`fa-solid fa-star i-hover`}></i>
                        }
                    </div>
                </div>
            </div>  
    </>
)
}

export default TemplatePokemon

