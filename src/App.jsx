import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import Confetti from 'react-confetti'

const gameIcons = ["A","B","C","D","E","F"]

function App() {

  const [pieces,setPieces] = useState([])
  const [score,setScore] = useState(0)

  let timeout = useRef()
  const isGameCompleted = useMemo(()=>{
    if(pieces.length > 0 && pieces.every((piece=>piece.solved))){
      return true;
    }
    return false
  }
  ,[pieces])

  const startGame = ()=>{
    const duplicateGameIcons = gameIcons.concat(gameIcons)
    const newGameIcons = []
    while(newGameIcons.length < gameIcons.length * 2){
      const randomIndex = Math.floor(Math.random()* duplicateGameIcons.length)
      newGameIcons.push({
        letter: duplicateGameIcons[randomIndex],
        flipped:false,
        solved:false,
        position:newGameIcons.length
      })
      duplicateGameIcons.splice(randomIndex,1)
    }
    setPieces(newGameIcons)
  }

  useEffect(()=>{
    startGame()
  },[])

  const handleActive =(data)=>{
    const flippedData = pieces.filter(data=>data.flipped&& !data.solved)
    if(flippedData.length === 2) return;

    const newPieces = pieces.map((piece)=>{
      if(piece.position === data.position){
        piece.flipped = !piece.flipped
      }
      return piece
    });
    setPieces(newPieces)
  };

  const gameLogicForFlipped = ()=>{
    const flippedData = pieces.filter(data=>data.flipped && !data.solved)
    if(flippedData.length === 2){
      timeout.current = setTimeout(() => {

        setPieces(pieces.map(data=>{
          if(data.position === flippedData[0].position || data.position === flippedData[1].position ){
            
            if(flippedData[0].letter === flippedData[1].letter){
              data.solved = true
              setScore(score+10)
            }
            else{
              data.flipped = false
              if(score > 0){
                setScore(score-5)
              }
            }
          }
          return data;
        }
        ))
      }, 800);
    }
  }



  useEffect(()=>{
    gameLogicForFlipped()
    return ()=>clearTimeout(timeout.current)
  },[pieces])

  return (
    <>
     <main>
      <h1>Memory Game</h1>
      <h2>Score: {score}</h2>
      <div className='container'>
        {
          pieces.map((data,index)=>(
            <div className={`flip-card ${data.flipped ? "active":""}`} key={index} 
            onClick={()=> handleActive(data)}>
              <div className="flip-card-inner">
                <div className="flip-card-front"></div>
                <div className="flip-card-back">{data.letter}</div>
              </div>
            </div>
          ))
        }
       
      </div>
      {isGameCompleted && 
      <div className='game-completed'>
        <h1>YOU WIN!!!<br/>Your Score is {score}</h1>
        <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
      />
      </div>
      }
      
     </main>
    </>
  )
}

export default App
