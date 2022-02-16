import React, {useEffect, useState} from "react";
import './App.css'
import Tmdb from "./services/Tmdb/Tmdb";
import MovieRow from "./components/MovieRow";
import FeatureMovie from "./components/FeatureMovie";
import Header from "./components/Header";

export default function App (){

  const [movieList, setMovieList] = useState([])
  const [featureData, setFeatureData] = useState(null)
  const [blackHeader, setBlackHeadre] = useState(false)

  useEffect(()=>{
    const loadAll = async () =>{
      // Pegando todas as listas dos filmes
      let list = await Tmdb.getHomeList()
      setMovieList(list)

      // Pegando filme em destaque (feature)
      let originals = list.filter(i=>i.slug === 'originals')
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1))
      let chosen = originals[0].items.results[randomChosen]
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
      setFeatureData(chosenInfo)
    }

    loadAll()
  },[])

  useEffect(() =>{
    const scrollListener = () => {
      if(window.scrollY > 10){
        setBlackHeadre(true)
      }else{
        setBlackHeadre(false)
      }
     }

     window.addEventListener('scroll', scrollListener)
     return () =>{
       window.removeEventListener('scroll', scrollListener)
     }
  },[])

  return(
    <div className="page">

      <Header black={blackHeader}/>
      
    {featureData && 
    <FeatureMovie item={featureData }/>
    }

      <section className="lists">
        {movieList.map((item, key)=>(
          <div>
            <MovieRow key={key} title={item.title} items={item.items}/>
          </div>
        ))}
      </section>

      <footer>
        Direitos de imagem para Netflix<br/>
        Dados pegos do site Themoviedb.org<br/>
        Feito com a ajuda do <a href="https://www.youtube.com/channel/UCw9mYSlqKRXI6l4vH-tAYpQ" target='_blank'>Bonieky Lacerda</a><br/>
      </footer>

      {movieList.length <= 0 &&

      <div className="loading">
        <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando" />
      </div>
      }
    </div>
  )
}
